""" 
This file is for Vectore Store Checking Only
"""
from dotenv import load_dotenv
load_dotenv()

from langchain.chat_models import init_chat_model
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma

llm = init_chat_model("gemini-2.5-flash", model_provider="google_genai")
embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")
# Reconnect to your persisted DB
vector_store = Chroma(
    collection_name="plm_assistant_db",
    embedding_function=embeddings,
    persist_directory="./data/chroma_plm_db",
)

# Count how many documents are stored
print(f"Documents in DB: {vector_store._collection.count()}")

# Retrieve a few stored documents
results = vector_store.similarity_search("What is PLM?", k=3)
for r in results:
    print(r.page_content[:200])  # show first 200 chars of each