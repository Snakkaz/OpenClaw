export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-zinc-500 text-sm">
          © {year} Petersen Digital. Bygget med Next.js + OpenClaw 🦞
        </p>
        <div className="flex items-center gap-4 text-sm text-zinc-500">
          <a href="/projects" className="hover:text-zinc-300 transition-colors">
            Prosjekter
          </a>
          <a href="/playground" className="hover:text-zinc-300 transition-colors">
            Playground
          </a>
          <a href="/contact" className="hover:text-zinc-300 transition-colors">
            Kontakt
          </a>
        </div>
      </div>
    </footer>
  );
}
