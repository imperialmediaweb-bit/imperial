"use client";

import Link from "next/link";
import { useState } from "react";
import { Phone, Search, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { siteConfig } from "@/lib/site";

const navLinks = [
  { href: "/despre", label: "Despre" },
  { href: "/servicii", label: "Servicii" },
  { href: "/proiecte", label: "Proiecte" },
  { href: "/#blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-bg-border/60 bg-bg/85 backdrop-blur-xl">
      <div className="container-app flex h-20 items-center justify-between sm:h-24">
        <Logo size="lg" />

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative text-sm font-medium text-text-muted transition hover:text-text"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 bg-brand-orange transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Caută"
            className="hidden h-10 w-10 place-items-center rounded-full border border-bg-border text-text-muted transition hover:border-brand-orange hover:text-brand-orange md:grid"
          >
            <Search className="h-4 w-4" />
          </button>

          <Link
            href={`tel:${siteConfig.phoneRaw}`}
            className="group inline-flex items-center gap-2.5 rounded-full bg-bg-card/60 px-2 py-1.5 text-sm font-medium text-text transition hover:bg-bg-card sm:px-3"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-orange-gradient text-white shadow-glow-orange transition group-hover:scale-110">
              <Phone className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="hidden flex-col items-start leading-tight sm:flex">
              <span className="text-[10px] uppercase tracking-wider text-text-muted">
                Sună
              </span>
              <span className="text-sm font-semibold text-text">
                {siteConfig.phone}
              </span>
            </span>
          </Link>

          <button
            type="button"
            aria-label="Meniu"
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full border border-bg-border text-text lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="border-t border-bg-border bg-bg/95 backdrop-blur-xl lg:hidden">
          <nav className="container-app flex flex-col gap-1 py-4">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted transition hover:bg-white/5 hover:text-text"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
