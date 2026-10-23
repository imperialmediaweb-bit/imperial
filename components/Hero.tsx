"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, Zap } from "lucide-react";
import { ParticleField } from "./effects/ParticleField";
import { Meteors } from "./effects/Meteors";
import { Spotlight } from "./effects/Spotlight";
import { Aurora } from "./effects/Aurora";
import { InteractiveGrid } from "./effects/InteractiveGrid";
import { Magnetic } from "./effects/MagneticButton";
import { NumberTicker } from "./effects/NumberTicker";

// Hero centrat, minimalist, premium — fără mockup-uri placeholder.
// Text masiv + toate efectele în background fac toată treaba.
export function Hero() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden sm:min-h-[96vh]">
      {/* === STRATURI EFECTE === */}
      <Aurora />
      <InteractiveGrid />
      <div className="absolute inset-0">
        <ParticleField density={110} color="rgba(255, 165, 80," />
      </div>
      <Meteors count={20} />
      <Spotlight color="rgba(255, 107, 26, 0.28)" size={700} />

      {/* Vignette + radial */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(14,6,23,0.9)_100%)]" />

      {/* Gradient text de fundal MASIV — efect depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span className="select-none whitespace-nowrap font-display text-[22vw] font-extrabold leading-none tracking-tighter text-white/[0.025] sm:text-[18vw]">
          IMPERIAL
        </span>
      </div>

      {/* === CONȚINUT === */}
      <div className="container-app relative z-10 py-24 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="gradient-border rounded-full">
            <span className="relative inline-flex items-center gap-2 rounded-full bg-bg-card/90 px-4 py-1.5 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-brand-orange" />
              <span className="text-shimmer font-semibold">
                Creatori de Emoții digitale
              </span>
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-brand-orange shadow-[0_0_8px_2px_rgba(255,107,26,0.8)]" />
            </span>
          </div>
        </motion.div>

        {/* Titlu MASIV — două linii cu staggered reveal */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mx-auto mt-6 max-w-5xl font-display text-4xl font-extrabold leading-[0.95] tracking-tight text-text sm:mt-8 sm:text-6xl md:text-7xl lg:text-[7rem] xl:text-[8.5rem]"
        >
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="block"
          >
            Site-uri care
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-shimmer block"
          >
            impresionează
          </motion.span>
        </motion.h1>

        {/* Subtitlu scurt */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mx-auto mt-4 max-w-xl text-sm text-text-muted sm:mt-7 sm:text-base md:text-lg"
        >
          Design premium · Dezvoltare rapidă · Rezultate reale
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:mt-10 sm:gap-3"
        >
          <Magnetic strength={0.45}>
            <a
              href="/brief"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-orange-gradient px-5 py-3 text-sm font-semibold text-white shadow-glow-orange transition-all hover:scale-[1.04] hover:shadow-[0_0_60px_rgba(255,107,26,0.7)] sm:gap-2.5 sm:px-8 sm:py-4 sm:text-base"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <Zap className="h-5 w-5" />
              Primește estimare
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Magnetic>
          <a
            href="/proiecte"
            className="group inline-flex items-center gap-2 rounded-full border border-bg-border bg-bg-card/40 px-4 py-2.5 text-xs font-medium text-text backdrop-blur transition hover:border-brand-orange hover:bg-bg-card/80 sm:gap-3 sm:px-5 sm:py-3 sm:text-sm"
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-full bg-orange-gradient text-white">
              <span className="absolute inset-0 rounded-full pulse-ring" />
              <Play className="relative h-3.5 w-3.5 fill-white" strokeWidth={0} />
            </span>
            Vezi proiecte
          </a>
        </motion.div>

        {/* Stats animate — numere care urcă la 0 → valoare */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-10 flex flex-wrap items-start justify-center gap-x-8 gap-y-4 sm:mt-20 sm:gap-x-14"
        >
          {[
            { value: 10, suffix: "", label: "ani experiență" },
            { value: 200, suffix: "+", label: "clienți fericiți" },
            { value: 384, suffix: "+", label: "proiecte livrate" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <NumberTicker
                value={s.value}
                suffix={s.suffix}
                className="font-display text-2xl font-extrabold text-text sm:text-3xl"
              />
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-text-subtle sm:text-[11px]">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 1.5 },
          y: { duration: 2, repeat: Infinity },
        }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-text-subtle"
      >
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <span className="h-8 w-px bg-gradient-to-b from-brand-orange to-transparent" />
      </motion.div>
    </section>
  );
}
