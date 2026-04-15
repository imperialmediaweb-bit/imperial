"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";

// Bento grid asimetric cu 6 proiecte, sizes diferite,
// fiecare cu identitate vizuală proprie + hover effects.

type Project = {
  title: string;
  category: string;
  colSpan: string;
  rowSpan: string;
  accent: string;
  pattern: "browser" | "mobile" | "chart" | "gradient" | "grid" | "code";
};

const projects: Project[] = [
  {
    title: "Botoșeneanul.ro",
    category: "Știri Online",
    colSpan: "lg:col-span-8",
    rowSpan: "lg:row-span-2",
    accent: "from-brand-orange via-pink-500 to-brand-purple",
    pattern: "browser",
  },
  {
    title: "TudoSa.ro",
    category: "E-Commerce",
    colSpan: "lg:col-span-4",
    rowSpan: "lg:row-span-1",
    accent: "from-brand-purple to-indigo-600",
    pattern: "mobile",
  },
  {
    title: "Expert Mutări",
    category: "Servicii",
    colSpan: "lg:col-span-4",
    rowSpan: "lg:row-span-1",
    accent: "from-amber-500 to-brand-orange",
    pattern: "grid",
  },
  {
    title: "Counting Botoșani",
    category: "Dashboard",
    colSpan: "lg:col-span-4",
    rowSpan: "lg:row-span-1",
    accent: "from-emerald-500 to-teal-600",
    pattern: "chart",
  },
  {
    title: "Affari Business",
    category: "Corporate",
    colSpan: "lg:col-span-4",
    rowSpan: "lg:row-span-1",
    accent: "from-brand-orange to-amber-500",
    pattern: "code",
  },
  {
    title: "Imperial Media Labs",
    category: "Platform",
    colSpan: "lg:col-span-4",
    rowSpan: "lg:row-span-1",
    accent: "from-pink-500 via-brand-purple to-indigo-500",
    pattern: "gradient",
  },
];

function Pattern({ type }: { type: Project["pattern"] }) {
  switch (type) {
    case "browser":
      return (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="w-full max-w-md overflow-hidden rounded-xl border border-white/20 bg-bg-card/80 shadow-2xl">
            <div className="flex items-center gap-1.5 border-b border-white/10 bg-black/30 px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-red-400/80" />
              <span className="h-2 w-2 rounded-full bg-amber-400/80" />
              <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
            </div>
            <div className="p-4">
              <div className="h-3 w-1/2 rounded bg-white/40" />
              <div className="mt-2 h-2 w-2/3 rounded bg-white/20" />
              <div className="mt-1 h-2 w-1/2 rounded bg-white/15" />
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-video rounded bg-white/10 border border-white/15"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    case "mobile":
      return (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="h-[85%] w-24 overflow-hidden rounded-[1.2rem] border-2 border-white/20 bg-bg-card/80 p-1.5 shadow-2xl">
            <div className="h-full rounded-[0.9rem] bg-gradient-to-b from-white/10 to-white/5 p-2">
              <div className="h-1 w-1/3 rounded bg-white/40" />
              <div className="mt-2 grid grid-cols-2 gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square rounded bg-white/20" />
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    case "chart":
      return (
        <div className="absolute inset-0 flex items-end p-6">
          <svg
            viewBox="0 0 200 100"
            className="h-full w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`ch-${Math.random()}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[15, 40, 28, 55, 42, 70, 58, 85, 72].map((h, i) => (
              <rect
                key={i}
                x={i * 22 + 5}
                y={100 - h}
                width="16"
                height={h}
                rx="2"
                fill="rgba(255,255,255,0.8)"
              />
            ))}
          </svg>
        </div>
      );
    case "gradient":
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="h-32 w-32 rounded-full opacity-80 blur-2xl"
            style={{
              background: "radial-gradient(circle, white, transparent)",
            }}
          />
          <span className="absolute font-display text-5xl font-extrabold tracking-tighter text-white/80">
            IM
          </span>
        </div>
      );
    case "grid":
      return (
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-1.5 p-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="rounded bg-white/20"
              style={{ opacity: 0.3 + Math.random() * 0.7 }}
            />
          ))}
        </div>
      );
    case "code":
      return (
        <div className="absolute inset-0 flex items-center p-6 font-mono text-[10px] text-white/80">
          <div className="w-full space-y-1">
            <p>
              <span className="text-white/50">const</span>{" "}
              <span className="text-white">site</span>{" "}
              <span className="text-white/50">=</span>{" "}
              <span className="text-white/70">&#123;</span>
            </p>
            <p className="pl-3">
              <span className="text-white">design</span>:{" "}
              <span className="text-white/80">'premium'</span>,
            </p>
            <p className="pl-3">
              <span className="text-white">speed</span>:{" "}
              <span className="text-white/80">'fast'</span>,
            </p>
            <p className="pl-3">
              <span className="text-white">result</span>:{" "}
              <span className="text-white/80">'wow'</span>,
            </p>
            <p>
              <span className="text-white/70">&#125;;</span>
            </p>
          </div>
        </div>
      );
  }
}

export function Projects() {
  return (
    <section id="proiecte" className="section relative">
      <div className="container-app">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="chip">Portofoliu</span>
            <h2 className="section-title mt-4">
              Proiecte <span className="text-shimmer">realizate</span>
            </h2>
          </div>
          <a href="#" className="btn-ghost">
            Vezi toate proiectele
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-12 grid auto-rows-[200px] gap-4 lg:grid-cols-12 lg:auto-rows-[220px]">
          {projects.map((p, idx) => (
            <motion.a
              key={p.title}
              href="#"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className={`group relative col-span-1 ${p.colSpan} ${p.rowSpan} overflow-hidden rounded-2xl border border-bg-border transition-all duration-500 hover:border-brand-orange/50 hover:shadow-glow-orange`}
            >
              {/* Background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${p.accent} opacity-80 transition-all duration-500 group-hover:scale-110 group-hover:opacity-95`}
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/20" />
              {/* Pattern visual */}
              <Pattern type={p.pattern} />

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5">
                <span className="inline-flex w-fit items-center rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur">
                  {p.category}
                </span>
                <h3 className="mt-2 font-display text-lg font-bold text-white sm:text-xl">
                  {p.title}
                </h3>
              </div>

              {/* Hover: external link icon top-right */}
              <span className="absolute right-4 top-4 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <ExternalLink className="h-4 w-4" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
