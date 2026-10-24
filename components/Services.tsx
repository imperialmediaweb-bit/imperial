"use client";

import { motion } from "framer-motion";
import {
  Globe,
  ShoppingBag,
  BrainCircuit,
  Newspaper,
  LineChart,
  Wrench,
  ArrowUpRight,
} from "lucide-react";
import { SpotlightCard } from "./ids/extras/SpotlightCard";
import { IconBadge } from "./IconBadge";

// Bento grid asimetric: un card mare (meseria de bază) + carduri mici cu
// specializările. Texte specifice, nu generice.
const small = [
  {
    wash: "from-brand-orange/[0.18] via-brand-magenta/[0.06] to-transparent",
    icon: ShoppingBag,
    name: "Magazine online",
    text: "Plăți cu cardul, AWB automat la curieri, facturare integrată. De la 1.200€.",
    href: "/creare-magazin-online",
  },
  {
    wash: "from-brand-magenta/[0.18] via-brand-purple/[0.06] to-transparent",
    icon: BrainCircuit,
    name: "AI & Automatizări",
    text: "Consultanți AI pe site, rapoarte automate, fluxuri care lucrează singure — ca pe site-ul ăsta.",
    href: "/brief",
  },
  {
    wash: "from-brand-purple/[0.2] via-brand-magenta/[0.06] to-transparent",
    icon: Newspaper,
    name: "Presă — 50 de ziare",
    text: "Deținem rețeaua Media Expres: articole reale despre firma ta, în toată România.",
    href: "/servicii",
  },
  {
    wash: "from-brand-orange/[0.16] via-brand-purple/[0.07] to-transparent",
    icon: LineChart,
    name: "SEO + vizibilitate AI",
    text: "Tehnic inclus din construcție; campanii de autoritate și prezență în ChatGPT/Gemini.",
    href: "/optimizare-seo",
  },
  {
    wash: "from-brand-magenta/[0.16] via-brand-orange/[0.06] to-transparent",
    icon: Wrench,
    name: "Administrare",
    text: "De la 100 lei/lună, cu găzduire și domeniu incluse din anul 2.",
    href: "/servicii",
  },
];

export function Services() {
  return (
    <section id="servicii" className="section relative overflow-hidden">
      <div className="container-app relative z-10">
        <div className="max-w-2xl">
          <span className="chip">Serviciile noastre</span>
          <h2 className="section-title mt-4">
            Tot ce îți trebuie, <span className="text-gradient">sub un singur acoperiș</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Cardul mare — meseria de bază */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="sm:col-span-2 lg:row-span-2"
          >
            <SpotlightCard color="#FF2E9A" intensity={0.28} radius={16} className="group h-full rounded-2xl border border-bg-border glass-card bg-card-gradient transition-all hover:border-brand-orange/50">
              <a href="/creare-site-web" className="relative flex h-full flex-col justify-between overflow-hidden p-8">
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-orange/10 blur-3xl transition-all duration-500 group-hover:bg-brand-orange/25" />
                <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-brand-purple/10 blur-3xl" />

                <div className="relative">
                  <div className="flex items-center gap-4">
                    <IconBadge icon={Globe} />
                    <h3 className="font-display text-2xl font-extrabold text-text sm:text-3xl">
                      Site-uri & aplicații custom
                    </h3>
                  </div>
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed text-text-muted">
                    Scrise de la zero pe Next.js — tehnologia Netflix și Nike. Fără
                    WordPress, fără șabloane: viteză sub o secundă, SEO din
                    construcție, panou de administrare propriu.
                  </p>
                  <ul className="mt-5 space-y-2 text-sm text-text-muted">
                    <li>· Site Start — <strong className="text-text">1.500 lei</strong>, gata în câteva zile</li>
                    <li>· Site de prezentare complet — de la <strong className="text-text">699€</strong></li>
                    <li>· Platforme, SaaS, programări, portaluri — la cerere</li>
                  </ul>
                </div>

                <span className="relative mt-8 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text transition group-hover:text-brand-orange">
                  Vezi detalii și prețuri
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            </SpotlightCard>
          </motion.div>

          {/* Cardurile mici */}
          {small.map((s, idx) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.06 + idx * 0.06 }}
            >
              <SpotlightCard color="#FF2E9A" intensity={0.28} radius={16} className="group h-full rounded-2xl border border-bg-border glass-card bg-card-gradient transition-all hover:border-brand-orange/50">
                <a href={s.href} className="relative block h-full overflow-hidden p-6">
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${s.wash}`} />
                  <s.icon className="pointer-events-none absolute -bottom-5 -right-5 h-28 w-28 text-white/[0.05]" strokeWidth={1} />
                  <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-brand-orange/0 blur-3xl transition-all duration-500 group-hover:bg-brand-orange/20" />
                  <div className="relative">
                    <div className="flex items-center gap-3.5">
                      <IconBadge icon={s.icon} className="!h-12 !w-12 transition-transform duration-300 group-hover:scale-110" />
                      <h3 className="font-display text-lg font-bold text-text">{s.name}</h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted">{s.text}</p>
                  </div>
                </a>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
