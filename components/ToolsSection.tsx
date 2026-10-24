"use client";

import { motion } from "framer-motion";
import { IconBadge } from "./IconBadge";
import Link from "next/link";
import { Sparkles, Target, Shield } from "lucide-react";
import { SpotlightCard } from "./ids/extras/SpotlightCard";

const tools = [
  {
    icon: Sparkles,
    title: "Primește estimare",
    description:
      "Spune-ne ce vrei (scris sau prin voce) și primești estimare orientativă pe loc. AI-ul adaptează întrebările pe industria ta.",
    href: "/brief",
    cta: "Cere estimare →",
    accent: "from-brand-orange to-brand-magenta",
    wash: "from-brand-orange/[0.22] via-brand-magenta/[0.08] to-transparent",
    glow: "group-hover:bg-brand-orange/30",
  },
  {
    icon: Target,
    title: "Consultanță digitală",
    description:
      "Nu știi ce ai nevoie? AI-ul analizează afacerea ta și-ți spune exact unde pierzi clienți: site, social media, SEO, branding.",
    href: "/consultanta",
    cta: "Află unde greșești →",
    accent: "from-brand-magenta to-brand-purple",
    wash: "from-brand-magenta/[0.2] via-brand-purple/[0.08] to-transparent",
    glow: "group-hover:bg-brand-purple/30",
  },
  {
    icon: Shield,
    title: "Audit site gratuit",
    description:
      "Ai deja un site? Introdu URL-ul și primești scor + probleme + recomandări pe 5 categorii: viteză, mobile, SEO, securitate, design.",
    href: "/audit",
    cta: "Scanează gratuit →",
    accent: "from-brand-purple to-brand-glow",
    wash: "from-brand-purple/[0.22] via-brand-magenta/[0.07] to-transparent",
    glow: "group-hover:bg-green-500/30",
  },
];

export function ToolsSection() {
  return (
    <section className="section relative">
      <div className="container-app">
        <div className="text-center">
          <span className="chip">
            <Sparkles className="h-3 w-3" /> Instrumente gratuite
          </span>
          <h2 className="section-title mt-4 mx-auto">
            Alege cum vrei să <span className="text-gradient">începem</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Trei moduri în care te putem ajuta — toate gratuite, fără obligații.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {tools.map((t, idx) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <SpotlightCard color="#FF2E9A" intensity={0.3} radius={16} className="h-full rounded-2xl">
                <Link
                  href={t.href}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-bg-border glass-card bg-card-gradient p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                >
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${t.wash}`} />
                  <t.icon className="pointer-events-none absolute -bottom-6 -right-6 h-32 w-32 text-white/[0.05] transition-transform duration-500 group-hover:scale-110 group-hover:text-white/[0.08]" strokeWidth={1} />
                  <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-transparent blur-3xl transition-all duration-500 ${t.glow}`} />

                  <div className="relative">
                    <div className="flex items-center gap-4">
                      <IconBadge icon={t.icon} className="transition-transform duration-300 group-hover:scale-110" />
                      <h3 className="font-display text-lg font-bold text-text">
                        {t.title}
                      </h3>
                    </div>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">
                      {t.description}
                    </p>

                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-orange transition group-hover:gap-2.5">
                      {t.cta}
                    </span>
                  </div>
                </Link>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
