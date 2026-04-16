"use client";

import Link from "next/link";
import { useState } from "react";
import { Phone, Menu, X, Sparkles } from "lucide-react";
import { Logo } from "./Logo";
import { siteConfig } from "@/lib/site";

const navLinks = [
  { href: "/despre", label: "Despre" },
  { href: "/servicii", label: "Servicii" },
  { href: "/proiecte", label: "Proiecte" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-bg-border/60 bg-bg/85 backdrop-blur-xl">
      <div className="container-app flex h-24 items-center justify-between sm:h-28 md:h-32">
        <Logo size="lg" />

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative text-sm font-medium text-text-muted transition hover:text-text"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 bg-brand-orange transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Phone — secundar, icon only */}
          <Link
            href={`tel:${siteConfig.phoneRaw}`}
            aria-label={`Sună la ${siteConfig.phone}`}
            title={`Sună: ${siteConfig.phone}`}
            className="hidden h-10 w-10 place-items-center rounded-full border border-bg-border text-text-muted transition hover:border-brand-orange hover:text-brand-orange sm:grid"
          >
            <Phone className="h-4 w-4" strokeWidth={2.5} />
          </Link>

          {/* CTA principal — Primește estimare → chat AI */}
          <Link
            href="/#brief"
            className="group inline-flex items-center gap-2 rounded-full bg-orange-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-glow-orange transition-all hover:scale-[1.03] hover:shadow-[0_0_45px_rgba(255,107,26,0.55)] sm:px-5 sm:py-3"
          >
            <Sparkles className="h-4 w-4" strokeWidth={2.5} />
            <span>Primește estimare</span>
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
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted transition hover:bg-white/5 hover:text-text"
              >
                {l.label}
              </Link>
            ))}
            {/* CTA principal mobil */}
            <Link
              href="/#brief"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-orange-gradient px-5 py-3 text-sm font-semibold text-white shadow-glow-orange"
            >
              <Sparkles className="h-4 w-4" strokeWidth={2.5} />
              Primește estimare
            </Link>
            {/* Telefon mobil — secundar */}
            <Link
              href={`tel:${siteConfig.phoneRaw}`}
              onClick={() => setOpen(false)}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-full border border-bg-border px-5 py-3 text-sm font-medium text-text-muted"
            >
              <Phone className="h-4 w-4" />
              {siteConfig.phone}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
