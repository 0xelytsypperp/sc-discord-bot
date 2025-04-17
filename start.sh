#!/bin/bash

# Start backend (FastAPI) in background
echo "Starting FastAPI backend..."
cd bot
uvicorn api:app --reload &
BACKEND_PID=$!
cd ..

# Start frontend (React)
echo "Starting React frontend..."
cd dashboard
npm run dev --force

# Optional: Kill backend when frontend exits (optional)
kill $BACKEND_PID
