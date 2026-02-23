import { getFeaturedProjects } from "@/lib/projects";
import { getSiteConfig } from "@/lib/site";
import ProjectCard from "@/components/portfolio/ProjectCard";
import ServiceCard from "@/components/portfolio/ServiceCard";
import TerminalBlock from "@/components/ui/TerminalBlock";
import Link from "next/link";

export const revalidate = 60;

export default function HomePage() {
  const site = getSiteConfig();
  const featured = getFeaturedProjects(3);

  return (
    <>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            {site.available && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-950 border border-green-800 text-green-400 text-sm w-fit">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Tilgjengelig for nye oppdrag
              </span>
            )}
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              {site.tagline}
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              {site.description}
            </p>
            <div className="flex gap-3">
              <Link
                href="/projects"
                className="px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors"
              >
                Se prosjekter
              </Link>
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-medium transition-colors"
              >
                Ta kontakt
              </Link>
            </div>
          </div>

          {/* Terminal animation */}
          <div className="lg:block">
            <TerminalBlock />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-zinc-800">
        <h2 className="text-2xl font-bold text-white mb-8">Hva jeg tilbyr</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {site.services.map((s) => (
            <ServiceCard key={s.title} service={s} />
          ))}
        </div>
      </section>

      {/* Featured projects */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Utvalgte prosjekter</h2>
            <Link
              href="/projects"
              className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
            >
              Se alle →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      )}

      {/* Tech stack */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-zinc-800">
        <h2 className="text-2xl font-bold text-white mb-8">Tech stack</h2>
        <div className="flex flex-wrap gap-2">
          {["PHP", "Laravel", "JavaScript", "TypeScript", "Node.js", "Next.js",
            "HTML", "CSS", "Tailwind", "MySQL", "REST API", "OpenClaw AI",
          ].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm font-mono"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* AI differentiator */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-zinc-800">
        <div className="rounded-xl bg-gradient-to-br from-brand-950 to-zinc-900 border border-brand-900 p-8">
          <div className="flex flex-col gap-4 max-w-2xl">
            <span className="text-3xl">🤖</span>
            <h2 className="text-2xl font-bold text-white">
              AI-drevet arbeidsflyt
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Jeg bruker OpenClaw — en AI-agent som kjører 24/7 på min VPS —
              koblet til WhatsApp og Telegram. Agenten kan automatisk oppdatere
              denne siden, gjøre research, skrive kode og mye mer, direkte fra
              en enkel melding. Akkurat slik kan jeg hjelpe deg automatisere
              arbeidsflyten din.
            </p>
            <Link
              href="/playground"
              className="text-brand-400 hover:text-brand-300 transition-colors w-fit"
            >
              Se live demo i Playground →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-zinc-800 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Klar for å bygge noe?
        </h2>
        <p className="text-zinc-400 mb-8">
          Ta kontakt — jeg svarer som regel samme dag.
        </p>
        <Link
          href="/contact"
          className="inline-flex px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors"
        >
          Kom i gang
        </Link>
      </section>
    </>
  );
}
