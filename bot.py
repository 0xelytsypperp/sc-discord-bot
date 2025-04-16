
import discord
from discord.ext import commands
from collections import defaultdict
import re
import os
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv("DISCORD_BOT_TOKEN")

intents = discord.Intents.default()
intents.message_content = True
intents.guilds = True
intents.messages = True
intents.reactions = True
intents.members = True

bot = commands.Bot(command_prefix="!", intents=intents, help_command=None)

image_url_pattern = re.compile(r"(https?://\S+\.(png|jpe?g|gif|webp|bmp))", re.IGNORECASE)
link_pattern = re.compile(r"https?://discord(?:app)?\.com/channels/(\d+)/(\d+)/(\d+)")

@bot.event
async def on_ready():
    print(f"✅ Bot is online as {bot.user}")

@bot.command(name="help")
async def custom_help(ctx):
    help_text = """
**Bot Commands Overview**

➤ `!get_images <sourceChannelID> <limit> [mode]`  
Copies image messages. Modes: `links`, `images`, `reverse`

➤ `!get_messages <sourceChannelID> <limit>`  
Copies text messages per user

➤ `!get_reactions <messageLink>`  
Shows who reacted with what emoji
"""
    await ctx.send(help_text)

@bot.command()
async def get_images(ctx, source_channel_id: int, limit: int = 2, mode: str = "links"):
    source_channel = bot.get_channel(source_channel_id)
    target_channel = ctx.channel

    if not source_channel:
        await ctx.send("❌ Invalid source channel ID.")
        return

    messages_per_user = defaultdict(list)
    table_lines = ["| # | Name | Link |", "|---|------|------|"]
    counter = 1

    async for message in source_channel.history(limit=500, oldest_first=True):
        has_image = False
        if any(a.content_type and a.content_type.startswith("image/") for a in message.attachments):
            has_image = True
        elif any(e.image and e.image.url for e in message.embeds):
            has_image = True
        elif image_url_pattern.search(message.content):
            has_image = True

        if has_image:
            messages_per_user[message.author.id].append(message)

    sent_count = 0
    collected_links = []

    for user_id, messages in sorted(messages_per_user.items(), key=lambda item: item[1][0].author.display_name.lower()):
        for message in messages[:limit]:
            author = message.author.display_name
            link = f"https://discord.com/channels/{message.guild.id}/{message.channel.id}/{message.id}"

            if mode.lower() == "images":
                files = []
                for attachment in message.attachments:
                    if attachment.content_type and attachment.content_type.startswith("image/"):
                        files.append(await attachment.to_file())
                if files:
                    await target_channel.send(content=f"👤 **{author}**
🔗 [Open Message]({link})", files=files)
                    table_lines.append(f"| {counter} | {author} | Uploaded image |")
                    counter += 1
                    sent_count += 1
            elif mode.lower() == "reverse":
                image_urls = []
                for attachment in message.attachments:
                    if attachment.content_type and attachment.content_type.startswith("image/"):
                        image_urls.append(attachment.url)
                for embed in message.embeds:
                    if embed.image and embed.image.url:
                        image_urls.append(embed.image.url)
                urls_in_text = image_url_pattern.findall(message.content)
                for match in urls_in_text:
                    image_urls.append(match[0])
                for img_url in image_urls:
                    reverse_link = f"https://www.google.com/searchbyimage?image_url={img_url}"
                    collected_links.append(f"🔍 **{author}**: [Reverse Search]({reverse_link})
➡️ [Open Message]({link})")
                    table_lines.append(f"| {counter} | {author} | {reverse_link} |")
                    counter += 1
                    sent_count += 1
            else:
                collected_links.append(f"🖼 **{author}**: {link}")
                table_lines.append(f"| {counter} | {author} | {link} |")
                counter += 1
                sent_count += 1

    if collected_links:
        await target_channel.send("\n".join(collected_links))
    if sent_count > 0:
        await target_channel.send("**Summary Table:**\n" + "\n".join(table_lines))
        await ctx.send(f"✅ {sent_count} messages processed ({mode.capitalize()}).")
    else:
        await ctx.send("⚠️ No image messages found.")

@bot.command()
async def get_messages(ctx, source_channel_id: int, limit: int = 2):
    source_channel = bot.get_channel(source_channel_id)
    target_channel = ctx.channel

    if not source_channel:
        await ctx.send("❌ Invalid source channel ID.")
        return

    messages_per_user = defaultdict(list)
    output_lines = []
    table_lines = ["| # | Name | Message |", "|---|------|---------|"]
    counter = 1

    async for message in source_channel.history(limit=500, oldest_first=True):
        if message.author.bot or not message.content.strip():
            continue
        messages_per_user[message.author].append(message.content.strip())

    for user, messages in sorted(messages_per_user.items(), key=lambda item: item[0].display_name.lower()):
        for msg in messages[:limit]:
            output_lines.append(f'<@{user.id}> "{msg}"')
            table_lines.append(f"| {counter} | {user.display_name} | {msg[:50]}{'...' if len(msg) > 50 else ''} |")
            counter += 1

    if output_lines:
        chunk = ""
        for line in output_lines:
            if len(chunk) + len(line) + 1 > 1900:
                await target_channel.send(chunk)
                chunk = ""
            chunk += line + "\n"
        if chunk:
            await target_channel.send(chunk)
        await target_channel.send("**Summary Table:**\n" + "\n".join(table_lines))
        await ctx.send(f"✅ {len(output_lines)} messages sent to <#{target_channel.id}>.")
    else:
        await ctx.send("⚠️ No messages found.")

@bot.command()
async def get_reactions(ctx, message_link: str):
    match = link_pattern.match(message_link)
    if not match:
        await ctx.send("❌ Invalid message link.")
        return

    guild_id, channel_id, message_id = map(int, match.groups())
    guild = bot.get_guild(guild_id)
    channel = guild.get_channel(channel_id) if guild else None

    if not channel:
        await ctx.send("❌ Channel not found or the bot doesn't have access.")
        return

    try:
        message = await channel.fetch_message(message_id)
    except discord.NotFound:
        await ctx.send("❌ Message not found.")
        return

    unique_users = {}
    table_lines = ["| # | Name | Emoji |", "|---|------|-------|"]
    counter = 1

    for reaction in message.reactions:
        async for user in reaction.users(limit=None):
            if user.bot:
                continue
            if user.id not in unique_users:
                unique_users[user.id] = (user.display_name, reaction.emoji)
                table_lines.append(f"| {counter} | {user.display_name} | {reaction.emoji} |")
                counter += 1

    if unique_users:
        result_lines = [f"{name} voted with {emoji}" for name, emoji in unique_users.values()]
        await ctx.send("✅ Reactions:
" + "
".join(result_lines))
        await ctx.send("**Summary Table:**
" + "
".join(table_lines))
    else:
        await ctx.send("⚠️ No user reactions found.")

bot.run(TOKEN)
