import os
from fastapi import FastAPI
from pydantic import BaseModel
from agent import plan_itinerary
from chroma_store import get_chroma_retriever
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env file
# Try current directory first, then parent directory (backend-ai/)
env_path = Path(__file__).parent / '.env'
if not env_path.exists():
    env_path = Path(__file__).parent.parent / '.env'
load_dotenv(env_path)
app = FastAPI(title="Tour Planner AI")

class TripRequest(BaseModel):
    destination: str
    dates: dict
    interests: list
    day_hours: int = 8

@app.post("/plan_trip")
def plan_trip(req: TripRequest):
    try:
        prefs = {"interests": req.interests}
        res = plan_itinerary(req.destination, req.dates, prefs, day_hours=req.day_hours)
        return res
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error in plan_trip: {str(e)}")
        print(error_details)
        return {"error": f"Failed to plan itinerary: {str(e)}"}

@app.get("/health")
def health():
    return {"status":"ok"}

@app.get("/check_chromadb")
def check_chromadb():
    """Check if ChromaDB has data"""
    try:
        retriever, db = get_chroma_retriever(k=1)
        # Try to get a document to see if there's data
        # Try both methods for compatibility
        try:
            docs = retriever.get_relevant_documents("test query")
        except AttributeError:
            # Try invoke method for newer langchain versions
            docs = retriever.invoke("test query")
        
        count = len(docs)
        if count > 0:
            # Get metadata from document
            sample_poi = None
            if docs:
                if hasattr(docs[0], 'metadata'):
                    sample_poi = docs[0].metadata
                elif isinstance(docs[0], dict):
                    sample_poi = docs[0].get('metadata', docs[0])
            
            return {
                "status": "ok",
                "has_data": True,
                "message": f"ChromaDB has data. Found {count} document(s) with test query.",
                "sample_poi": sample_poi
            }
        else:
            return {
                "status": "empty",
                "has_data": False,
                "message": "ChromaDB exists but is empty. Please load sample data."
            }
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        return {
            "status": "error",
            "has_data": False,
            "error": str(e),
            "message": "ChromaDB may not be initialized. Please load sample data first.",
            "details": error_details
        }

@app.post("/load_sample_data")
def load_sample_data():
    """Load sample POI data into ChromaDB"""
    try:
        from poi_loader import load_sample_into_chroma
        import os
        persist_directory = os.getenv("CHROMA_DIR", "./chroma_db")
        load_sample_into_chroma(persist_directory=persist_directory)
        return {"status": "success", "message": f"Loaded sample POIs into ChromaDB at {persist_directory}"}
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error loading sample data: {str(e)}")
        print(error_details)
        return {"status": "error", "error": f"Failed to load sample data: {str(e)}"}
