#!/bin/bash

# === SC Discord Bot Auto-Setup Script with Dev/Prod + Token Prompt ===
# Usage: ./start.auto.devprod.sh [dev|prod]

MODE=$1
if [ -z "$MODE" ]; then
  MODE="prod"
fi

echo "💎 Starting SC Discord Bot Setup in '$MODE' mode..."

ROOT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$ROOT_DIR"

# --- STEP 1: Backend setup ---
echo "🐍 Checking Python virtual environment in ./bot ..."
cd bot
if [ ! -d "venv" ]; then
  echo "📦 Creating virtual environment..."
  python3 -m venv venv
fi

echo "🐍 Activating virtual environment..."
source venv/bin/activate

echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r ../requirements.txt

# --- STEP 2: .env for Bot ---
if [ ! -f ".env" ]; then
  echo "🛠  .env not found in bot/. Asking for Discord Bot Token..."
  read -p "🔑 Enter your Discord Bot Token: " TOKEN_INPUT
  echo "DISCORD_BOT_TOKEN=$TOKEN_INPUT" > .env
  echo "✅ .env created with your token."
fi
cd ..

# --- STEP 3: Frontend IP setup ---
echo "🌐 Detecting local IP address..."
LOCAL_IP=$(ip route get 1 | awk '{print $7;exit}')
ENV_PATH="dashboard/.env"
APP_PATH="dashboard/src/App.jsx"

echo "🔧 Writing VITE_API_BASE=http://$LOCAL_IP:8000 to $ENV_PATH"
echo "VITE_API_BASE=http://$LOCAL_IP:8000" > "$ENV_PATH"

if grep -q 'VITE_API_BASE || "http://' "$APP_PATH"; then
  echo "✏️  Updating App.jsx fallback IP..."
  sed -i "s|VITE_API_BASE || \"http://.*:8000\"|VITE_API_BASE || \"http://$LOCAL_IP:8000\"|g" "$APP_PATH"
fi

# --- STEP 4: Frontend Build or Dev ---
cd dashboard
echo "📦 Installing frontend dependencies..."
npm install

if [ "$MODE" == "dev" ]; then
  echo "🧪 Starting frontend in development mode (Vite)..."
  npx vite --host 0.0.0.0 --port 5173
else
  echo "🏗️  Building frontend for production..."
  npm run build
  cd ..
  echo "🚀 Launching FastAPI (Uvicorn) on 0.0.0.0:8000 ..."
  cd bot
  uvicorn api:app --host 0.0.0.0 --port 8000 --reload
fi
