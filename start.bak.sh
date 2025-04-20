#!/bin/bash

# Start backend (FastAPI) in background
echo "Starting FastAPI backend..."
cd bot
uvicorn api:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# Start frontend (React)
echo "Starting React frontend..."
cd dashboard
npm run dev -- --host 0.0.0.0 --port 5173

# Optional: Kill backend when frontend exits (optional)
kill $BACKEND_PID
