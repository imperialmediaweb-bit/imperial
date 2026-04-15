"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowUpRight } from "lucide-react";

const articles = [
  {
    title: "5 motive pentru care site-ul tău are nevoie de redesign în 2026",
    excerpt: "Un site învechit pierde clienți. Iată semnele clare că e timpul pentru o transformare digitală.",
    date: "10 Apr 2026",
    cat: "Web Design",
    grad: "from-brand-orange via-pink-500 to-brand-purple",
  },
  {
    title: "Cum să crești vânzările magazinului online cu SEO local",
    excerpt: "Strategii practice de SEO local care aduc clienți reali din zona ta. Tehnici testate, rezultate măsurabile.",
    date: "28 Mar 2026",
    cat: "SEO",
    grad: "from-brand-purple via-indigo-500 to-brand-orange",
  },
  {
    title: "Branding pentru afaceri mici: ghid complet",
    excerpt: "De la logo la voce de brand. Tot ce trebuie să știi pentru a-ți poziționa afacerea pe piață.",
    date: "12 Mar 2026",
    cat: "Branding",
    grad: "from-pink-500 via-brand-orange to-amber-500",
  },
];

export function BlogPreview() {
  return (
    <section id="blog" className="section relative">
      <div className="container-app">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="chip">Blog</span>
            <h2 className="section-title mt-4">
              Articole <span className="text-gradient">recente</span>
            </h2>
          </div>
          <a href="#blog" className="btn-ghost">
            Toate articolele
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {articles.map((a, idx) => (
            <motion.a
              key={a.title}
              href="#blog"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-bg-border bg-bg-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/50"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${a.grad} opacity-90 transition-transform duration-500 group-hover:scale-110`}
                />
                <div className="absolute inset-0 bg-black/20" />
                <span className="absolute left-4 top-4 rounded-full bg-bg/80 px-3 py-1 text-xs font-semibold text-text backdrop-blur">
                  {a.cat}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="inline-flex items-center gap-1.5 text-xs text-text-subtle">
                  <Calendar className="h-3.5 w-3.5" />
                  {a.date}
                </p>
                <h3 className="mt-3 font-display text-lg font-bold leading-tight text-text transition group-hover:text-brand-orange">
                  {a.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-text-muted">
                  {a.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-orange">
                  Citește
                  <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
