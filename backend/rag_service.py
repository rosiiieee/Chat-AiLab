from dotenv import load_dotenv
load_dotenv()

# Components
from langchain.chat_models import init_chat_model
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langgraph.checkpoint.memory import InMemorySaver  

llm = init_chat_model("gemini-2.5-flash", model_provider="google_genai")
embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")

vector_store = Chroma(
    collection_name="plm_assistant_db",
    embedding_function=embeddings,
    persist_directory="./admin/data/chroma_plm_db",
)


from langchain_core.documents import Document
from typing_extensions import List, TypedDict
from typing_extensions import Annotated
from typing import Literal

class QueryAnalysis(TypedDict):
    """ This QueryAnalysis class is used for Query Analysis where we analyze the class of the question """

    # Annotated means: section must be one of these 8 exact strings, and it’s required, and here’s a description.
    section: Annotated[
        Literal['general_university_information', 
                'student_rights_and_responsibility', 
                'academic_policies', 
                'student_affairs_and_services',
                'student_councils_organizations_and_activities_policies',
                'campus_publication',
                'disciplinary_policies',
                'general_provisions_glossary_and_appendices'],
        ...,
        "Section to query.",
    ]

class Message(TypedDict):
    role: Literal['user', 'assistant']
    content: str

class State(TypedDict):
    messages: List[Message]           # converstation history (max 10)
    new_message: str
    classification: QueryAnalysis     # contain classification of last 3 messages
    hypothetical_question: str        # HyDE output, internal only
    context: List[Document]           # retrieved docs from vector store
    answer: str                       # assistant answer


def append_user_message(state: State):
    """Append the incoming user message to the state['messages'] list."""
    if 'messages' not in state:
        state['messages'] = []

    new_messages: List[Message] = state["messages"] + [{"role": "user", "content": state["new_message"]}]

    return {'messages': new_messages}


# --- QUERY ANALYSIS NODE ---

from langchain_core.prompts import ChatPromptTemplate

def analyze_query(state: State):
    """ This function would return a query (QueryAnalysis: data type) which has dict of section. """
    
    print('started analyzing query...')
    
    # python comprehensions
    last_user_msgs = [
        message['content'] for message in state['messages'][-6:] if (message['role'] == 'user')
    ]

    last_user_msg_combined = "\n".join(
        f"User message {i+1}: {message}" for i, message in enumerate(last_user_msgs)
    )

    print('-----\nlast_user_msg_combined: \n', last_user_msg_combined)

    query_prompt = ChatPromptTemplate.from_template(
        """
        Classify the **latest** user message into the appropriate section of the PLM Student Manual.
        Focus on the latest user message, but use previous ones as context if needed.

        Sections:
        general_university_information: history, charter, mission, vision, values, officials, seal, emblems, colors
        student_rights_and_responsibility: rights, responsibilities, academic integrity, freedom of expression, access to records, conduct
        academic_policies: admissions, programs, grading, GWA, scholarships, load, residency, transfer, honors
        student_affairs_and_services: student services, OSDS, registrar, library, health services, security, scholarships, welfare programs
        student_councils_organizations_and_activities_policies: councils, organizations, accreditation, advisers, officer eligibility, funding, events, logo use, discipline
        campus_publication: student publication, Ang Pamantasan, freedom of the press, editorial board, ethics, publication schedule
        disciplinary_policies: code of conduct, offenses, penalties, suspension, expulsion, due process, investigation, mitigation
        general_provisions_glossary_and_appendices: effectivity, amendments, glossary, dress code, RA 8049, RA 7877, RA 7079, forms, policies


        User message:
        {questions}
        """
    )

    structured_llm = llm.with_structured_output(QueryAnalysis)
    query_prompt_filled = query_prompt.invoke({'questions': last_user_msg_combined})
    classification = structured_llm.invoke(query_prompt_filled)
    print('done analyzing query...')
    return {"classification": classification}


# --- HYPOTHETICAL DOCUMENT EMBEDDING NODE ---

