""" 
This file is for Vectore Store Checking Only
"""
from dotenv import load_dotenv
load_dotenv()

from langchain.chat_models import init_chat_model
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

llm = init_chat_model("gpt-4o-mini", model_provider="openai")
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
# Reconnect to your persisted DB
vector_store = Chroma(
    collection_name="plm_assistant_db",
    embedding_function=embeddings,
    persist_directory="./data/chroma_plm_db",
)

# Count how many documents are stored
# print(f"Documents in DB: {vector_store._collection}")

#all_docs = vector_store.get(None, None, 2)
# print("All Documents:\n" + "\n\n----------------\n\n".join(str(doc) for doc in all_docs["documents"]))


# Retrieve a few stored documents
# results = vector_store.similarity_search("Who is the President of the University?", k=5)
# results = vector_store.similarity_search("Who is Dr. Ma. Leonora V. De Jesus", k=5)
# results = vector_store.similarity_search("What is PLM?", k=5)
# results = vector_store.similarity_search("PLM", k=5)
results = vector_store.similarity_search("Who established plm?", k=5)


for i, doc in enumerate(results):
    print("=" * 80)
    print(f"📄 Result {i+1}")
    print(f"Source: {doc.metadata.get('source', 'N/A')}")
    print("Content:")
    print(doc.page_content)