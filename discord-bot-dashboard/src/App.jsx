import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

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
    <main className="min-h-screen bg-gray-100 p-6 grid gap-6">
      <motion.h1
        className="text-3xl font-bold"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🤖 Discord Bot Dashboard
      </motion.h1>

      <Card className="max-w-2xl">
        <CardContent className="p-6 grid gap-4">
          <h2 className="text-xl font-semibold">Send !get_images</h2>
          <select name="sourceChannelId" onChange={handleChange} className="p-2 border rounded">
            <option value="">Select source channel</option>
            {channels.map((ch) => (
              <option key={ch.id} value={ch.id}>{ch.name}</option>
            ))}
          </select>
          <select name="targetChannelId" onChange={handleChange} className="p-2 border rounded">
            <option value="">Select target channel</option>
            {channels.map((ch) => (
              <option key={ch.id} value={ch.id}>{ch.name}</option>
            ))}
          </select>
          <Input name="limit" placeholder="Limit" type="number" onChange={handleChange} />
          <Input name="mode" placeholder="Mode (links, images, reverse)" onChange={handleChange} />
          <Button onClick={() => sendCommand("get_images", [form.sourceChannelId, form.targetChannelId, form.limit, form.mode])}>Send</Button>
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardContent className="p-6 grid gap-4">
          <h2 className="text-xl font-semibold">Send !get_messages</h2>
          <select name="sourceChannelId" onChange={handleChange} className="p-2 border rounded">
            <option value="">Select source channel</option>
            {channels.map((ch) => (
              <option key={ch.id} value={ch.id}>{ch.name}</option>
            ))}
          </select>
          <select name="targetChannelId" onChange={handleChange} className="p-2 border rounded">
            <option value="">Select target channel</option>
            {channels.map((ch) => (
              <option key={ch.id} value={ch.id}>{ch.name}</option>
            ))}
          </select>
          <Input name="limit" placeholder="Limit" type="number" onChange={handleChange} />
          <Button onClick={() => sendCommand("get_messages", [form.sourceChannelId, form.targetChannelId, form.limit])}>Send</Button>
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardContent className="p-6 grid gap-4">
          <h2 className="text-xl font-semibold">Check Reactions</h2>
          <Input name="messageLink" placeholder="Full Message Link" onChange={handleChange} />
          <Button onClick={() => sendCommand("get_reactions", [form.messageLink])}>Send</Button>
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-2">Command Output</h2>
          <Textarea className="min-h-[150px]" value={output} readOnly />
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-2">Command History</h2>
          <ul className="text-sm text-gray-700 space-y-1">
            {logs.map((log, i) => (
              <li key={i}>#{i + 1}: !{log.command} {log.args.join(" ")}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
