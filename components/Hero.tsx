"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ParticleField } from "./effects/ParticleField";
import { Meteors } from "./effects/Meteors";
import { Spotlight } from "./effects/Spotlight";
import { Aurora } from "./effects/Aurora";
import { InteractiveGrid } from "./effects/InteractiveGrid";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1800;
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

// 3D parallax pe scroll pentru orb
function useParallax() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const handler = () => setY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return y;
}

export function Hero() {
  const scrollY = useParallax();
  const orbRef = useRef<HTMLDivElement>(null);

  // Mouse parallax pe orb
  useEffect(() => {
    const el = orbRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="relative min-h-[92vh] overflow-hidden">
      {/* === STRATURI DE EFECTE (în ordine, de jos în sus) === */}
      {/* 1. Aurora gradient blobs */}
      <Aurora />
      {/* 2. Interactive grid (light up on cursor) */}
      <InteractiveGrid />
      {/* 3. Particle field (canvas, mouse-aware, connections) */}
      <div className="absolute inset-0">
        <ParticleField density={90} color="rgba(255, 165, 80," />
      </div>
      {/* 4. Meteor shower */}
      <Meteors count={18} />
      {/* 5. Mouse-follow spotlight */}
      <Spotlight color="rgba(255, 107, 26, 0.22)" size={600} />
      {/* 6. Vignette pentru depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(14,6,23,0.85)_100%)]" />

      {/* === CONȚINUTUL HERO === */}
      <div className="container-app relative z-10 grid min-h-[92vh] items-center gap-12 pt-10 pb-20 lg:grid-cols-[1.1fr,1fr] lg:gap-16 lg:pt-16">
        {/* LEFT — copy */}
        <div>
          {/* Badge animat cu border gradient */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative inline-flex"
          >
            <div className="gradient-border rounded-full">
              <span className="relative inline-flex items-center gap-2 rounded-full bg-bg-card/90 px-4 py-1.5 text-xs font-medium text-text backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-brand-orange" />
                <span className="text-shimmer font-semibold">
                  Creatori de Emoții digitale
                </span>
                <span className="ml-1 inline-flex h-1.5 w-1.5 rounded-full bg-brand-orange shadow-[0_0_8px_2px_rgba(255,107,26,0.8)]" />
              </span>
            </div>
          </motion.div>

          {/* Titlu MEGA cu shimmer + reveal pe litere */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mt-7 font-display text-5xl font-extrabold leading-[0.98] tracking-tight text-text sm:text-6xl lg:text-[5.5rem]"
          >
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="block"
            >
              Soluții
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-shimmer block"
            >
              web personalizate
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="block text-text-muted"
            >
              pentru afacerea ta
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-7 max-w-xl text-base text-text-muted sm:text-lg"
          >
            Transformăm idei în experiențe digitale care impresionează. Site-uri,
            magazine online, branding și promovare — totul construit cu pasiune
            și tehnologie de top.
          </motion.p>

          {/* CTA-uri */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            {/* Buton primar cu border animat + glow + shimmer */}
            <a
              href="#brief"
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-orange-gradient px-8 py-4 text-base font-semibold text-white shadow-glow-orange transition-all hover:scale-[1.04] hover:shadow-[0_0_60px_rgba(255,107,26,0.7)]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <Zap className="h-5 w-5" />
              Începe proiectul tău
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <button
              type="button"
              className="group inline-flex items-center gap-3 rounded-full border border-bg-border bg-bg-card/40 px-5 py-3 text-sm font-medium text-text backdrop-blur transition hover:border-brand-orange hover:bg-bg-card/80"
            >
              <span className="relative grid h-9 w-9 place-items-center rounded-full bg-orange-gradient text-white">
                <span className="absolute inset-0 rounded-full pulse-ring" />
                <Play
                  className="relative h-3.5 w-3.5 fill-white"
                  strokeWidth={0}
                />
              </span>
              Vezi reel demo
            </button>
          </motion.div>

          {/* Trust signals — clienți, ani, proiecte cu icon glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-bg-border/50 pt-6 text-xs text-text-subtle"
          >
            <span className="flex items-center gap-2">
              <span className="grid h-2 w-2 place-items-center rounded-full bg-emerald-400 shadow-[0_0_10px_2px_rgba(16,185,129,0.7)]" />
              Răspundem în 24h
            </span>
            <span>•</span>
            <span>Oferte personalizate</span>
            <span>•</span>
            <span>Suport tehnic inclus</span>
            <span>•</span>
            <span>Garanție lansare</span>
          </motion.div>
        </div>

        {/* RIGHT — orb 3D + stats orbital */}
        <div className="relative mx-auto flex w-full max-w-md items-center justify-center lg:max-w-none">
          {/* Container cu parallax mouse */}
          <div
            ref={orbRef}
            style={{
              transform: `translateY(${scrollY * -0.1}px)`,
              transition: "transform 0.25s ease-out",
            }}
            className="relative aspect-square w-full max-w-[480px]"
          >
            {/* Glow base behind orb */}
            <div className="absolute inset-0 animate-pulse-slow rounded-full bg-gradient-radial from-brand-orange/40 via-brand-purple/30 to-transparent blur-3xl" />

            {/* Inele orbitale rotative (SVG) */}
            <svg
              viewBox="0 0 400 400"
              className="absolute inset-0 h-full w-full animate-spin-slow"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="200"
                cy="200"
                r="190"
                fill="none"
                stroke="rgba(255,107,26,0.25)"
                strokeWidth="1"
                strokeDasharray="2 6"
              />
              <circle
                cx="200"
                cy="200"
                r="160"
                fill="none"
                stroke="rgba(123,47,247,0.25)"
                strokeWidth="1"
                strokeDasharray="4 8"
              />
            </svg>
            <svg
              viewBox="0 0 400 400"
              className="absolute inset-0 h-full w-full"
              style={{ animation: "spin-slow 20s linear infinite reverse" }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="200"
                cy="200"
                r="130"
                fill="none"
                stroke="rgba(255,176,32,0.3)"
                strokeWidth="1"
              />
              {/* Punct orbital */}
              <circle cx="200" cy="70" r="4" fill="#FFB020" />
              <circle cx="330" cy="200" r="3" fill="#FF6B1A" />
              <circle cx="200" cy="330" r="3" fill="#A855F7" />
            </svg>

            {/* Orb central — sferă cu gradient mesh */}
            <div className="absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2">
              <div className="relative h-full w-full">
                {/* Glow halo */}
                <div className="absolute inset-0 animate-pulse-slow rounded-full bg-orange-gradient opacity-60 blur-2xl" />
                {/* Sphere */}
                <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-white/20 bg-gradient-to-br from-brand-orange via-brand-purple to-bg shadow-[inset_0_0_60px_rgba(0,0,0,0.6),0_0_80px_rgba(255,107,26,0.5)]">
                  {/* Highlight */}
                  <div className="absolute left-[15%] top-[10%] h-1/3 w-1/3 rounded-full bg-white/40 blur-2xl" />
                  {/* Texture lines */}
                  <svg
                    viewBox="0 0 200 200"
                    className="absolute inset-0 h-full w-full opacity-30"
                  >
                    {Array.from({ length: 8 }).map((_, i) => (
                      <ellipse
                        key={i}
                        cx="100"
                        cy="100"
                        rx={90 - i * 5}
                        ry={20 + i * 8}
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="0.5"
                      />
                    ))}
                  </svg>
                  {/* Centerpiece text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-3xl font-extrabold tracking-widest text-white drop-shadow-2xl">
                      IM
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Carduri stats orbitate (poziționate absolut pe inel) */}
            {[
              { n: 10, suffix: "", label: "Ani de experiență", pos: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" },
              { n: 200, suffix: "+", label: "Clienți mulțumiți", pos: "top-1/2 right-0 -translate-y-1/2 translate-x-4" },
              { n: 384, suffix: "+", label: "Proiecte", pos: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.15, type: "spring" }}
                className={`absolute ${s.pos} z-20`}
              >
                <div className="glass relative flex items-center gap-2 rounded-2xl px-3 py-2 shadow-card">
                  <span className="absolute inset-0 rounded-2xl pulse-ring" />
                  <span className="font-display text-2xl font-extrabold text-brand-orange">
                    <Counter to={s.n} suffix={s.suffix} />
                  </span>
                  <span className="text-[10px] uppercase leading-tight tracking-wider text-text-muted">
                    {s.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.5 }, y: { duration: 2, repeat: Infinity } }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-text-subtle"
      >
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <span className="h-8 w-px bg-gradient-to-b from-brand-orange to-transparent" />
      </motion.div>
    </section>
  );
}
