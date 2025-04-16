from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from pathlib import Path
import os
from dotenv import load_dotenv
import asyncio
from bot import bot, run_discord_bot

load_dotenv(".env")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Optional: restrict to ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

LOG_FILE = Path("../shared/command_history.json")
LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
LOG_FILE.touch(exist_ok=True)

class CommandRequest(BaseModel):
    command: str
    args: list[str] = []

@app.on_event("startup")
async def startup_event():
    loop = asyncio.get_event_loop()
    loop.create_task(run_discord_bot())

@app.post("/run")
async def run_command(data: CommandRequest):
    command_name = data.command
    args = data.args
    log_entry = {"command": command_name, "args": args}

    # Log the command
    try:
        history = json.loads(LOG_FILE.read_text() or "[]")
    except json.JSONDecodeError:
        history = []
    history.append(log_entry)
    LOG_FILE.write_text(json.dumps(history[-20:], indent=2))

    # Get command
    command = bot.get_command(command_name)
    if not command:
        return {"status": "error", "output": f"Command `{command_name}` not found."}

    # Simulate Discord context
    class DummyCtx:
        def __init__(self):
            self.channel = bot.get_channel(int(args[1])) if len(args) > 1 else None
        async def send(self, content):
            print("BOT SEND:", content)

    ctx = DummyCtx()

    try:
        await command.callback(ctx, *args)
        output = f"✅ Command `!{command_name}` executed."
    except Exception as e:
        output = f"❌ Error running command: {e}"

    return {"status": "ok", "output": output}

@app.get("/log")
async def get_log():
    try:
        history = json.loads(LOG_FILE.read_text())
    except Exception:
        history = []
    return {"history": history}

@app.get("/channels")
async def get_channels():
    return [
        {"id": str(channel.id), "name": f"#{channel.name} ({guild.name})"}
        for guild in bot.guilds
        for channel in guild.text_channels
        if channel.permissions_for(guild.me).read_messages
    ]
