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
                    content = f"👤 **{author}**\n🔗 [Open Message]({link})"
                    await target_channel.send(content=content, files=files)
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
                    collected_links.append(f"🔍 **{author}**: [Reverse Search]({reverse_link})\n➡️ [Open Message]({link})")
                    sent_count += 1

            else:
                collected_links.append(f"🖼 **{author}**: {link}")
                sent_count += 1

    if sent_count == 0:
        await ctx.send("⚠️ No image messages found.")
    else:
        if collected_links:
            chunk = ""
            for line in collected_links:
                if len(chunk) + len(line) + 1 > 1900:
                    await target_channel.send(chunk)
                    chunk = ""
                chunk += line + "\n"
            if chunk:
                await target_channel.send(chunk)

        await ctx.send(f"✅ {sent_count} messages processed ({mode.capitalize()}).")

@bot.command()
async def get_messages(ctx, source_channel_id: int, limit: int = 2):
    source_channel = bot.get_channel(source_channel_id)
    target_channel = ctx.channel

    if not source_channel:
        await ctx.send("❌ Invalid source channel ID.")
        return

    messages_per_user = defaultdict(list)

    async for message in source_channel.history(limit=500, oldest_first=True):
        if message.author.bot or not message.content.strip():
            continue
        messages_per_user[message.author].append(message.content.strip())

    output_lines = []
    for user, messages in sorted(messages_per_user.items(), key=lambda item: item[0].display_name.lower()):
        for msg in messages[:limit]:
            formatted = f'<@{user.id}> "{msg}"'
            output_lines.append(formatted)

    if not output_lines:
        await ctx.send("⚠️ No messages found.")
    else:
        chunk = ""
        for line in output_lines:
            if len(chunk) + len(line) + 1 > 1900:
                await target_channel.send(chunk)
                chunk = ""
            chunk += line + "\n"
        if chunk:
            await target_channel.send(chunk)

        await ctx.send(f"✅ {len(output_lines)} messages sent to <#{target_channel.id}>.")

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

    for reaction in message.reactions:
        async for user in reaction.users(limit=None):
            if user.bot:
                continue
            if user.id not in unique_users:
                unique_users[user.id] = (user.display_name, reaction.emoji)

    if not unique_users:
        await ctx.send("⚠️ No user reactions found.")
        return

    result_lines = []
    for user_id, (username, emoji) in sorted(unique_users.items(), key=lambda item: item[1][0].lower()):
        result_lines.append(f"{username} voted with {emoji}")

    await ctx.send(f"✅ {len(result_lines)} votes counted for [this message]({message_link}):\n" + "\n".join(result_lines))

bot.run(TOKEN)
