"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { Logo } from "./Logo";
import { siteConfig } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-bg-border/60 bg-bg/80 backdrop-blur-lg">
      <div className="container-app flex h-16 items-center justify-between sm:h-20">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#pachete"
            className="text-sm font-medium text-text-muted transition hover:text-text"
          >
            Pachete
          </a>
          <a
            href="#cum-functioneaza"
            className="text-sm font-medium text-text-muted transition hover:text-text"
          >
            Cum funcționează
          </a>
          <a
            href="#brief"
            className="text-sm font-medium text-text-muted transition hover:text-text"
          >
            Cere ofertă
          </a>
        </nav>

        <Link
          href={`tel:${siteConfig.phoneRaw}`}
          className="group inline-flex items-center gap-2 rounded-full border border-bg-border bg-white/5 px-3 py-2 text-sm font-medium text-text transition hover:border-brand-orange hover:bg-white/10 sm:px-4"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-orange-gradient text-white shadow-glow-orange transition group-hover:scale-110">
            <Phone className="h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
          <span className="hidden sm:inline">{siteConfig.phone}</span>
        </Link>
      </div>
    </header>
  );
}
