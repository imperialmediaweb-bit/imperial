"use client";

import { motion } from "framer-motion";
import { Gift, Newspaper, Globe, TrendingUp, ExternalLink } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Ziare locale", value: "41", icon: Newspaper },
  { label: "Ziare naționale", value: "9", icon: Globe },
  { label: "Total publicații", value: "50+", icon: TrendingUp },
];

export function MediaExpresBonus() {
  return (
    <section className="section relative overflow-hidden">
      {/* Glow */}
      <div className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-brand-orange/15 blur-[150px]" />
      <div className="pointer-events-none absolute -right-24 bottom-1/3 h-80 w-80 rounded-full bg-brand-purple/15 blur-[150px]" />

      <div className="container-app relative z-10">
        <div className="text-center">
          <span className="chip">
            <Gift className="h-3 w-3" /> Bonus exclusiv
          </span>
          <h2 className="section-title mt-4 mx-auto">
            Primești <span className="text-gradient">promovare gratuită</span> în 50 ziare
          </h2>
          <p className="section-subtitle mx-auto">
            La orice site nou, primești cadou o campanie de promovare prin
            Rețeaua Media Expres — articolul tău publicat în 50 de ziare online
            (41 locale + 9 naționale) cu linkuri dofollow.
          </p>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-2xl border border-brand-orange/30 bg-brand-orange/5 p-5 text-center"
            >
              <s.icon className="mx-auto h-6 w-6 text-brand-orange" />
              <p className="mt-2 font-display text-3xl font-extrabold text-text">
                {s.value}
              </p>
              <p className="mt-1 text-xs text-text-muted">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Beneficii */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-10 max-w-3xl rounded-3xl border border-bg-border bg-bg-card bg-card-gradient p-6 shadow-card sm:p-8"
        >
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-2xl bg-orange-gradient shadow-glow-orange">
              <Gift className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-display text-xl font-bold text-text">
                Campanie gratuită — valoare 500€
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                Fiecare client care comandă un site primește gratuit publicarea
                unui articol de promovare în toate cele 50 de publicații.
                Rezultat: vizibilitate SEO imediată, linkuri dofollow din ziare
                cu autoritate, și distribuire pe rețelele sociale ale fiecărei
                publicații.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                <span className="rounded-full border border-brand-orange/30 bg-brand-orange/10 px-3 py-1 text-[11px] font-semibold text-brand-orange">
                  50+ linkuri dofollow
                </span>
                <span className="rounded-full border border-brand-purple/30 bg-brand-purple/10 px-3 py-1 text-[11px] font-semibold text-brand-purple">
                  Raport în 24h
                </span>
                <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-[11px] font-semibold text-green-300">
                  Distribuire Facebook
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link href="/brief" className="btn-primary">
            <Gift className="h-4 w-4" />
            Cere estimare + bonus gratuit
          </Link>
        </div>
      </div>
    </section>
  );
}
