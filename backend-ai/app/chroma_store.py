import os
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env file
# Try current directory first, then parent directory (backend-ai/)
env_path = Path(__file__).parent / '.env'
if not env_path.exists():
    env_path = Path(__file__).parent.parent / '.env'
load_dotenv(env_path)

CHROMA_DIR = os.getenv("CHROMA_DIR", "./chroma_db")

def get_chroma_retriever(k=6):
    try:
        api_key = os.getenv("OPENAI_API_KEY")
        base_url = os.getenv("OPENAI_BASE_URL")
        
        # Configure embeddings with optional OpenRouter support
        if base_url:
            # Using OpenRouter or custom endpoint
            # Note: For embeddings via OpenRouter, you may need to use a specific embedding model
            # Default to text-embedding-ada-002 which works with most OpenAI-compatible APIs
            embeddings = OpenAIEmbeddings(
                base_url=base_url,
                api_key=api_key,
                model="text-embedding-ada-002"
            )
        else:
            # Using standard OpenAI endpoint
            embeddings = OpenAIEmbeddings()
        
        persist_directory = CHROMA_DIR
        db = Chroma(persist_directory=persist_directory, embedding_function=embeddings)
        retriever = db.as_retriever(search_type="similarity", search_kwargs={"k": k})
        return retriever, db
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error initializing ChromaDB: {str(e)}")
        print(error_details)
        raise Exception(f"Failed to initialize ChromaDB: {str(e)}. Make sure ChromaDB directory exists and has data.")
