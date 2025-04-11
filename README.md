# Discord Utility Bot

A Discord bot that helps you collect messages, images, and reactions from channels and re-post them in a structured way.

## 🔧 Features

### ➤ `!get_images <sourceChannelID> <targetChannelID> <limit> [mode]`
Copies image messages from one channel to another.

**Modes:**
- `links` – Sends links to original image messages  
- `images` – Uploads actual images to the target channel  
- `reverse` – Sends Google Reverse Image Search links for each image URL

---

### ➤ `!get_messages <sourceChannelID> <targetChannelID> <limit>`
Copies up to `<limit>` messages per user from one channel and posts them to another.

**Format:**  
`@Username "Message content"`

---

### ➤ `!get_reactions <messageLink>`
Shows a list of users who reacted to a message and what emoji they used.

---

## ⚙️ Setup Instructions

1. Install dependencies:
```
pip install -r requirements.txt
```

2. Create a `.env` file in the root directory:
```
DISCORD_BOT_TOKEN=your_discord_bot_token_here
```

3. Run the bot:
```
python bot.py
```

---

## 📁 .env Example

```
DISCORD_BOT_TOKEN=your_discord_token_here
```

> Never share your token publicly!

---

## ✅ Requirements

- Python 3.8+
- `discord.py`
- `python-dotenv`

---

## 🤝 License

MIT – free to use and modify.
