import discord
from discord.ext import commands
from collections import defaultdict
from openpyxl import Workbook
import os
import re
from dotenv import load_dotenv

# Load token from .env
load_dotenv()
TOKEN = os.getenv("DISCORD_BOT_TOKEN")

# Setup bot with intents
intents = discord.Intents.default()
intents.message_content = True
intents.guilds = True
intents.messages = True
intents.reactions = True
intents.members = True

bot = commands.Bot(command_prefix="!", intents=intents, help_command=None)

# Regex pattern to extract message link components
link_pattern = re.compile(r"https://discord(?:app)?\.com/channels/(\d+)/(\d+)/(\d+)")

# =======================
# XLSX UTILITY FUNCTION
# =======================

def write_xlsx(filename, headers, rows):
    """Create and write an XLSX file."""
    wb = Workbook()
    ws = wb.active
    ws.append(headers)
    for row in rows:
        ws.append(row)
    wb.save(filename)

# =======================
# BOT EVENTS AND COMMANDS
# =======================

@bot.event
async def on_ready():
    print(f"✅ Bot is online as {bot.user}")

@bot.command()
async def help(ctx):
    """List all commands."""
    help_text = (
        "**Available Commands:**\n"
        "`!get_messages <source_channel_id> <target_channel_id> <limit>`\n"
        "`!get_reactions <message_link> <target_channel_id>`"
    )
    await ctx.send(help_text)

@bot.command()
async def get_messages(ctx, source_channel_id: int, target_channel_id: int = None, limit: int = 2):
    """Get a list of messages per user and export as XLSX."""
    limit = int(limit)

    source_channel = bot.get_channel(source_channel_id)
    if not source_channel:
        try:
            source_channel = await bot.fetch_channel(source_channel_id)
        except Exception as e:
            await ctx.send(f"❌ Could not fetch source channel: {e}")
            return

    target_channel = bot.get_channel(target_channel_id) if target_channel_id else ctx.channel
    if not target_channel:
        try:
            target_channel = await bot.fetch_channel(target_channel_id)
        except Exception as e:
            await ctx.send(f"❌ Could not fetch target channel: {e}")
            return

    messages_per_user = defaultdict(list)
    output_lines = []
    xlsx_rows = []
    counter = 1

    async for message in source_channel.history(limit=500, oldest_first=True):
        if message.author.bot or not message.content.strip():
            continue
        messages_per_user[message.author].append(message.content.strip())

    for user, messages in sorted(messages_per_user.items(), key=lambda item: item[0].display_name.lower()):
        for msg in messages[:limit]:
            output_lines.append(f'<@{user.id}> "{msg}"')
            xlsx_rows.append([counter, user.display_name, msg])
            counter += 1

    # Send message chunks
    chunk = ""
    for line in output_lines:
        if len(chunk) + len(line) + 1 > 1900:
            await target_channel.send(chunk)
            chunk = ""
        chunk += line + "\n"
    if chunk:
        await target_channel.send(chunk)

    # Write XLSX and send as file
    xlsx_filename = "message_summary.xlsx"
    write_xlsx(xlsx_filename, ["#", "User", "Message"], xlsx_rows)
    await target_channel.send(file=discord.File(xlsx_filename))

@bot.command()
async def get_reactions(ctx, message_link: str, target_channel_id: int = None):
    """Fetch all user reactions on a message and export as XLSX."""
    target_channel = bot.get_channel(target_channel_id) if target_channel_id else ctx.channel
    if not target_channel:
        try:
            target_channel = await bot.fetch_channel(target_channel_id)
        except Exception as e:
            await ctx.send(f"❌ Could not fetch target channel: {e}")
            return

    match = re.search(r"https://discord(?:app)?\.com/channels/(\d+)/(\d+)/(\d+)", message_link)
    if not match:
        await target_channel.send("❌ Invalid message link.")
        return

    guild_id, channel_id, message_id = map(int, match.groups())
    guild = bot.get_guild(guild_id)
    channel = guild.get_channel(channel_id) if guild else None

    if not channel:
        await target_channel.send("❌ Channel not found or the bot doesn't have access.")
        return

    try:
        message = await channel.fetch_message(message_id)
    except discord.NotFound:
        await target_channel.send("❌ Message not found.")
        return

    unique_users = {}
    xlsx_rows = []
    counter = 1

    for reaction in message.reactions:
        async for user in reaction.users(limit=None):
            if user.bot:
                continue
            if user.id not in unique_users:
                unique_users[user.id] = (user.display_name, reaction.emoji)
                xlsx_rows.append([counter, user.display_name, reaction.emoji])
                counter += 1

    if unique_users:
        result_lines = [f"{name} voted with {emoji}" for name, emoji in unique_users.values()]
        await target_channel.send("✅ Reactions:\n" + "\n".join(result_lines))

        # Export to XLSX
        xlsx_filename = "reaction_summary.xlsx"
        write_xlsx(xlsx_filename, ["#", "Name", "Emoji"], xlsx_rows)
        await target_channel.send(file=discord.File(xlsx_filename))
    else:
        await target_channel.send("⚠️ No user reactions found.")

# Async start for FastAPI integration
async def run_discord_bot():
    await bot.start(TOKEN)
