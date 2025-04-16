#!/bin/bash

# Start backend (FastAPI) in background
echo "Starting FastAPI backend..."
cd bot
uvicorn api:app --reload &
BACKEND_PID=$!
cd ..

# Start frontend (React)
echo "Starting React frontend..."
cd discord-bot-dashboard
npm run dev

# Optional: Kill backend when frontend exits (optional)
kill $BACKEND_PID
