# 🧭 Tour Planner with Agentic AI (Single-Agent Prototype)
A lightweight AI-driven tour planning system that uses **LangChain**, **RAG**, **ChromaDB**, and an **LLM** to generate personalized travel itineraries.

This is the first working prototype of the project, currently built as a **single-agent pipeline**.  
Future versions may expand into a multi-agent architecture, but this version focuses on delivering reliable itinerary generation through retrieval-augmented reasoning.

---

## 📌 Overview
The system takes a destination and user preferences and produces a **custom AI-generated travel itinerary**.  
It uses a combination of:

- **LLM reasoning**  
- **Retrieval-Augmented Generation (RAG)**  
- **Chroma vector database**  
- **LangChain chains and tools**

The goal is to provide an intelligent travel assistant that generates practical and relevant itineraries rather than generic travel suggestions.

---

## ✨ Current Features

### 🔍 Retrieval-Augmented Itinerary Generation
- Stores travel-related documents, attraction data, and POI information in **ChromaDB**  
- Retrieves the most relevant context based on user input  
- Feeds the retrieved context into an LLM to produce **accurate, grounded itineraries**

### 🧠 Single-Agent Workflow (Current Version)
One orchestrated agent handles:
- Query understanding  
- Context retrieval from Chroma  
- Itinerary generation using the LLM  
- Formatting the final output into a clean day-by-day plan  

### 🗺️ Itinerary Generation Capabilities
- Suggests attractions, restaurants, cultural spots, etc.  
- Builds logical routes and daily schedules  
- Customizes based on pace (relaxed, busy, adventure, cultural, etc.)  
- Accepts user constraints (budget, interests, time limits)

---

## 🛠️ Tech Stack

### Core Components
| Component | Purpose |
|----------|---------|
| **LangChain** | Orchestration + chaining retrieval + LLM reasoning |
| **ChromaDB** | Vector store for RAG |
| **LLM (OpenAI / similar)** | Generates final itinerary |
| **Python** | Main implementation language |

