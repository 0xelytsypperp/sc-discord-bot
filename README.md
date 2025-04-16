# Discord Utility Bot

A Discord bot that collects messages, images, and reactions from channels and reposts them in a clean format.

## 🔧 Features

### ➤ `!get_images <sourceChannelID> <limit> [mode]`
Copies image messages from the given channel and sends the result to the channel where the command is run.

**Modes:**
- `links` – Sends links to the original image messages  
- `images` – Uploads the actual images  
- `reverse` – Sends Google Reverse Image Search links for found images

Also includes a summary table of results.

---

### ➤ `!get_messages <sourceChannelID> <limit>`
Copies up to `<limit>` messages per user from the source channel and posts them to the current channel.

Includes a markdown summary table:
| # | Name | Message |

---

### ➤ `!get_reactions <messageLink>`
Displays who reacted to a message and what emoji they used.

Includes a markdown summary table:
| # | Name | Emoji |

---

## ⚙️ Setup Instructions

1. Create and activate a virtual environment:
```
python -m venv venv
source venv/bin/activate
```

2. Install dependencies:
```
pip install -r requirements.txt
```

3. Create a `.env` file in the root directory:
```
DISCORD_BOT_TOKEN=your_discord_bot_token_here
```

4. Run the bot:
```
python bot.py
```
