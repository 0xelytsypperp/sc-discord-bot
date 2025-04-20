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
  
  const API_BASE = import.meta.env.VITE_API_BASE || "http://192.168.1.110:8000";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendCommand = async (command, args = []) => {
    const res = await fetch(`${API_BASE}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command, args })
    });
    const data = await res.json();
    setOutput(data.output || "Command sent.");
    fetchLogs();
  };

  const fetchLogs = async () => {
    const res = await fetch(`${API_BASE}/log`);
    const data = await res.json();
    setLogs(data.history || []);
  };

  const fetchChannels = async () => {
    const res = await fetch(`${API_BASE}/channels`);
    const data = await res.json();
    setChannels(data);
  };

  useEffect(() => {
    fetchLogs();
    fetchChannels();
  }, []);

  return (
    <main className="min-h-screen bg-skinDark text-white px-4 py-6 sm:px-6 md:px-10 grid gap-6 max-w-4xl mx-auto">
     <div className="flex items-center justify-center gap-4">
  <img src="data:image/svg+xml,<?xml version='1.0' encoding='utf-8'?><svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 65.5 60.5' xml:space='preserve'><style type='text/css'> .st1{fill-rule:evenodd;clip-rule:evenodd;fill:%235426FF;} .st2{opacity:0.5;fill-rule:evenodd;clip-rule:evenodd;fill:%234911D4;} .st3{fill-rule:evenodd;clip-rule:evenodd;fill:%23CD40A7;} .st4{fill-rule:evenodd;clip-rule:evenodd;fill:url(%23SVGID_1_);} .st5{fill-rule:evenodd;clip-rule:evenodd;fill:url(%23SVGID_2_);} </style><g><path class='st1' d='M25.4,45.5l21.5-21.5c1.8-1.8,4.6-1.8,6.3,0l7.3,7.3c1.8,1.8,1.8,4.6,0,6.3L39,59.2c-1.8,1.8-4.6,1.8-6.3,0 l-7.3-7.3C23.6,50.1,23.6,47.3,25.4,45.5z'/><path class='st1' d='M25.4,45.5l21.5-21.5c1.8-1.8,4.6-1.8,6.3,0l7.3,7.3c1.8,1.8,1.8,4.6,0,6.3L39,59.2c-1.8,1.8-4.6,1.8-6.3,0 l-7.3-7.3C23.6,50.1,23.6,47.3,25.4,45.5z'/><path class='st2' d='M50.5,38.7c1.8-1.8,1.8-4.6,0-6.3l-6-6L25.4,45.5c-1.8,1.8-1.8,4.6,0,6.3l6,6L50.5,38.7z'/><path class='st1' d='M3.5,22L24.1,1.3c1.8-1.8,4.6-1.8,6.3,0l7.3,7.3c1.8,1.8,1.8,4.6,0,6.3L17.1,35.6c-1.8,1.8-4.6,1.8-6.3,0 l-7.3-7.3C1.7,26.6,1.7,23.7,3.5,22z'/><path class='st2' d='M37.8,15c1.8-1.8,1.8-4.6,0-6.3l-5.5-5.5L13.5,22c-1.8,1.8-1.8,4.6,0,6.3l5.5,5.5L37.8,15z'/><path class='st3' d='M63.6,18.6l-5.7,1c-1,0.2-1.9-0.1-2.6-0.8L43.4,6.9c-2.6-2.6-7-2.6-9.6,0L0.2,40.4c-0.5,0.5-0.1,1.2,0.6,1.1 L7,40.5c0.9-0.1,1.8,0.1,2.4,0.8l11.8,11.8c3,3,6.9,2.8,9.9-0.3l33.1-33.1C64.7,19.2,64.2,18.4,63.6,18.6z M44.3,25.2 C44.3,25.2,44.3,25.2,44.3,25.2L29,40.5c-1.5,1.5-4,1.5-5.5,0l-3.3-3.3c-0.5-0.5-0.6-1.4,0-2l0,0l15.6-15.6c1.3-1.3,3.5-1.3,4.8,0 l3.7,3.7C44.8,23.8,44.8,24.7,44.3,25.2z'/><linearGradient id='SVGID_1_' gradientUnits='userSpaceOnUse' x1='10.9518' y1='53.5451' x2='37.9567' y2='39.5696'><stop offset='0' style='stop-color:%236311DD'/><stop offset='1' style='stop-color:%236311DD;stop-opacity:0'/></linearGradient><path class='st4' d='M46.6,37.3l-2.5-2.8l-10,0.9L29,40.5c-1.5,1.5-4,1.5-5.5,0l5.1,5.1c3,3,6.9,2.8,9.9-0.3L46.6,37.3z'/><linearGradient id='SVGID_2_' gradientUnits='userSpaceOnUse' x1='50.6241' y1='-0.6862' x2='28.8993' y2='21.4243'><stop offset='0' style='stop-color:%236311DD'/><stop offset='1' style='stop-color:%236311DD;stop-opacity:0'/></linearGradient><path class='st5' d='M26,14.6L15.9,24.7c3.6,2.5,7.6,5.3,7.6,5.3s0.2,0.5,0.5,1.2l11.8-11.8c1.3-1.3,3.5-1.3,4.8,0l-4.9-4.9 C33,11.9,28.7,11.9,26,14.6z'/></g></svg>" alt="Logo" className="w-10 h-10" />
  <h1 className="text-4xl font-bold text-skinAccent text-center">SkinClub Discord Bot Dashboard</h1>
  <img src="data:image/svg+xml,<?xml version='1.0' encoding='utf-8'?><svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 65.5 60.5' xml:space='preserve'><style type='text/css'> .st1{fill-rule:evenodd;clip-rule:evenodd;fill:%235426FF;} .st2{opacity:0.5;fill-rule:evenodd;clip-rule:evenodd;fill:%234911D4;} .st3{fill-rule:evenodd;clip-rule:evenodd;fill:%23CD40A7;} .st4{fill-rule:evenodd;clip-rule:evenodd;fill:url(%23SVGID_1_);} .st5{fill-rule:evenodd;clip-rule:evenodd;fill:url(%23SVGID_2_);} </style><g><path class='st1' d='M25.4,45.5l21.5-21.5c1.8-1.8,4.6-1.8,6.3,0l7.3,7.3c1.8,1.8,1.8,4.6,0,6.3L39,59.2c-1.8,1.8-4.6,1.8-6.3,0 l-7.3-7.3C23.6,50.1,23.6,47.3,25.4,45.5z'/><path class='st1' d='M25.4,45.5l21.5-21.5c1.8-1.8,4.6-1.8,6.3,0l7.3,7.3c1.8,1.8,1.8,4.6,0,6.3L39,59.2c-1.8,1.8-4.6,1.8-6.3,0 l-7.3-7.3C23.6,50.1,23.6,47.3,25.4,45.5z'/><path class='st2' d='M50.5,38.7c1.8-1.8,1.8-4.6,0-6.3l-6-6L25.4,45.5c-1.8,1.8-1.8,4.6,0,6.3l6,6L50.5,38.7z'/><path class='st1' d='M3.5,22L24.1,1.3c1.8-1.8,4.6-1.8,6.3,0l7.3,7.3c1.8,1.8,1.8,4.6,0,6.3L17.1,35.6c-1.8,1.8-4.6,1.8-6.3,0 l-7.3-7.3C1.7,26.6,1.7,23.7,3.5,22z'/><path class='st2' d='M37.8,15c1.8-1.8,1.8-4.6,0-6.3l-5.5-5.5L13.5,22c-1.8,1.8-1.8,4.6,0,6.3l5.5,5.5L37.8,15z'/><path class='st3' d='M63.6,18.6l-5.7,1c-1,0.2-1.9-0.1-2.6-0.8L43.4,6.9c-2.6-2.6-7-2.6-9.6,0L0.2,40.4c-0.5,0.5-0.1,1.2,0.6,1.1 L7,40.5c0.9-0.1,1.8,0.1,2.4,0.8l11.8,11.8c3,3,6.9,2.8,9.9-0.3l33.1-33.1C64.7,19.2,64.2,18.4,63.6,18.6z M44.3,25.2 C44.3,25.2,44.3,25.2,44.3,25.2L29,40.5c-1.5,1.5-4,1.5-5.5,0l-3.3-3.3c-0.5-0.5-0.6-1.4,0-2l0,0l15.6-15.6c1.3-1.3,3.5-1.3,4.8,0 l3.7,3.7C44.8,23.8,44.8,24.7,44.3,25.2z'/><linearGradient id='SVGID_1_' gradientUnits='userSpaceOnUse' x1='10.9518' y1='53.5451' x2='37.9567' y2='39.5696'><stop offset='0' style='stop-color:%236311DD'/><stop offset='1' style='stop-color:%236311DD;stop-opacity:0'/></linearGradient><path class='st4' d='M46.6,37.3l-2.5-2.8l-10,0.9L29,40.5c-1.5,1.5-4,1.5-5.5,0l5.1,5.1c3,3,6.9,2.8,9.9-0.3L46.6,37.3z'/><linearGradient id='SVGID_2_' gradientUnits='userSpaceOnUse' x1='50.6241' y1='-0.6862' x2='28.8993' y2='21.4243'><stop offset='0' style='stop-color:%236311DD'/><stop offset='1' style='stop-color:%236311DD;stop-opacity:0'/></linearGradient><path class='st5' d='M26,14.6L15.9,24.7c3.6,2.5,7.6,5.3,7.6,5.3s0.2,0.5,0.5,1.2l11.8-11.8c1.3-1.3,3.5-1.3,4.8,0l-4.9-4.9 C33,11.9,28.7,11.9,26,14.6z'/></g></svg>" alt="Logo" className="w-10 h-10" />
</div>

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

  <input
    name="messageLink"
    placeholder="Full Message Link"
    onChange={handleChange}
    className="block w-full bg-skinDark border border-skinTextSubtle rounded px-3 py-2 text-white"
  />

  <label className="block text-skinTextSubtle text-sm mt-2">Target Channel</label>
  <select
    name="targetChannelId"
    onChange={handleChange}
    className="block w-full bg-skinDark border border-skinTextSubtle rounded px-3 py-2 text-white"
  >
    <option value="">Select target channel</option>
    {channels.map((ch) => (
      <option key={ch.id} value={ch.id}>
        {ch.name}
      </option>
    ))}
  </select>

  <button
    className="w-full py-2 bg-skinButton text-black font-bold rounded hover:bg-skinButtonHover"
    onClick={() => sendCommand("get_reactions", [form.messageLink, form.targetChannelId])}
  >
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
