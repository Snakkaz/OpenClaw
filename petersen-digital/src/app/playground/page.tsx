"use client";

import { useState } from "react";

export default function PlaygroundPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-white mb-2">Playground</h1>
      <p className="text-zinc-400 mb-10">
        Live demos — prøv det selv.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <CSSColorTool />
        <MarkdownRenderer />
        <NginxGenerator />
        <AIChat />
      </div>
    </div>
  );
}

function CSSColorTool() {
  const [primary, setPrimary] = useState("#09a3bf");
  const [bg, setBg] = useState("#09090b");

  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800">
        <h2 className="font-semibold text-white">🎨 CSS Custom Properties</h2>
        <p className="text-xs text-zinc-500 mt-1">Endre CSS-variabler live</p>
      </div>
      <div className="p-5 flex flex-col gap-4">
        <div className="flex gap-3 items-center">
          <input
            type="color"
            value={primary}
            onChange={(e) => setPrimary(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
          />
          <div>
            <p className="text-xs text-zinc-400">--color-primary</p>
            <p className="font-mono text-sm text-zinc-300">{primary}</p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <input
            type="color"
            value={bg}
            onChange={(e) => setBg(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
          />
          <div>
            <p className="text-xs text-zinc-400">--color-bg</p>
            <p className="font-mono text-sm text-zinc-300">{bg}</p>
          </div>
        </div>
        {/* Preview box */}
        <div
          className="rounded-lg p-4 text-center text-sm font-medium transition-colors"
          style={{ backgroundColor: bg, color: primary, border: `2px solid ${primary}` }}
        >
          Live preview
        </div>
        <pre className="text-xs font-mono bg-zinc-950 rounded-lg p-3 text-zinc-400 overflow-x-auto">{`:root {
  --color-primary: ${primary};
  --color-bg: ${bg};
}`}</pre>
      </div>
    </div>
  );
}

function MarkdownRenderer() {
  const [md, setMd] = useState("# Hei!\n\nSkriv **markdown** her.\n\n- Punkt 1\n- Punkt 2\n\n`kode`");

  const toHtml = (text: string) =>
    text
      .replace(/^# (.+)$/gm, "<h1 class='text-lg font-bold text-white mb-2'>$1</h1>")
      .replace(/^## (.+)$/gm, "<h2 class='font-semibold text-white mb-1'>$1</h2>")
      .replace(/\*\*(.+?)\*\*/g, "<strong class='text-white'>$1</strong>")
      .replace(/`(.+?)`/g, "<code class='bg-zinc-800 text-brand-300 px-1 rounded text-xs font-mono'>$1</code>")
      .replace(/^- (.+)$/gm, "<li class='ml-4 list-disc text-zinc-400'>$1</li>")
      .replace(/\n/g, "<br/>");

  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800">
        <h2 className="font-semibold text-white">📝 Markdown Renderer</h2>
        <p className="text-xs text-zinc-500 mt-1">Skriv markdown, se preview</p>
      </div>
      <div className="grid grid-rows-2 h-64">
        <textarea
          value={md}
          onChange={(e) => setMd(e.target.value)}
          className="p-3 font-mono text-xs text-zinc-300 bg-zinc-950 border-b border-zinc-800 resize-none focus:outline-none"
        />
        <div
          className="p-3 text-sm text-zinc-300 overflow-auto"
          dangerouslySetInnerHTML={{ __html: toHtml(md) }}
        />
      </div>
    </div>
  );
}

function NginxGenerator() {
  const [domain, setDomain] = useState("minside.no");
  const [port, setPort] = useState("3000");

  const config = `server {
    listen 80;
    server_name ${domain};
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${domain};

    ssl_certificate /etc/letsencrypt/live/${domain}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${domain}/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:${port};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`;

  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800">
        <h2 className="font-semibold text-white">⚙️ Nginx Config Generator</h2>
        <p className="text-xs text-zinc-500 mt-1">Fyll inn, få Nginx-konfig</p>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="domain.no"
            className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-200 focus:outline-none focus:border-brand-600"
          />
          <input
            value={port}
            onChange={(e) => setPort(e.target.value)}
            placeholder="3000"
            className="w-20 px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-200 focus:outline-none focus:border-brand-600"
          />
        </div>
        <pre className="text-xs font-mono bg-zinc-950 rounded-lg p-3 text-zinc-400 overflow-x-auto whitespace-pre-wrap max-h-48">
          {config}
        </pre>
        <button
          onClick={() => navigator.clipboard.writeText(config)}
          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition-colors text-left"
        >
          📋 Kopier
        </button>
      </div>
    </div>
  );
}

function AIChat() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: "bot", text: "Hei! Jeg er OpenClaw-agenten. Spør meg om noe 👋" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "bot", text: data.reply || data.error }]);
    } catch {
      setMessages((m) => [...m, { role: "bot", text: "Feil ved tilkobling." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden flex flex-col h-72">
      <div className="px-5 py-4 border-b border-zinc-800">
        <h2 className="font-semibold text-white">🤖 AI Demo — OpenClaw</h2>
        <p className="text-xs text-zinc-500 mt-1">Snakk med AI-agenten live</p>
      </div>
      <div className="flex-1 overflow-auto p-4 flex flex-col gap-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`text-sm px-3 py-2 rounded-lg max-w-[85%] ${
              m.role === "user"
                ? "bg-brand-900 text-brand-100 self-end"
                : "bg-zinc-800 text-zinc-300 self-start"
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="text-xs text-zinc-500 self-start animate-pulse">
            Tenker...
          </div>
        )}
      </div>
      <div className="flex gap-2 p-3 border-t border-zinc-800">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Skriv en melding..."
          className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-200 focus:outline-none focus:border-brand-600"
        />
        <button
          onClick={send}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-sm transition-colors"
        >
          →
        </button>
      </div>
    </div>
  );
}
