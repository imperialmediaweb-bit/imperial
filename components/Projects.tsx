"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { importedProjects } from "@/lib/projects-data";

// Screenshot live via WordPress.com mShots API — gratuit, fără key.
// Se actualizează automat când clientul își schimbă site-ul.
function screenshotUrl(url: string, w = 1200, h = 750) {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(
    url
  )}?w=${w}&h=${h}`;
}

// Bento layout pattern — repetă ciclic pe toate proiectele.
// Primul din ciclu e mare (8-col, 2-row), celelalte 4 sunt mici (4-col).
const SPAN_CYCLE = [
  { col: "lg:col-span-8", row: "lg:row-span-2", big: true },
  { col: "lg:col-span-4", row: "lg:row-span-1", big: false },
  { col: "lg:col-span-4", row: "lg:row-span-1", big: false },
  { col: "lg:col-span-4", row: "lg:row-span-1", big: false },
  { col: "lg:col-span-4", row: "lg:row-span-1", big: false },
];

const FALLBACK_GRADIENTS = [
  "from-brand-orange via-pink-500 to-brand-purple",
  "from-brand-purple to-indigo-600",
  "from-amber-500 to-brand-orange",
  "from-emerald-500 to-teal-600",
  "from-brand-orange to-amber-500",
  "from-pink-500 via-brand-purple to-indigo-500",
];

export function Projects() {
  const items = importedProjects.slice(0, 10); // primele 10 pe homepage

  return (
    <section id="proiecte" className="section relative">
      <div className="container-app">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="chip">Portofoliu</span>
            <h2 className="section-title mt-4">
              Proiecte <span className="text-shimmer">realizate</span>
            </h2>
            <p className="section-subtitle">
              Site-uri lansate pentru clienți reali. Fiecare captură e live
              de pe site-ul clientului.
            </p>
          </div>
          <a href="#proiecte" className="btn-ghost">
            Vezi toate proiectele
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-12 grid auto-rows-[220px] gap-4 lg:grid-cols-12 lg:auto-rows-[240px]">
          {items.map((p, idx) => {
            const span = SPAN_CYCLE[idx % SPAN_CYCLE.length];
            const grad =
              FALLBACK_GRADIENTS[idx % FALLBACK_GRADIENTS.length];
            const cat = p.categories[0] ?? "Web Design";
            const href = p.externalUrl ?? "#";
            const hasUrl = !!p.externalUrl;

            return (
              <motion.a
                key={p.key}
                href={href}
                target={hasUrl ? "_blank" : undefined}
                rel={hasUrl ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: idx * 0.06 }}
                className={`group relative col-span-1 ${span.col} ${span.row} overflow-hidden rounded-2xl border border-bg-border transition-all duration-500 hover:border-brand-orange/60 hover:shadow-glow-orange`}
              >
                {/* Background: screenshot live SAU gradient fallback */}
                {hasUrl ? (
                  <>
                    {/* Gradient fallback visible while screenshot loads */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${grad} opacity-60`}
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={screenshotUrl(
                        p.externalUrl!,
                        span.big ? 1400 : 800,
                        span.big ? 900 : 500
                      )}
                      alt={p.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover object-top transition-all duration-700 group-hover:scale-[1.04]"
                    />
                  </>
                ) : (
                  <>
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${grad} opacity-90 transition-transform duration-700 group-hover:scale-110`}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-4xl font-extrabold tracking-tighter text-white/80 sm:text-6xl">
                        {p.title
                          .split(" ")
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                    </div>
                  </>
                )}

                {/* Bottom gradient overlay pentru readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <span className="inline-flex w-fit items-center rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur">
                    {cat}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-bold leading-tight text-white sm:text-xl">
                    {p.title}
                  </h3>
                  {hasUrl && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-white/60">
                      <ExternalLink className="h-3 w-3" />
                      {new URL(p.externalUrl!).hostname.replace("www.", "")}
                    </p>
                  )}
                </div>

                {/* Top-right hover badge */}
                <span className="absolute right-4 top-4 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
