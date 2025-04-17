import React, { useState, useEffect } from "react";

export default function App() {
  const [output, setOutput] = useState("");
  const [logs, setLogs] = useState([]);
  const [channels, setChannels] = useState([]);
  const [form, setForm] = useState({
    sourceChannelId: "",
    targetChannelId: "",
    limit: 2,
    mode: "",
    messageLink: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendCommand = async (command, args = []) => {
    const res = await fetch("http://localhost:8000/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command, args })
    });
    const data = await res.json();
    setOutput(data.output || "Command sent.");
    fetchLogs();
  };

  const fetchLogs = async () => {
    const res = await fetch("http://localhost:8000/log");
    const data = await res.json();
    setLogs(data.history || []);
  };

  const fetchChannels = async () => {
    const res = await fetch("http://localhost:8000/channels");
    const data = await res.json();
    setChannels(data);
  };

  useEffect(() => {
    fetchLogs();
    fetchChannels();
  }, []);

  return (
    <main className="min-h-screen bg-skinDark text-white px-4 py-6 sm:px-6 md:px-10 grid gap-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-skinAccent">💎 SC Discord Bot Dashboard</h1>

      <section className="bg-skinPanel p-6 rounded-xl shadow-md border border-skinButton space-y-4">
        <h2 className="text-2xl font-semibold text-skinAccent">Get Images</h2>
        <select name="sourceChannelId" onChange={handleChange}
          className="block w-full bg-skinDark border border-skinTextSubtle rounded px-3 py-2 text-white">
          <option value="">Select source channel</option>
          {channels.map((ch) => (
            <option key={ch.id} value={ch.id}>{ch.name}</option>
          ))}
        </select>
        <select name="targetChannelId" onChange={handleChange}
          className="block w-full bg-skinDark border border-skinTextSubtle rounded px-3 py-2 text-white">
          <option value="">Select target channel</option>
          {channels.map((ch) => (
            <option key={ch.id} value={ch.id}>{ch.name}</option>
          ))}
        </select>
        <input name="limit" placeholder="Limit" type="number" onChange={handleChange}
          className="block w-full bg-skinDark border border-skinTextSubtle rounded px-3 py-2 text-white" />
        <input name="mode" placeholder="Mode (links, images, reverse)" onChange={handleChange}
          className="block w-full bg-skinDark border border-skinTextSubtle rounded px-3 py-2 text-white" />
        <button className="w-full py-2 bg-skinButton text-black font-bold rounded hover:bg-skinButtonHover"
          onClick={() => sendCommand("get_images", [form.sourceChannelId, form.targetChannelId, form.limit, form.mode])}>
          Send
        </button>
      </section>

      <section className="bg-skinPanel p-6 rounded-xl shadow-md border border-skinButton space-y-4">
        <h2 className="text-2xl font-semibold text-skinAccent">Get Messages</h2>
        <select name="sourceChannelId" onChange={handleChange}
          className="block w-full bg-skinDark border border-skinTextSubtle rounded px-3 py-2 text-white">
          <option value="">Select source channel</option>
          {channels.map((ch) => (
            <option key={ch.id} value={ch.id}>{ch.name}</option>
          ))}
        </select>
        <select name="targetChannelId" onChange={handleChange}
          className="block w-full bg-skinDark border border-skinTextSubtle rounded px-3 py-2 text-white">
          <option value="">Select target channel</option>
          {channels.map((ch) => (
            <option key={ch.id} value={ch.id}>{ch.name}</option>
          ))}
        </select>
        <input name="limit" placeholder="Limit" type="number" onChange={handleChange}
          className="block w-full bg-skinDark border border-skinTextSubtle rounded px-3 py-2 text-white" />
        <button className="w-full py-2 bg-skinButton text-black font-bold rounded hover:bg-skinButtonHover"
          onClick={() => sendCommand("get_messages", [form.sourceChannelId, form.targetChannelId, form.limit])}>
          Send
        </button>
      </section>

      <section className="bg-skinPanel p-6 rounded-xl shadow-md border border-skinButton space-y-4">
        <h2 className="text-2xl font-semibold text-skinAccent">Get Reactions</h2>
        <input name="messageLink" placeholder="Full Message Link" onChange={handleChange}
          className="block w-full bg-skinDark border border-skinTextSubtle rounded px-3 py-2 text-white" />
        <button className="w-full py-2 bg-skinButton text-black font-bold rounded hover:bg-skinButtonHover"
          onClick={() => sendCommand("get_reactions", [form.messageLink])}>
          Send
        </button>
      </section>

      <section className="bg-skinPanel p-6 rounded-xl shadow-md border border-skinButton">
        <h2 className="text-2xl font-semibold text-skinAccent mb-2">Command Output</h2>
        <textarea className="min-h-[150px] w-full p-2 bg-skinDark border border-skinTextSubtle rounded text-white" value={output} readOnly />
      </section>

      <section className="bg-skinPanel p-6 rounded-xl shadow-md border border-skinButton">
        <h2 className="text-2xl font-semibold text-skinAccent mb-2">Command History</h2>
        <ul className="text-sm text-skinTextSubtle space-y-1">
          {logs.map((log, i) => (
            <li key={i}>#{i + 1}: !{log.command} {log.args.join(" ")}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
