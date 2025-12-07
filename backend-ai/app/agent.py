from langchain_openai import ChatOpenAI
from chroma_store import get_chroma_retriever
from tools import estimate_travel_time_minutes
from typing import List, Dict
import os
import json
import re
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env file
# Try current directory first, then parent directory (backend-ai/)
env_path = Path(__file__).parent / '.env'
if not env_path.exists():
    env_path = Path(__file__).parent.parent / '.env'
load_dotenv(env_path)

# Initialize OpenAI/OpenRouter LLM
llm = None
api_key = os.getenv("OPENAI_API_KEY")
if api_key:
    model = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    base_url = os.getenv("OPENAI_BASE_URL")
    
    if base_url:
        # Using OpenRouter or custom endpoint
        # ChatOpenAI uses chat/completions endpoint which OpenRouter requires
        llm = ChatOpenAI(
            temperature=0.0,
            model=model,
            base_url=base_url,
            api_key=api_key
        )
    else:
        # Using standard OpenAI endpoint
        llm = ChatOpenAI(temperature=0.0, model=model)

def rank_pois(pois: List[Dict], user_prefs: Dict):
    scored = []
    prefer_cats = user_prefs.get("interests", [])
    for p in pois:
        score = 0
        cats = str(p.get("category","")).lower()
        for ic in prefer_cats:
            if ic.lower() in cats:
                score += 10
        score -= p.get("duration_mins",60)/60.0
        scored.append((score,p))
    scored.sort(key=lambda x: -x[0])
    return [p for s,p in scored]

def generate_pois_with_llm(destination_city: str, user_prefs: Dict):
    """Generate POIs using LLM when ChromaDB doesn't have data for the city"""
    if not llm:
        print("LLM not initialized, cannot generate POIs")
        return []
    
    interests = ', '.join(user_prefs.get('interests', []))
    prompt = f"""You are a travel guide expert. Generate exactly 10-15 popular points of interest (POIs) for {destination_city}.

Requirements for each POI:
1. name: Exact name of the attraction/place (string)
2. category: One or more categories separated by commas: art, history, food, nature, architecture, shopping, landmarks, museums, etc. (string)
3. desc: Brief description in 1-2 sentences (string)
4. duration_mins: Visit duration in minutes, typically 60-180 (integer)
5. lat: Approximate latitude as decimal number between -90 and 90 (float)
6. lng: Approximate longitude as decimal number between -180 and 180 (float)

Focus on these interests: {interests if interests else 'general popular attractions'}

CRITICAL: Return ONLY a valid JSON array. No markdown, no code blocks, no explanations, no extra text before or after.

Example of correct format (use this exact structure):
[{{"name": "Museum Name", "category": "art,museums", "desc": "Description here", "duration_mins": 120, "lat": 40.7128, "lng": -74.0060}}, {{"name": "Park Name", "category": "nature,parks", "desc": "Description", "duration_mins": 90, "lat": 40.7580, "lng": -73.9855}}]

Now generate POIs for {destination_city}:"""
    
    try:
        print(f"Calling LLM to generate POIs for {destination_city}...")
        
        # ChatOpenAI uses invoke() with messages format
        # Convert prompt to message format for chat models
        from langchain_core.messages import HumanMessage
        messages = [HumanMessage(content=prompt)]
        
        # Use invoke() for ChatOpenAI
        if hasattr(llm, 'invoke'):
            response = llm.invoke(messages)
        elif hasattr(llm, 'predict'):
            response = llm.predict(prompt)
        else:
            response = llm(messages)
        
        print(f"LLM response type: {type(response)}")
        
        # Handle response - ChatOpenAI returns AIMessage or similar
        if hasattr(response, 'content'):
            response = response.content
        elif hasattr(response, 'text'):
            response = response.text
        elif hasattr(response, 'message'):
            # Some responses have message.content
            response = response.message.content if hasattr(response.message, 'content') else str(response.message)
        elif not isinstance(response, str):
            response = str(response)
        
        print(f"LLM response (first 200 chars): {response[:200]}")
        
        # Clean response - remove markdown code blocks if present
        response = re.sub(r'```json\s*', '', response)
        response = re.sub(r'```\s*', '', response)
        response = response.strip()
        
        # Extract JSON from response if it contains other text
        json_match = re.search(r'\[.*\]', response, re.DOTALL)
        if json_match:
            response = json_match.group(0)
        
        pois = json.loads(response)
        
        # Validate and ensure all POIs have required fields
        validated_pois = []
        for poi in pois:
            if isinstance(poi, dict) and 'name' in poi:
                # Ensure all required fields exist
                validated_poi = {
                    'name': poi.get('name', 'Unknown'),
                    'category': poi.get('category', 'general'),
                    'desc': poi.get('desc', ''),
                    'duration_mins': poi.get('duration_mins', 60),
                    'lat': poi.get('lat', 0.0),
                    'lng': poi.get('lng', 0.0)
                }
                validated_pois.append(validated_poi)
        
        print(f"Successfully generated {len(validated_pois)} POIs for {destination_city}")
        return validated_pois
        
    except json.JSONDecodeError as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"JSON decode error generating POIs with LLM: {str(e)}")
        print(f"Response was: {response[:500] if 'response' in locals() else 'No response'}")
        print(error_details)
        return []
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error generating POIs with LLM: {str(e)}")
        print(f"Response was: {response[:500] if 'response' in locals() else 'No response'}")
        print(error_details)
        return []

