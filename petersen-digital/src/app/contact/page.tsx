import { getSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Kontakt" };

export default function ContactPage() {
  const site = getSiteConfig();
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-white mb-2">Ta kontakt</h1>
      <p className="text-zinc-400 mb-10">
        Jeg er tilgjengelig for kortere og lengre oppdrag. Svar innen 24 timer.
      </p>

      <div className="flex flex-col gap-4">
        {site.email && (
          <a
            href={`mailto:${site.email}`}
            className="flex items-center gap-4 p-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-brand-700 transition-colors"
          >
            <span className="text-2xl">✉️</span>
            <div>
              <p className="text-sm text-zinc-500">E-post</p>
              <p className="text-white">{site.email}</p>
            </div>
          </a>
        )}
        {site.whatsapp && (
          <a
            href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-brand-700 transition-colors"
          >
            <span className="text-2xl">💬</span>
            <div>
              <p className="text-sm text-zinc-500">WhatsApp</p>
              <p className="text-white">{site.whatsapp}</p>
            </div>
          </a>
        )}
        {site.github && (
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-brand-700 transition-colors"
          >
            <span className="text-2xl">🐙</span>
            <div>
              <p className="text-sm text-zinc-500">GitHub</p>
              <p className="text-white">{site.github}</p>
            </div>
          </a>
        )}
      </div>
    </div>
  );
}
