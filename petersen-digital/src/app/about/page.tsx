import { getSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Om meg" };

export default function AboutPage() {
  const site = getSiteConfig();
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-white mb-6">Om {site.name}</h1>

      <div className="flex flex-col gap-6 text-zinc-300 leading-relaxed">
        <p>
          Jeg er en fullstack-utvikler og AI-spesialist fra {site.location}.
          Gjennom {site.name} hjelper jeg bedrifter og enkeltpersoner med å
          bygge nettsider, automatisere arbeidsflyter og ta i bruk moderne
          AI-teknologi.
        </p>

        <p>
          Min spesialkompetanse er å koble systemer sammen — enten det er en
          WooCommerce-butikk som skal snakke med et lagersystem, eller en
          AI-agent som automatisk svarer på kundehenvendelser på WhatsApp.
        </p>

        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
          <h2 className="font-semibold text-white mb-4">Kompetanse</h2>
          <div className="grid grid-cols-2 gap-2">
            {["Laravel / PHP", "JavaScript / TypeScript", "Node.js / Next.js",
              "REST API-design", "AI-integrasjoner", "VPS & Nginx",
              "MySQL / Database", "OpenClaw AI", "HTML / CSS / Tailwind",
              "Automatisering"
            ].map((s) => (
              <div key={s} className="flex items-center gap-2 text-sm text-zinc-400">
                <span className="text-brand-500">✓</span> {s}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-brand-950 to-zinc-900 border border-brand-900 p-6">
          <h2 className="font-semibold text-white mb-2">AI-drevet arbeidsflyt</h2>
          <p className="text-zinc-400 text-sm">
            Jeg bruker OpenClaw — en AI-plattform som kjører 24/7 på min VPS —
            koblet til WhatsApp og Telegram. Agenten bruker Claude Sonnet fra
            Anthropic og kan automatisk oppdatere innhold, gjøre research og
            hjelpe kunder.
          </p>
        </div>
      </div>
    </div>
  );
}
