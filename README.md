# 🧠 SC Discord Bot Dashboard

This project provides a fully automated, modern dashboard for managing a Discord bot with FastAPI and Vite (React + Tailwind).  
It supports message/image extraction, reaction analysis, and outputs `.xlsx` files.

---

## ✅ Features

- ⚡️ One-command startup: `start.devprod.sh`
- 🔐 Interactive Discord Bot Token prompt
- 🌐 Auto-detects local IP for API/Frontend communication
- 🧪 Dev/Prod switch for Vite UI (prod mode is still in development)
- 🧹 No manual `.env` or config edits needed
- 📦 React + Tailwind + FastAPI
- 📄 Excel output for commands (`get_messages`, `get_reactions`, etc.)

---

## 🔧 Prerequisites

Make sure the following tools are installed:

- `Python 3.10+`
- `Node.js 18+`
- `npm` (Node Package Manager)

---

## 🚀 Getting Started

Clone the repo, make the script executable, and run:

```bash
chmod +x start.auto.devprod.sh
./start.auto.devprod.sh
```

> This runs the project in **production mode** (serves built UI via FastAPI)

---

### 🔁 Development Mode

To start the frontend in **live development mode** (hot-reload, dev server):

```bash
./start.auto.devprod.sh dev
```

- UI available at: `http://<your-ip>:5173`
- Backend API: `http://<your-ip>:8000`

---

## 🔐 Discord Token Handling

If the file `bot/.env` does not exist, the script will prompt you for your Discord bot token:

```
🔑 Enter your Discord Bot Token:
```

It will be written into `bot/.env` as:

```env
DISCORD_BOT_TOKEN=your-token-here
```

This file is automatically ignored by Git via `.gitignore`.

---

## 📁 Folder Structure

```
.
├── bot/                 # FastAPI backend & Discord bot
│   ├── api.py           # API server
│   ├── .env             # Bot token stored here
│   └── venv/            # Python virtual environment (auto-created)
├── dashboard/           # Vite frontend (React + Tailwind)
│   ├── .env             # VITE_API_BASE set dynamically
│   └── src/App.jsx      # Frontend logic
├── shared/              # Log/output files
├── requirements.txt     # Python dependencies
├── start.devprod.sh     # Start script (Dev/Prod/Setup)
└── README.md
```

---

For questions or contributions, open an issue or pull request.

## 🧠 License

MIT – free to use, hack, and build on.
