"use client";

import Link from "next/link";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Hjem" },
  { href: "/projects", label: "Prosjekter" },
  { href: "/playground", label: "Playground" },
  { href: "/about", label: "Om meg" },
  { href: "/contact", label: "Kontakt" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-bold text-lg text-white hover:text-brand-400 transition-colors"
        >
          Petersen<span className="text-brand-400">.</span>Digital
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="/contact"
          className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-colors"
        >
          Ta kontakt
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-zinc-400"
          onClick={() => setOpen(!open)}
          aria-label="Meny"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-4 flex flex-col gap-3">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-zinc-300 hover:text-white py-1"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="/contact"
            className="mt-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm text-center"
          >
            Ta kontakt
          </a>
        </div>
      )}
    </header>
  );
}
