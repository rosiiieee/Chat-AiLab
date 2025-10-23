""" 
This file is for Vectore Store Indexing Only
"""

from dotenv import load_dotenv
load_dotenv()

# Components
from langchain.chat_models import init_chat_model
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma

llm = init_chat_model("gemini-2.5-flash", model_provider="google_genai")
embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")

vector_store = Chroma(
    collection_name="plm_assistant_db",
    embedding_function=embeddings,
    persist_directory="./data/chroma_plm_db",
)

vector_store.reset_collection()  # optional reset before adding again


# Load data
from langchain_community.document_loaders import DirectoryLoader, TextLoader

loader = DirectoryLoader(
    path="./data",
    glob="[0-9]*.txt",
    loader_cls=TextLoader,
    loader_kwargs={"encoding": "utf-8", "autodetect_encoding": True}
)

docs = loader.load()

print(f"✅ Loaded {len(docs)} document(s)")
print(f"Total characters of 1st doc: {len(docs[0].page_content)}")

# Split data
from langchain_text_splitters import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
all_splits = text_splitter.split_documents(docs)

print(f"Splitted documents into {len(all_splits)} sub-documents.")

# Store data
document_ids = vector_store.add_documents(documents=all_splits)
print(document_ids[:10])