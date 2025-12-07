import React, {useState} from "react";
import axios from "axios";
import ItineraryView from "./ItineraryView";

export default function PlanForm(){
  const [destination,setDestination] = useState("Paris");
  const [interests,setInterests] = useState("art,history");
  const [itinerary,setItinerary] = useState(null);
  const [loading,setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try{
      const payload = { destination, dates:{start:"2025-11-01",end:"2025-11-02"}, interests: interests.split(",").map(s=>s.trim()), day_hours:8 };
      const res = await axios.post("http://localhost:5000/api/ai/plan", payload);
      setItinerary(res.data);
    }catch(e){
      alert("Error: "+ (e.response?.data?.error || e.message));
    } finally { setLoading(false) }
  };

  return (<div>
    <form onSubmit={submit}>
      <div><label>Destination</label><input value={destination} onChange={e=>setDestination(e.target.value)} /></div>
      <div><label>Interests (comma)</label><input value={interests} onChange={e=>setInterests(e.target.value)} /></div>
      <button type="submit">{loading? "Planning...":"Plan Trip"}</button>
    </form>
    {itinerary && <ItineraryView data={itinerary} />}
  </div>)
}
