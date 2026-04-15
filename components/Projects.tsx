"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { importedProjects, type ImportedProject } from "@/lib/projects-data";

// Chain de fallback pentru imagini:
// 1. wpImages (pe imperial-media.ro) — BROWSER-UL le încarcă direct, nu e blocat
// 2. thum.io — fallback automat când WP dispare
// 3. mShots — fallback final
// 4. Gradient + inițiale dacă nimic nu merge
function buildImageChain(p: ImportedProject, w = 1200, h = 750): string[] {
  const chain: string[] = [];
  // 1. WP images (funcționează din browser, nu din server)
  if (p.wpImages?.length) {
    chain.push(...p.wpImages);
  }
  if (p.externalUrl) {
    // 2. thum.io — real screenshot live
    chain.push(
      `https://image.thum.io/get/width/${w}/crop/${h}/noanimate/${p.externalUrl}`
    );
    // 3. mShots — fallback cu cache
    chain.push(
      `https://s.wordpress.com/mshots/v1/${encodeURIComponent(
        p.externalUrl
      )}?w=${w}&h=${h}`
    );
  }
  return chain;
}

function ProjectImage({
  p,
  big,
}: {
  p: ImportedProject;
  big: boolean;
}) {
  const chain = buildImageChain(p, big ? 1400 : 800, big ? 900 : 500);
  const [idx, setIdx] = useState(0);
  const src = chain[idx];

  if (!src) return null;
  return (
    <img
      src={src}
      alt={p.title}
      loading="lazy"
      onError={() => setIdx((i) => i + 1)}
      className="absolute inset-0 h-full w-full object-cover object-top transition-all duration-700 group-hover:scale-[1.04]"
    />
  );
}

// Bento cycle: primul mare, restul mici (tiling fără goluri)
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

export function ProjectCard({
  p,
  idx,
  span,
  grad,
}: {
  p: ImportedProject;
  idx: number;
  span: { col: string; row: string; big: boolean };
  grad: string;
}) {
  const cat = p.categories[0] ?? "Web Design";
  const href = p.externalUrl ?? "#";
  const hasUrl = !!p.externalUrl;
  const initials = p.title
    .split(" ")
    .filter((w) => /[A-ZĂÂÎȘȚ]/.test(w[0] ?? ""))
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <motion.a
      href={href}
      target={hasUrl ? "_blank" : undefined}
      rel={hasUrl ? "noopener noreferrer" : undefined}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (idx % 5) * 0.06 }}
      className={`group relative col-span-1 ${span.col} ${span.row} overflow-hidden rounded-2xl border border-bg-border transition-all duration-500 hover:border-brand-orange/60 hover:shadow-glow-orange`}
    >
      {/* Gradient fallback visible imediat */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${grad} opacity-70`}
      />
      {/* Inițiale în gradient (văzute doar dacă nu se încarcă imagine) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-5xl font-extrabold tracking-tighter text-white/80 sm:text-7xl">
          {initials || p.title[0]}
        </span>
      </div>
      {/* Screenshot layer (if any source works) */}
      <ProjectImage p={p} big={span.big} />

      {/* Bottom gradient overlay */}
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

      {/* Hover badge top-right */}
      <span className="absolute right-4 top-4 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </motion.a>
  );
}

export function ProjectsGrid({
  items,
}: {
  items: ImportedProject[];
}) {
  return (
    <div className="grid auto-rows-[220px] gap-4 lg:grid-cols-12 lg:auto-rows-[240px]">
      {items.map((p, idx) => {
        const span = SPAN_CYCLE[idx % SPAN_CYCLE.length];
        const grad = FALLBACK_GRADIENTS[idx % FALLBACK_GRADIENTS.length];
        return (
          <ProjectCard
            key={p.key + idx}
            p={p}
            idx={idx}
            span={span}
            grad={grad}
          />
        );
      })}
    </div>
  );
}

export function Projects() {
  // Pe homepage: ultimele 4 proiecte (cele mai recente)
  const latest = importedProjects.slice(-4);

  return (
    <section id="proiecte" className="section relative">
      <div className="container-app">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="chip">Portofoliu</span>
            <h2 className="section-title mt-4">
              Ultimele <span className="text-shimmer">proiecte</span>
            </h2>
            <p className="section-subtitle">
              Cele mai recente site-uri lansate pentru clienți reali.
            </p>
          </div>
          <a href="/proiecte" className="btn-primary">
            Vezi toate 18 proiectele
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-12">
          <ProjectsGrid items={latest} />
        </div>
      </div>
    </section>
  );
}
