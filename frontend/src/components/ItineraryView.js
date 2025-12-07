import React from "react";

export default function ItineraryView({data}){
  if(data.error) return <div>Error: {data.error}</div>;
  return <div>
    <h3>Itinerary for {data.city}</h3>
    {data.itinerary.map(day => (
      <div key={day.day} style={{border:"1px solid #ddd", margin:8, padding:8}}>
        <h4>Day {day.day}</h4>
        {day.steps.map((s,i) => (
          <div key={i} style={{marginBottom:6}}>
            <strong>{s.name}</strong> — {s.category} — {s.duration_mins} mins — travel {s.travel_from_prev_mins} mins
            <div style={{fontSize:12}}>{s.desc}</div>
          </div>
        ))}
      </div>
    ))}
  </div>
}
