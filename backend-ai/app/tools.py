import os, math, requests

MAPS_KEY = os.getenv("MAPS_API_KEY", "")

def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    return 2 * R * math.asin(math.sqrt(a))

def estimate_travel_time_minutes(a, b, mode="walking"):
    if MAPS_KEY:
        url = "https://maps.googleapis.com/maps/api/distancematrix/json"
        params = {"origins":f"{a['lat']},{a['lng']}", "destinations":f"{b['lat']},{b['lng']}", "key": MAPS_KEY, "mode": mode}
        r = requests.get(url, params=params)
        if r.ok:
            data = r.json()
            try:
                secs = data['rows'][0]['elements'][0]['duration']['value']
                return int(secs/60)
            except Exception:
                pass
    dist_km = haversine(a['lat'], a['lng'], b['lat'], b['lng'])
    speed_kmph = {"walking":5, "transit":20, "driving":40}.get(mode,20)
    return max(5, int((dist_km / speed_kmph)*60))
