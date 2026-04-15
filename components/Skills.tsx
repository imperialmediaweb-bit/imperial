"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

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

export function Skills() {
  return (
    <section id="despre" className="section relative bg-bg-soft/40">
      <div className="container-app grid items-center gap-12 lg:grid-cols-2">
        {/* Left visual */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-bg-border bg-bg-card"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/40 via-brand-orange/20 to-transparent" />
          <svg
            viewBox="0 0 400 300"
            className="absolute inset-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="mesh" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF6B1A" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#7B2FF7" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            {/* Decorative mesh */}
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={`h${i}`}
                x1="0"
                y1={i * 28}
                x2="400"
                y2={i * 28 - 30}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            ))}
            {Array.from({ length: 16 }).map((_, i) => (
              <line
                key={`v${i}`}
                x1={i * 28}
                y1="0"
                x2={i * 28 + 30}
                y2="300"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            ))}
            {/* Floating shapes */}
            <circle cx="120" cy="120" r="50" fill="url(#mesh)" />
            <rect
              x="220"
              y="80"
              width="80"
              height="80"
              rx="16"
              fill="url(#mesh)"
              opacity="0.7"
            />
            <polygon
              points="180,200 240,260 120,260"
              fill="url(#mesh)"
              opacity="0.55"
            />
          </svg>
          {/* Glow corners */}
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-brand-orange/40 blur-3xl" />
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-brand-purple/40 blur-3xl" />
        </motion.div>

        {/* Right copy */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span className="chip">Ce facem</span>
          <h2 className="section-title mt-4">
            Servicii Web și{" "}
            <span className="text-gradient">Soluții de Marketing</span> pentru
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

          <a href="#brief" className="btn-primary mt-9">
            Despre noi
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
