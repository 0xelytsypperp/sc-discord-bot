# 💎 SC Discord Bot – Fullstack Dashboard

A full-featured, Tailwind-powered Discord bot dashboard that allows you to control and manage image, message, and reaction exports — directly via a modern web interface.

---

## 🚀 Features

### ✅ Discord Bot Commands

| Command             | Description                                                        |
|--------------------|--------------------------------------------------------------------|
| `!get_images`       | Extracts image messages with optional modes                        |
| `!get_messages`     | Fetches per-user messages and exports to `.xlsx`                   |
| `!get_reactions`    | Fetches user reactions from a specific message and exports to `.xlsx` |
| `!help`             | Lists all available commands                                       |

Each command works via Discord or via the dashboard (through FastAPI backend).

---

## 💻 Dashboard

Built with **React + Vite + TailwindCSS**, styled in a dark Skin.Club theme.

### 🖼 UI Features

- Source & target channel selection
- Inputs for command parameters
- Button controls
- Live command output
- Downloadable `.xlsx` files (auto-generated)

---

## 🔧 Backend

**FastAPI** handles:

- `POST /run` → Executes bot commands
- `GET /channels` → Returns readable Discord text channels
- `GET /log` → Shows command history (last 20)

The bot runs inside the FastAPI app via `run_discord_bot()` to avoid event loop conflicts.

---

## 📁 Project Structure

```
sc-discord-bot/
├── bot/                   # Discord bot and API backend
│   ├── bot.py             # All commands + utility functions
│   ├── api.py             # FastAPI server
│   └── .env.example       # Discord token placeholder
├── dashboard/             # React frontend
│   ├── src/               # App.jsx + index.css + main.jsx
│   ├── tailwind.config.js # Custom theme
│   └── index.html
├── shared/                # Shared command_history.json
├── README.md
└── requirements.txt       # Python dependencies
```

---

## ✅ Setup

### 1. Clone & install

```bash
git clone https://github.com/your-repo/sc-discord-bot.git
cd sc-discord-bot
```

### 2. Backend setup

```bash
cd bot
python -m venv venv
source venv/bin/activate
pip install -r ../requirements.txt

cp .env.example .env
# Paste your bot token into .env

uvicorn api:app --reload
```

### 3. Frontend setup

```bash
cd ../dashboard
npm install
npm run dev
```

Open your browser: http://localhost:5173

---

## 📦 Export Format

All exports are saved as `.xlsx` Excel files and sent directly into the selected target Discord channel.

---

## ⚙️ .env Configuration

`.env`:

```
DISCORD_BOT_TOKEN=your-bot-token-here
```

---

## 📌 Notes

- Tailwind custom theme defined in `tailwind.config.js`
- All commands support both manual and API-triggered usage
- Message & reaction limits are customizable
- No slash commands yet – traditional `!` prefix based

---

## 🧠 License

MIT – free to use, hack, and build on.