hyde_prompt = ChatPromptTemplate.from_template("""
    Instructions:
    - Focus on the latest user message, but use previous ones as context if needed.
    - If the question is about Pamantasan ng Lungsod ng Maynila (PLM) or School, generate a short (2–3 sentence) *hypothetical handbook-style answer* that plausibly appears in the PLM Student Manual.
    - If the input is just a greeting, small talk, or unrelated to PLM policies, repeat the user’s input as-is.
    - Use a formal tone only when generating a policy answer.
                                               
    User messages:
    {questions}

    """)


def generate_hypothetical(state: State): 
    last_user_msgs = [
        message['content'] for message in state['messages'][-6:] if (message['role'] == 'user')
    ]

    last_user_msg_combined = "\n".join(
        f"User message {i+1}: {message}" for i, message in enumerate(last_user_msgs)
    )

    print('generating hypothetical prompt...')

    message_prompt = hyde_prompt.invoke({"questions": last_user_msg_combined})
    response = llm.invoke(message_prompt)
    print('done generated hypothetical prompt')
    
    return {"hypothetical_question": response.content}


# --- RETRIEVAL NODE ---

def retrieve(state: State):
    print("retrieving context...")
    hyde_text = state["hypothetical_question"]
    section = state["classification"]["section"]
    retrieved_docs = vector_store.similarity_search(hyde_text, k=8, filter={'section': section})
    print('done retrieve...')

    return {"context": retrieved_docs}



# --- GENERATION NODE ---

prompt = ChatPromptTemplate.from_template("""
    You are a friendly assistant specializing in Pamantasan ng Lungsod ng Maynila (PLM) rules and regulations. Answer the user's question using ONLY the provided context.

    Instructions:
    1. Read and synthesize ALL relevant context chunks.
    2. Summarize the policy clearly, using formal terms (e.g., GWA, Maximum Residency Rule, OSDS) to ensure accuracy.
    3. Integrate related policies or sections when needed.
    4. If the question is NOT covered in the context, respond politely stating you do not have knowledge outside the information you are given.
    5. Keep a conversational and engaging tone; greet the user if they start with "hi" or "hello."
    6. Use the same language as the user's input when generating the answer.
    7. When referring to your source, say “based on the information I have” instead of “context.”
    8. Focus on the latest user input, but use previous ones as context if needed.

    Context:
    {context}

    User input:
    {questions}
    """)


def generate(state: State):
    print('started generate...')

    docs_content = "\n\n".join(doc.page_content for doc in state["context"])

    last_msgs  = state["messages"][-8:]

    last_msg_combined = "\n".join(
        f"{m['role'].capitalize()}: {m['content']}" for m in last_msgs
    )

    messages = prompt.invoke({"questions": last_msg_combined, "context": docs_content}) # takes a dictionary of input variables and fills them into the template.
    print('\n\ngenerate_last_msg_combined:\n' + last_msg_combined)
    
    print('got context and putted in prompt message...')

    response = llm.invoke(messages)
    print('done generate...')

    return {"answer": response.content}

def append_ai_message(state: State):
    """Append the ai response to the state['messages'] list."""
    if 'messages' not in state:
        state['messages'] = []

    new_messages: List[Message] = state["messages"] + [{"role": "assistant", "content": state["answer"]}]

    return {'messages': new_messages}


# Control Flow
from langgraph.graph import START, StateGraph

graph_builder = StateGraph(State)
graph_builder.add_sequence([
    append_user_message,
    analyze_query,
    generate_hypothetical,
    retrieve,
    generate,
    append_ai_message
])

graph_builder.add_edge(START, 'append_user_message')

graph = graph_builder.compile(checkpointer=InMemorySaver())


# Invoke Function
def invoke(new_user_message: str, user_thread_id: int):

    result = graph.invoke(
        {"new_message": new_user_message},
        config={"configurable": {"thread_id": user_thread_id}},
    )

    print(f"User Message: {new_user_message}\n\n")
    print(f"User Query: {result['classification']}\n\n")
    print(f"Hypothetical Message: {result['hypothetical_question']}\n\n")
    print(f"Context: {result['context']}\n\n")
    print(f"Answer: {result['answer']}")

    return result