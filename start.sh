#!/bin/bash

# === SC Discord Bot Start Script with Mode Selection & Background API ===

echo "💎 Welcome to the SC Discord Bot Setup"
echo "Please select a mode:"
echo "1) Dev mode (Vite live reload)"
echo "2) Prod mode (Build + API via FastAPI)"
read -p "Your choice [1-2]: " MODE

if [ "$MODE" == "1" ]; then
  MODE="dev"
elif [ "$MODE" == "2" ]; then
  MODE="prod"
else
  echo "❌ Invalid input. Exiting."
  exit 1
fi

echo "▶️ Running in '$MODE' mode..."

# --- Backend Setup ---
if [ ! -d "venv" ]; then
  echo "📦 Creating virtual environment..."
  python3 -m venv venv
fi

echo "🐍 Activating virtual environment..."
source ./venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

if [ ! -f ".env" ]; then
  read -p "🔑 Enter your Discord Bot Token: " TOKEN_INPUT
  echo "DISCORD_BOT_TOKEN=$TOKEN_INPUT" > .env
  echo "✅ .env created."
fi

echo "🚀 Starting backend API in background..."
uvicorn api:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# --- Frontend Setup ---
LOCAL_IP=$(ip route get 1 | awk '{print $7;exit}')
ENV_PATH="dashboard/.env"
APP_PATH="dashboard/src/App.jsx"
echo "VITE_API_BASE=http://$LOCAL_IP:8000" > "$ENV_PATH"

if grep -q 'VITE_API_BASE || "http://' "$APP_PATH"; then
  sed -i "s|VITE_API_BASE || \"http://.*:8000\"|VITE_API_BASE || \"http://$LOCAL_IP:8000\"|g" "$APP_PATH"
fi

cd dashboard
npm install

if [ "$MODE" == "dev" ]; then
  echo "🧪 Starting frontend in Dev Mode..."
  npm run dev -- --host 0.0.0.0 --port 5173
else
  echo "🏗️  Building frontend..."
  npm run build
  cd ..
  echo "🌐 Frontend available via FastAPI on http://$LOCAL_IP:8000/dashboard"
  echo "✅ Setup complete. Press Ctrl+C to stop."
  wait $BACKEND_PID
fi
