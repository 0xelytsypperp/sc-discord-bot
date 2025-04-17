# 🤖 SC Discord Bot – Fullstack Control Center

A powerful fullstack application that allows you to manage and interact with your Discord server using a web dashboard, FastAPI backend, and a feature-rich Discord bot.

---

## 🚀 Features

### ✅ Discord Bot Commands

| Command             | Description                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| `!get_images`       | Fetches image messages from a channel. Modes: `links`, `images`, `reverse`. |
| `!get_messages`     | Collects recent text messages per user from a channel.                      |
| `!get_reactions`    | Shows who reacted with what emoji to a specific message.                    |
| `!help`             | Lists available commands.                                                   |

Each command posts results directly in the channel **and** generates an **Excel file (.xlsx)** with the structured output.

---

### ✅ Web Dashboard (React)

A modern, responsive dashboard UI where you can:

- Select source and target channels via dropdown
- Trigger bot commands
- View output and download Excel logs
- Browse recent command history

---

### ✅ FastAPI Backend

API endpoints:
- `POST /run` → Executes bot command
- `GET /log` → Returns command history
- `GET /channels` → Returns list of available channels for dropdowns

---

## 📁 Project Structure

```
sc-discord-bot/
├── bot/
│   ├── bot.py
│   ├── api.py
│   ├── .env.example
├── dashboard/
│   └── src/App.jsx
├── shared/
│   └── command_history.json
├── requirements.txt
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Backend (Bot + API)

```bash
cd bot
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# Paste your Discord bot token into .env
uvicorn api:app --reload
```

---

### 2️⃣ Frontend (Dashboard UI)

```bash
cd discord-bot-dashboard
npm install
npm run dev
```
OR
```bash
./start.sh
```

Go to:  
📍 `http://localhost:5173`

---

## 🧪 Example Usage

- `!get_images 1234567890 9876543210 3 reverse`
- `!get_messages 1234567890 9876543210 5`
- `!get_reactions <discord message link>`

---

## ✅ Requirements

- Python 3.8+
- Node.js + npm

### Python packages

```
discord.py
fastapi
uvicorn
python-dotenv
openpyxl
```

---

## 🧠 License

MIT – Free to use, fork and build on.
