# 🧠 SC Discord Bot Dashboard

This project provides a fully automated, modern dashboard for managing a Discord bot with FastAPI and Vite (React + Tailwind).  
It supports message/image extraction, reaction analysis, and outputs `.xlsx` files.

---

## ✅ Features

- ⚡️ One-command startup with interactive mode
- 🧠 Mode selector: Dev (`vite dev`) or Prod (build + FastAPI)
- 🔐 Discord Bot Token setup via prompt if not set
- 🌐 Local IP auto-detection for API communication
- 🧪 Vite UI with hot reload
- 📦 React + Tailwind + FastAPI
- 📄 Excel output for `get_messages`, `get_reactions`

---

## 🔧 Prerequisites

Make sure the following tools are installed:

- `Python 3.10+`
- `Node.js 18+`
- `npm`

---

## 🚀 Getting Started

Make the script executable and run it:

```bash
chmod +x start.sh
./start.menu.fixed.sh
```

You will be prompted:

```
1) Dev mode (Vite live reload)
2) Prod mode (Build + API via FastAPI)
```

Choose 1 for live frontend development, or 2 for production mode.

---

### 🧪 Dev Mode

- Vite runs at: `http://<your-ip>:5173`
- Backend runs at: `http://<your-ip>:8000`

---

### 🌐 Prod Mode

- Builds frontend
- Serves UI at `http://<your-ip>:8000/dashboard`
- API available at: `http://<your-ip>:8000/api/...`

---

## 🔐 Discord Token Handling

If `bot/.env` is missing, you will be prompted:

```
🔑 Enter your Discord Bot Token:
```

The token will be saved in:

```env
bot/.env
```

This file is automatically ignored by Git.

---

## 📁 Folder Structure

```
.
├── bot/                   # Backend: FastAPI + Discord bot
│   ├── api.py             # FastAPI app
│   └── .env               # Discord bot token
├── dashboard/             # Frontend (Vite + React + Tailwind)
│   ├── .env               # VITE_API_BASE set dynamically
│   └── src/App.jsx        # React UI logic
├── shared/                # Exported logs/data
├── requirements.txt       # Python dependencies
├── start.sh    # Dev/Prod startup script
└── README.md
```

---

## ✨ Credits

For improvements, contributions, or issues — feel free to open a pull request!

## 📝 License

This project is licensed under the MIT License and can be freely used, modified, and distributed by anyone — for personal or commercial purposes. Attribution is not required.
