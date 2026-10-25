"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, Sparkles, X } from "lucide-react";
import { Logo } from "./Logo";
import { siteConfig } from "@/lib/site";

const navLinks = [
  { href: "/despre", label: "Despre", hint: "Cine suntem și cum lucrăm" },
  { href: "/estimare", label: "Estimare", hint: "Calculezi prețul pe loc, în lei" },
  { href: "/analiza", label: "Analiză gratuită", hint: "Ai nevoie de un site? Află în 2 minute" },
  { href: "/servicii", label: "Servicii", hint: "Site-uri, aplicații, AI, automatizări" },
  { href: "/proiecte", label: "Portofoliu", hint: "384+ proiecte livrate" },
  { href: "/site-start", label: "Site Start", hint: "Site-ul tău — 1.500 lei, totul inclus" },
  { href: "/service", label: "Radiografia Afacerii", hint: "Vezi unde stă firma ta online" },
  { href: "/blog", label: "Blog", hint: "Ghiduri și prețuri reale" },
  { href: "/contact", label: "Contact", hint: "Scrie-ne sau sună-ne" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Overlay-ul se închide la navigare și blochează scroll-ul paginii cât e deschis.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    // ATENȚIE: backdrop-blur NU stă pe <header> — ar deveni containing block
    // pentru overlay-ul fixed și meniul full-screen s-ar ancora la bară, nu la viewport.
    <header className="sticky top-0 z-40">
      <div className="border-b border-bg-border/60 bg-bg/85 backdrop-blur-xl">
      <div className="container-app flex h-24 items-center justify-between sm:h-28 md:h-32">
        <Logo size="lg" />

        <nav className="hidden items-center gap-7 lg:flex">
          {["/servicii", "/proiecte", "/despre", "/estimare", "/contact"].map((h) => navLinks.find((n) => n.href === h)!).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative text-sm font-medium text-text-muted transition hover:text-text"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 bg-imperial-gradient transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* CTA principal — Primește estimare → chat AI */}
          <Link
            href="/brief"
            className="group inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-orange-gradient px-3.5 py-2 text-xs font-semibold text-white shadow-glow-orange transition-all hover:scale-[1.03] hover:shadow-[0_0_45px_rgba(255,46,154,0.5)] sm:gap-2 sm:px-5 sm:py-3 sm:text-sm"
          >
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.5} />
            <span className="hidden min-[420px]:inline">Primește estimare</span>
            <span className="min-[420px]:hidden">Estimare</span>
          </Link>

          <button
            type="button"
            aria-label={open ? "Închide meniul" : "Meniu"}
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full border border-bg-border text-text transition hover:border-brand-magenta/60 hover:shadow-glow-magenta sm:h-11 sm:w-11"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      </div>

      {/* ───── Meniul full-screen — ca la marile agenții ───── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-0 z-50 flex flex-col overflow-y-auto bg-bg"
          >
            {/* Fundal cu luminile brandului */}
            <div className="pointer-events-none absolute inset-0 bg-hero-gradient" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(6,6,8,0.9)_100%)]" />

            {/* Bara de sus a overlay-ului */}
            <div className="container-app relative flex h-24 shrink-0 items-center justify-between sm:h-28 md:h-32">
              <Logo size="lg" />
              <button
                type="button"
                aria-label="Închide meniul"
                onClick={() => setOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-full border border-bg-border text-text transition hover:rotate-90 hover:border-brand-magenta/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Linkurile uriașe */}
            <nav className="container-app relative flex flex-1 flex-col justify-center gap-1 py-8 sm:gap-2">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.45, delay: 0.06 + i * 0.055, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline gap-4 py-1.5 sm:gap-6"
                  >
                    <span className="w-8 shrink-0 font-mono text-xs text-text-subtle transition group-hover:text-brand-orange sm:text-sm">
                      0{i + 1}
                    </span>
                    <span className="font-display text-3xl font-black uppercase tracking-tight text-text transition-colors duration-200 group-hover:text-transparent sm:text-5xl lg:text-6xl"
                      style={{
                        backgroundImage: "linear-gradient(110deg,#FF6B1A 0%,#FF2E9A 55%,#8B2FF7 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                      }}
                    >
                      {l.label}
                    </span>
                    <span className="hidden items-center gap-1.5 text-sm text-text-subtle opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 md:inline-flex">
                      {l.hint}
                      <ArrowUpRight className="h-4 w-4 text-brand-magenta" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Subsolul overlay-ului: CTA + contact */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
              className="container-app relative flex shrink-0 flex-wrap items-center justify-between gap-4 border-t border-bg-border/60 py-6"
            >
              <Link
                href="/brief"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-6 py-3 text-sm font-semibold text-white shadow-glow-orange transition hover:scale-[1.03]"
              >
                <Sparkles className="h-4 w-4" strokeWidth={2.5} />
                Primește estimare gratuită
              </Link>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-text-muted">
                <a href={`mailto:${siteConfig.email}`} className="transition hover:text-text">
                  {siteConfig.email}
                </a>
                <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="transition hover:text-text">
                  {siteConfig.phone}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