def plan_itinerary(destination_city: str, dates: Dict, user_prefs: Dict, day_hours=8):
    if not llm:
        return {"error": "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable."}
    
    pois = []
    
    # First try to get POIs from ChromaDB
    try:
        retriever, db = get_chroma_retriever(k=20)
        query = f"{destination_city} travel points of interest. Interests: {', '.join(user_prefs.get('interests',[]))}"
        
        # Try both methods for compatibility with different langchain versions
        try:
            docs = retriever.get_relevant_documents(query)
        except AttributeError:
            # Try invoke method for newer langchain versions
            docs = retriever.invoke(query)
        
        # Handle different response formats
        if docs:
            pois = []
            for d in docs:
                if hasattr(d, 'metadata'):
                    pois.append(d.metadata)
                elif isinstance(d, dict):
                    pois.append(d.get('metadata', d))
                else:
                    # If document itself is the metadata
                    pois.append(d if isinstance(d, dict) else {})
        else:
            pois = []
        
        # Filter POIs to only include ones from the requested city (case-insensitive, exact match)
        # This is CRITICAL - we must only use POIs that exactly match the requested city
        unfiltered_count = len(pois)
        filtered_pois = []
        for p in pois:
            poi_city = p.get('city', '').lower().strip()
            dest_city = destination_city.lower().strip()
            if poi_city == dest_city:
                filtered_pois.append(p)
        
        print(f"ChromaDB returned {unfiltered_count} POIs, filtered to {len(filtered_pois)} POIs for city '{destination_city}'")
        
        # Only use filtered POIs if we found exact city matches
        if filtered_pois:
            pois = filtered_pois
            print(f"Using {len(pois)} POIs from ChromaDB for {destination_city}")
        else:
            # No exact city match found in ChromaDB - must generate with LLM
            pois = []
            print(f"No exact city match in ChromaDB for '{destination_city}' (found {unfiltered_count} unmatched POIs from other cities)")
        
        # If no matching POIs in ChromaDB, generate with LLM
        if not pois:
            print(f"No POIs found in ChromaDB for {destination_city}, generating with LLM...")
            generated_pois = generate_pois_with_llm(destination_city, user_prefs)
            if generated_pois and len(generated_pois) > 0:
                print(f"Generated {len(generated_pois)} POIs with LLM for {destination_city}")
                pois = generated_pois
            else:
                print(f"LLM generation failed or returned no POIs for {destination_city}")
                # Return error immediately to avoid going through the rest of the function
                return {
                    "error": f"Could not find or generate POIs for {destination_city}. LLM generation may have failed. Please check server logs for details or try a different city."
                }
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error getting POIs from ChromaDB: {str(e)}")
        print(error_details)
        # Fallback to LLM generation
        print(f"Falling back to LLM generation for {destination_city}...")
        generated_pois = generate_pois_with_llm(destination_city, user_prefs)
        if generated_pois and len(generated_pois) > 0:
            pois = generated_pois
            print(f"LLM fallback successful: Generated {len(pois)} POIs for {destination_city}")
        else:
            return {
                "error": f"Failed to retrieve POIs from ChromaDB and LLM generation also failed for {destination_city}. Error: {str(e)}. Please check server logs for details."
            }
    
    if not pois or len(pois) == 0:
        return {
            "error": f"No POIs found or generated for {destination_city}. ChromaDB search failed and LLM generation returned no results. Please check server logs or try a different city."
        }

    ranked = rank_pois(pois, user_prefs)

    # Improved day distribution algorithm
    # Calculate total time needed for all POIs
    total_time_needed = 0
    for idx, p in enumerate(ranked):
        dur = p.get("duration_mins", 60)
        travel = 0
        if idx > 0:
            prev = ranked[idx - 1]
            travel = estimate_travel_time_minutes(
                {"lat": prev.get("lat", 0), "lng": prev.get("lng", 0)},
                {"lat": p.get("lat", 0), "lng": p.get("lng", 0)}
            )
        total_time_needed += travel + dur
    
    # Estimate number of days needed
    minutes_per_day = day_hours * 60
    estimated_days = max(1, int((total_time_needed / minutes_per_day) + 0.5))
    
    # Distribute POIs more evenly across days
    results = []
    current_day = []
    current_minutes = minutes_per_day
    day_start_minutes = 0  # Track start time for the day (9 AM = 540 minutes from midnight)
    day_start_hour = 9  # Start at 9 AM
    
    for idx, p in enumerate(ranked):
        dur = p.get("duration_mins", 60)
        travel = 0
        if current_day:
            last = current_day[-1]
            travel = estimate_travel_time_minutes(
                {"lat": last.get("lat", 0), "lng": last.get("lng", 0)},
                {"lat": p.get("lat", 0), "lng": p.get("lng", 0)}
            )
        
        # Calculate start time for this activity
        if current_day:
            # Start time = previous activity end time + travel time
            last_activity = current_day[-1]
            last_end_time = last_activity.get("end_time_minutes", day_start_hour * 60)
            start_time_minutes = last_end_time + travel
        else:
            # First activity of the day starts at day_start_hour
            start_time_minutes = day_start_hour * 60
        
        # Check if this activity fits within the daily time limit
        day_end_minutes = (day_start_hour + day_hours) * 60
        required = travel + dur
        
        # Check if we can fit this activity in the current day
        # Also check if adding this would make the day too unbalanced compared to others
        remaining_pois = len(ranked) - idx - 1
        current_day_count = len(current_day)
        avg_pois_per_day = len(ranked) / estimated_days if estimated_days > 0 else len(ranked)
        remaining_days = estimated_days - len(results) - 1  # Days not yet started
        
        # Calculate if we should start a new day
        # Start new day if:
        # 1. Current day doesn't have enough time for this activity
        # 2. Activity would exceed the day's time limit
        # 3. Current day has significantly more activities than average AND we have days left
        # 4. Current day is nearly full (less than 25% time left) AND we have days left AND remaining POIs can be distributed
        should_start_new_day = False
        if current_minutes < required:
            should_start_new_day = True
        elif start_time_minutes + dur > day_end_minutes:
            # Activity would exceed day limit
            should_start_new_day = True
        elif remaining_days > 0:
            # Try to balance: if current day has way more than average, start new day
            if current_day_count > avg_pois_per_day * 1.3 and remaining_pois >= remaining_days:
                should_start_new_day = True
            # If day is nearly full and we have many days left, start new day
            elif current_minutes < minutes_per_day * 0.25 and remaining_pois > remaining_days * 2:
                should_start_new_day = True
        
        if should_start_new_day and current_day:
            # Save current day and start new one
            results.append(current_day)
            current_day = []
            current_minutes = minutes_per_day
            start_time_minutes = day_start_hour * 60
        
        # Recalculate end time after potentially starting a new day
        end_time_minutes = start_time_minutes + dur
        
        # Ensure end time doesn't exceed day limit (adjust duration if needed)
        if end_time_minutes > day_end_minutes:
            # Adjust duration to fit within day limit
            dur = max(30, day_end_minutes - start_time_minutes)  # At least 30 minutes
            end_time_minutes = start_time_minutes + dur
            required = travel + dur  # Update required time with adjusted duration
        
        # Convert minutes to time string (HH:MM format)
        start_hour = int(start_time_minutes // 60)
        start_min = int(start_time_minutes % 60)
        end_hour = int(end_time_minutes // 60)
        end_min = int(end_time_minutes % 60)
        
        # Handle hour overflow (e.g., 25:00 -> 01:00 next day)
        if start_hour >= 24:
            start_hour = start_hour % 24
        if end_hour >= 24:
            end_hour = end_hour % 24
        
        start_time = f"{start_hour:02d}:{start_min:02d}"
        end_time = f"{end_hour:02d}:{end_min:02d}"
        
        # Add activity to current day
        # Use adjusted duration if it was modified to fit within day limit
        activity_data = {
            **p,
            "duration_mins": dur,  # Use potentially adjusted duration
            "travel_from_prev_mins": travel,
            "start_time": start_time,
            "end_time": end_time,
            "start_time_minutes": start_time_minutes,
            "end_time_minutes": end_time_minutes
        }
        current_day.append(activity_data)
        
        # Update remaining minutes for the day
        current_minutes -= (travel + dur)
    
    # Add the last day if it has activities
    if current_day:
        results.append(current_day)

    # Build itinerary with time information
    itinerary = []
    for idx, day in enumerate(results, start=1):
        steps = []
        for stop in day:
            steps.append({
                "name": stop.get("name", ""),
                "category": stop.get("category", ""),
                "duration_mins": stop.get("duration_mins", 60),
                "travel_from_prev_mins": stop.get("travel_from_prev_mins", 0),
                "lat": stop.get("lat", 0),
                "lng": stop.get("lng", 0),
                "desc": stop.get("desc", ""),
                "time": stop.get("start_time", "09:00"),  # For frontend compatibility
                "start_time": stop.get("start_time", "09:00"),
                "end_time": stop.get("end_time", "10:00")
            })
        itinerary.append({"day": idx, "steps": steps})
    
    return {"city": destination_city, "itinerary": itinerary}
