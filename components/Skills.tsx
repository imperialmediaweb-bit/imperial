"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, TrendingUp, Users, Eye } from "lucide-react";

const skills = [
  { label: "Servicii Web", value: 80 },
  { label: "Soluții Marketing", value: 92 },
  { label: "Design UI/UX", value: 88 },
];

function Bar({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1200);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);
  return (
    <div ref={ref}>
      <div className="mb-2 flex items-center justify-between text-sm font-medium">
        <span className="text-text">{label}</span>
        <span className="text-brand-orange">{n}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-bg-soft">
        <motion.div
          className="h-full rounded-full bg-orange-gradient"
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : { width: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// MOCKUP DASHBOARD — un browser cu un dashboard analytics realistic
function DashboardMockup() {
  return (
    <div className="relative w-full">
      {/* Glow base */}
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-brand-orange/30 via-brand-purple/20 to-transparent blur-3xl" />

      {/* Browser frame */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-bg-card shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8),0_0_60px_rgba(255,107,26,0.25)]">
        {/* Browser bar */}
        <div className="flex items-center gap-2 border-b border-bg-border bg-bg-soft px-3.5 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-3 flex-1 rounded-md bg-bg/60 px-3 py-1 text-[10px] text-text-subtle">
            🔒 imperial-media.ro/dashboard
          </span>
        </div>

        {/* Dashboard content */}
        <div className="bg-bg p-4 sm:p-5">
          {/* Top metrics */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Trafic", value: "12.4K", change: "+24%", Icon: Eye, grad: "from-brand-orange to-pink-500" },
              { label: "Conversii", value: "847", change: "+18%", Icon: TrendingUp, grad: "from-brand-purple to-indigo-500" },
              { label: "Clienți", value: "92", change: "+8%", Icon: Users, grad: "from-emerald-500 to-teal-600" },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-xl border border-bg-border bg-bg-card p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-wider text-text-subtle">
                    {m.label}
                  </span>
                  <span className={`grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br ${m.grad} text-white`}>
                    <m.Icon className="h-3 w-3" />
                  </span>
                </div>
                <p className="mt-1.5 font-display text-xl font-extrabold text-text">
                  {m.value}
                </p>
                <p className="text-[9px] font-semibold text-emerald-400">
                  ↗ {m.change}
                </p>
              </div>
            ))}
          </div>

          {/* Chart placeholder — area chart with gradient */}
          <div className="mt-3 rounded-xl border border-bg-border bg-bg-card p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-text">
                Performanță săptămânală
              </span>
              <span className="text-[9px] text-text-subtle">Ultimele 7 zile</span>
            </div>
            <svg viewBox="0 0 280 80" className="h-20 w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6B1A" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#FF6B1A" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="chart-line" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FF6B1A" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {[20, 40, 60].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="280"
                  y2={y}
                  stroke="rgba(255,255,255,0.04)"
                />
              ))}
              {/* Area */}
              <path
                d="M0,60 L40,45 L80,52 L120,30 L160,38 L200,15 L240,22 L280,8 L280,80 L0,80 Z"
                fill="url(#chart-fill)"
              />
              {/* Line */}
              <path
                d="M0,60 L40,45 L80,52 L120,30 L160,38 L200,15 L240,22 L280,8"
                fill="none"
                stroke="url(#chart-line)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Dots */}
              {[
                [0, 60], [40, 45], [80, 52], [120, 30],
                [160, 38], [200, 15], [240, 22], [280, 8],
              ].map(([x, y]) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill="#FF6B1A" />
              ))}
            </svg>
          </div>

          {/* Recent activity */}
          <div className="mt-3 rounded-xl border border-bg-border bg-bg-card p-3">
            <span className="text-xs font-semibold text-text">Activitate recentă</span>
            <ul className="mt-2 space-y-1.5">
              {[
                { dot: "bg-emerald-400", text: "Site lansat: client-x.ro" },
                { dot: "bg-brand-orange", text: "Lead nou: Magazin Online" },
                { dot: "bg-brand-purple", text: "Update SEO: 5 pagini" },
              ].map((a, i) => (
                <li key={i} className="flex items-center gap-2 text-[10px] text-text-muted">
                  <span className={`h-1.5 w-1.5 rounded-full ${a.dot} shadow-[0_0_8px_currentColor]`} />
                  {a.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: -20 }}
        whileInView={{ opacity: 1, scale: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass absolute -bottom-6 -right-4 flex items-center gap-2.5 rounded-2xl px-4 py-2.5 shadow-glow-orange"
      >
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-gradient text-white">
          <TrendingUp className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-subtle">Scor SEO</p>
          <p className="text-sm font-bold text-text">98 / 100</p>
        </div>
      </motion.div>
    </div>
  );
}

export function Skills() {
  return (
    <section id="despre" className="section relative bg-bg-soft/30">
      <div className="container-app grid items-center gap-14 lg:grid-cols-2">
        {/* LEFT — Dashboard mockup pro */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <DashboardMockup />
        </motion.div>

        {/* RIGHT — copy */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span className="chip">Ce facem</span>
          <h2 className="section-title mt-4">
            Servicii Web și{" "}
            <span className="text-shimmer">Soluții de Marketing</span> pentru
            Afacerea Ta
          </h2>
          <p className="section-subtitle">
            Ne dedicăm să creăm și să optimizăm prezența ta online prin
            servicii personalizate de web design, dezvoltare și marketing
            digital, adaptate nevoilor fiecărei afaceri.
          </p>

          <div className="mt-8 space-y-5">
            {skills.map((s) => (
              <Bar key={s.label} {...s} />
            ))}
          </div>

          <a href="/brief" className="btn-primary mt-9">
            Primește estimare
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
