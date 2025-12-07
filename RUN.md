# How to Run the Tour Planner App

This app consists of 4 services that need to be running. Follow these steps in order:

## Prerequisites

- Node.js 16+ installed
- Python 3.8+ installed
- Docker and Docker Compose installed (for MongoDB)
- Your OpenAI/OpenRouter API key configured (see `backend-ai/app/OPENAI_SETUP.md`)

## Step-by-Step Setup

### 1. Start MongoDB (Database)

First, start the MongoDB service using Docker Compose:

```bash
cd /Users/christine/Downloads/tour-planner
docker-compose up -d
```

This will start MongoDB on port `27017`. Verify it's running:

```bash
docker-compose ps
```

### 2. Set Up Environment Variables

#### Backend-Node (Express Server)

Create a `.env` file in `backend-node/`:

```bash
cd backend-node
cat > .env << 'EOF'
MONGO_URI=mongodb://localhost:27017/tour-planner
AI_BASE_URL=http://localhost:8000
PORT=5000
EOF
```

#### Backend-AI (FastAPI/Python Server)

Create a `.env` file in `backend-ai/app/` (if you haven't already):

```bash
cd backend-ai/app
cat > .env << 'EOF'
OPENAI_API_KEY=your-actual-api-key-here
OPENAI_MODEL=meta-llama/llama-3.1-8b-instruct
OPENAI_BASE_URL=https://openrouter.ai/api/v1
CHROMA_DIR=./chroma_db
EOF
```

**Replace `your-actual-api-key-here` with your actual OpenRouter API key.**

### 3. Install Dependencies

#### Install Python Dependencies (Backend-AI)

```bash
cd backend-ai/app
pip install -r requirements.txt
```

#### Install Node Dependencies

**Backend-Node:**

```bash
cd backend-node
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

### 4. Start the Services

You'll need **4 terminal windows/tabs** to run all services:

#### Terminal 1: MongoDB (if not already running via docker-compose)

```bash
docker-compose up
```

#### Terminal 2: Backend-AI (FastAPI) - Port 8000

```bash
cd backend-ai/app
uvicorn main:app --reload --port 8000
```

You should see:

```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

#### Terminal 3: Backend-Node (Express) - Port 5000

```bash
cd backend-node
npm start
```

You should see:

```
Node server on 5000
```

#### Terminal 4: Frontend (React) - Port 3000

```bash
cd frontend
npm start
```

This will automatically open your browser to `http://localhost:3000`

## Verify Everything is Running

1. **MongoDB**: `docker-compose ps` should show MongoDB running
2. **Backend-AI**: Visit http://localhost:8000/health - should return `{"status":"ok"}`
3. **Backend-Node**: Should see "Node server on 5000" in terminal
4. **Frontend**: Browser should open to http://localhost:3000

## Ports Summary

- **Frontend**: http://localhost:3000
- **Backend-Node (API)**: http://localhost:5000
- **Backend-AI (AI API)**: http://localhost:8000
- **MongoDB**: localhost:27017

## Troubleshooting

### MongoDB won't start

- Make sure Docker is running
- Check if port 27017 is already in use: `lsof -i :27017`

### Backend-AI errors

- Make sure your `.env` file in `backend-ai/app/` has the correct `OPENAI_API_KEY`
- Check that you've installed all Python dependencies

### Backend-Node can't connect to MongoDB

- Verify MongoDB is running: `docker-compose ps`
- Check that `MONGO_URI` in `backend-node/.env` is correct

### Frontend can't connect to APIs

- Make sure both backend services are running
- Check the console for CORS or connection errors

## Stopping the Services

1. **MongoDB**: `docker-compose down`
2. **Other services**: Press `Ctrl+C` in each terminal window

## Quick Start Script (Optional)

You can also create a simple script to start everything at once. Here's a basic example:

```bash
# start-all.sh
#!/bin/bash

# Start MongoDB
docker-compose up -d

# Start Backend-AI
cd backend-ai/app && uvicorn main:app --reload --port 8000 &

# Start Backend-Node
cd backend-node && npm start &

# Start Frontend
cd frontend && npm start

# Wait for all processes
wait
```
