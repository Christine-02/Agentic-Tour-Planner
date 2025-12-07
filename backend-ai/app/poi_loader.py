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

SAMPLE_POIS = [
    # Paris POIs
    {"id":"louvre","name":"Louvre Museum","city":"Paris","category":"art","desc":"World-famous art museum. Best in morning.","lat":48.8606,"lng":2.3376,"open":"09:00","close":"18:00","duration_mins":120},
    {"id":"notre_dame","name":"Notre Dame Cathedral","city":"Paris","category":"history","desc":"Historic cathedral. Currently scaffolding might be present.","lat":48.8530,"lng":2.3499,"open":"08:00","close":"18:00","duration_mins":45},
    {"id":"rodin","name":"Rodin Museum","city":"Paris","category":"art","desc":"Sculpture museum with gardens.","lat":48.8556,"lng":2.3158,"open":"10:00","close":"18:00","duration_mins":90},
    {"id":"marais","name":"Le Marais","city":"Paris","category":"food,shopping","desc":"Historic neighborhood with markets.","lat":48.8570,"lng":2.3620,"open":"09:00","close":"22:00","duration_mins":90},
    {"id":"eiffel","name":"Eiffel Tower","city":"Paris","category":"architecture,landmarks","desc":"Iconic iron lattice tower. Best visited early morning or late evening.","lat":48.8584,"lng":2.2945,"open":"09:00","close":"23:00","duration_mins":90},
    {"id":"arc_triomphe","name":"Arc de Triomphe","city":"Paris","category":"history,architecture","desc":"Monumental arch honoring those who fought for France.","lat":48.8738,"lng":2.2950,"open":"10:00","close":"22:00","duration_mins":60},
    
    # New York POIs
    {"id":"statue_liberty","name":"Statue of Liberty","city":"New York","category":"landmarks,history","desc":"Iconic symbol of freedom. Access via ferry.","lat":40.6892,"lng":-74.0445,"open":"09:00","close":"17:00","duration_mins":180},
    {"id":"central_park","name":"Central Park","city":"New York","category":"nature,parks","desc":"843-acre urban park in Manhattan. Great for walking and relaxing.","lat":40.7829,"lng":-73.9654,"open":"06:00","close":"01:00","duration_mins":120},
    {"id":"met_museum","name":"Metropolitan Museum of Art","city":"New York","category":"art,museums","desc":"World's largest art museum. Allow 3-4 hours.","lat":40.7794,"lng":-73.9632,"open":"10:00","close":"17:30","duration_mins":240},
    {"id":"times_square","name":"Times Square","city":"New York","category":"entertainment,nightlife","desc":"Famous commercial intersection and entertainment hub.","lat":40.7580,"lng":-73.9855,"open":"00:00","close":"23:59","duration_mins":60},
    {"id":"brooklyn_bridge","name":"Brooklyn Bridge","city":"New York","category":"architecture,landmarks","desc":"Historic suspension bridge. Great for walking across.","lat":40.7061,"lng":-73.9969,"open":"00:00","close":"23:59","duration_mins":90},
    
    # London POIs
    {"id":"big_ben","name":"Big Ben & Houses of Parliament","city":"London","category":"architecture,landmarks","desc":"Iconic clock tower and seat of UK government.","lat":51.4994,"lng":-0.1245,"open":"09:00","close":"17:00","duration_mins":60},
    {"id":"british_museum","name":"British Museum","city":"London","category":"art,museums,history","desc":"World-famous museum with vast collection. Free entry.","lat":51.5194,"lng":-0.1270,"open":"10:00","close":"17:00","duration_mins":180},
    {"id":"tower_bridge","name":"Tower Bridge","city":"London","category":"architecture,landmarks","desc":"Victorian Gothic bascule bridge over River Thames.","lat":51.5055,"lng":-0.0754,"open":"09:30","close":"18:00","duration_mins":60},
    {"id":"westminster","name":"Westminster Abbey","city":"London","category":"history,architecture","desc":"Gothic church and coronation site.","lat":51.4994,"lng":-0.1273,"open":"09:30","close":"15:30","duration_mins":90},
    {"id":"hyde_park","name":"Hyde Park","city":"London","category":"nature,parks","desc":"Large royal park in central London.","lat":51.5073,"lng":-0.1657,"open":"05:00","close":"00:00","duration_mins":120},
    
    # Tokyo POIs
    {"id":"shibuya","name":"Shibuya Crossing","city":"Tokyo","category":"landmarks,photography","desc":"World's busiest pedestrian crossing. Iconic Tokyo experience.","lat":35.6580,"lng":139.7016,"open":"00:00","close":"23:59","duration_mins":45},
    {"id":"sensoji","name":"Sensoji Temple","city":"Tokyo","category":"history,culture","desc":"Tokyo's oldest temple in Asakusa. Beautiful traditional architecture.","lat":35.7148,"lng":139.7967,"open":"06:00","close":"17:00","duration_mins":90},
    {"id":"tsukiji","name":"Tsukiji Outer Market","city":"Tokyo","category":"food,markets","desc":"Famous fish market. Best early morning for fresh sushi.","lat":35.6654,"lng":139.7703,"open":"05:00","close":"14:00","duration_mins":120},
    {"id":"harajuku","name":"Harajuku","city":"Tokyo","category":"shopping,food","desc":"Youth culture district with trendy shops and cafes.","lat":35.6702,"lng":139.7027,"open":"10:00","close":"20:00","duration_mins":120},
    {"id":"tokyo_tower","name":"Tokyo Tower","city":"Tokyo","category":"architecture,landmarks","desc":"Red Eiffel Tower-inspired communications tower with observation decks.","lat":35.6586,"lng":139.7454,"open":"09:00","close":"22:00","duration_mins":90},
]

def load_sample_into_chroma(persist_directory="./chroma_db"):
    api_key = os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("OPENAI_BASE_URL")
    
    # Configure embeddings with optional OpenRouter support
    if base_url:
        # Using OpenRouter or custom endpoint
        embeddings = OpenAIEmbeddings(
            base_url=base_url,
            api_key=api_key,
            model="text-embedding-ada-002"
        )
    else:
        # Using standard OpenAI endpoint
        embeddings = OpenAIEmbeddings()
    
    texts = []
    metadatas = []
    ids = []
    for p in SAMPLE_POIS:
        text = f"{p['name']}. {p['desc']}. Category: {p['category']}. City: {p['city']}"
        texts.append(text)
        metadatas.append(p)
        ids.append(p['id'])
    db = Chroma.from_texts(texts, embeddings, ids=ids, persist_directory=persist_directory, metadatas=metadatas)
    # Persist is automatic with persist_directory parameter in newer versions
    print("Loaded sample POIs into Chroma at", persist_directory)

if __name__ == "__main__":
    load_sample_into_chroma()
