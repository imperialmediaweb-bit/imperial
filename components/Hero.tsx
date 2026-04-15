"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { WaveBackground } from "./WaveBackground";
import { useEffect, useState } from "react";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1500;
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return (
    <span>
      {n}
      {suffix}
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <WaveBackground />

      <div className="container-app relative z-10 grid items-center gap-12 pt-14 pb-24 lg:grid-cols-[1fr,auto] lg:gap-8 lg:pt-20 lg:pb-32">
        {/* Left: copy */}
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="chip border-brand-orange/40 bg-brand-orange/10 text-brand-orangeLight"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Creatori de Emoții digitale
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-text sm:text-6xl lg:text-7xl"
          >
            Soluții <span className="text-gradient">web personalizate</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 max-w-xl text-base text-text-muted sm:text-lg"
          >
            Transformăm ideile tale în soluții digitale personalizate. Te
            ajutăm cu website-uri de prezentare, magazine online, dezvoltare
            web, branding și promovare. Acopere nevoile tale și ale clienților
            tăi.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a href="#brief" className="btn-primary text-base">
              Contact
              <ArrowRight className="h-4 w-4" />
            </a>
            <button
              type="button"
              className="group inline-flex items-center gap-3 rounded-full border border-bg-border bg-white/5 px-4 py-2.5 text-sm font-medium text-text-muted backdrop-blur transition hover:border-brand-orange hover:text-text"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-orange-gradient text-white shadow-glow-orange transition group-hover:scale-110">
                <Play className="h-3.5 w-3.5 fill-white" strokeWidth={0} />
              </span>
              Vezi Video
            </button>
          </motion.div>
        </div>

        {/* Right: hero visual + stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto flex w-full max-w-md flex-col items-end gap-6 lg:w-auto"
        >
          {/* Hero "image" — abstract gradient sphere with overlay text */}
          <div className="relative aspect-square w-full max-w-sm">
            <div className="absolute inset-0 animate-float">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-orange via-brand-purple to-brand-glow opacity-90 blur-2xl" />
              <div className="absolute inset-2 overflow-hidden rounded-3xl border border-white/10 bg-bg-card/40 backdrop-blur-xl">
                {/* Abstract decorative pattern inside the visual frame */}
                <svg
                  viewBox="0 0 200 200"
                  className="h-full w-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <radialGradient id="orb" cx="50%" cy="40%" r="60%">
                      <stop offset="0%" stopColor="#FF6B1A" stopOpacity="0.95" />
                      <stop offset="60%" stopColor="#7B2FF7" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#0E0617" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="100" cy="90" r="70" fill="url(#orb)" />
                  {Array.from({ length: 12 }).map((_, i) => (
                    <circle
                      key={i}
                      cx="100"
                      cy="100"
                      r={20 + i * 6}
                      fill="none"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="0.6"
                    />
                  ))}
                  <text
                    x="50%"
                    y="92%"
                    textAnchor="middle"
                    className="font-display"
                    fontSize="22"
                    fontWeight="800"
                    fill="rgba(255,255,255,0.85)"
                    letterSpacing="2"
                  >
                    site-uri
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid w-full max-w-xs grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { n: 10, suffix: "", label: "Ani de experiență" },
              { n: 200, suffix: "+", label: "Clienți mulțumiți" },
              { n: 384, suffix: "+", label: "Proiecte finalizate" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3 rounded-xl border border-bg-border bg-bg-card/70 px-4 py-3 backdrop-blur"
              >
                <span className="font-display text-3xl font-extrabold text-brand-orange">
                  <Counter to={s.n} suffix={s.suffix} />
                </span>
                <span className="text-xs leading-tight text-text-muted">
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
