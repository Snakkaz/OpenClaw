"use client";

import { useEffect, useRef } from "react";

const LINES = [
  "$ openclaw status",
  "  ✓ WhatsApp linked (+4740393847)",
  "  ✓ Telegram @SnakkaZ_bot online",
  "  ✓ Claude Sonnet 4.6 ready",
  "",
  "$ legg til prosjekt: Nettbutikk for Klient X",
  "  → AI parser melding...",
  "  → Skriver content/projects/nettbutikk-klient-x.md",
  "  ✅ Prosjekt lagt til på petersen.digital",
];

export default function TerminalBlock() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let lineIndex = 0;
    let charIndex = 0;
    let currentSpan: HTMLSpanElement | null = null;

    const tick = () => {
      if (lineIndex >= LINES.length) return;

      const line = LINES[lineIndex];

      if (charIndex === 0) {
        currentSpan = document.createElement("span");
        currentSpan.className =
          line.startsWith("$")
            ? "block text-brand-400"
            : line.startsWith("  ✓") || line.startsWith("  ✅")
            ? "block text-green-400"
            : line.startsWith("  →")
            ? "block text-yellow-400"
            : "block text-zinc-400";
        el.appendChild(currentSpan);
      }

      if (line === "") {
        lineIndex++;
        charIndex = 0;
        setTimeout(tick, 200);
        return;
      }

      currentSpan!.textContent = line.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex >= line.length) {
        lineIndex++;
        charIndex = 0;
        setTimeout(tick, line.startsWith("$") ? 600 : 80);
      } else {
        setTimeout(tick, line.startsWith("$") ? 40 : 18);
      }
    };

    setTimeout(tick, 800);
  }, []);

  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-700 overflow-hidden shadow-2xl">
      {/* Terminal title bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-zinc-800 border-b border-zinc-700">
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-500" />
        <span className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-3 text-xs text-zinc-500 font-mono">
          openclaw — VPS srv1413711
        </span>
      </div>
      {/* Terminal body */}
      <div
        ref={ref}
        className="p-4 font-mono text-sm min-h-[180px] leading-relaxed"
      />
    </div>
  );
}
