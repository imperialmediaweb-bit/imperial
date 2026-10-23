"use client";

import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Code2, Globe, Play, Settings2, Zap } from "lucide-react";
import { ParticleField } from "./effects/ParticleField";
import { Spotlight } from "./effects/Spotlight";
import { Magnetic } from "./effects/MagneticButton";
import { NumberTicker } from "./effects/NumberTicker";

// Hero construit 1:1 după bannerul de brand: negru pur, fascicule de lumină
// portocaliu→magenta→violet, titlu chrome metalic, rândul de servicii cu iconițe.
const services = [
  { icon: Globe, l1: "Web", l2: "Development" },
  { icon: BrainCircuit, l1: "AI", l2: "Soluții" },
  { icon: Code2, l1: "Software", l2: "Personalizat" },
  { icon: Settings2, l1: "Automatizări", l2: "Business" },
];

export function Hero() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-[#050507] sm:min-h-[96vh]">
      {/* === FUNDAL: negru pur + luminile din banner === */}
      {/* glow portocaliu — colțul stânga-jos, ca în banner */}
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[560px] w-[560px] rounded-full bg-brand-orange/[0.16] blur-[130px]" />
      {/* glow violet — dreapta, ca în banner */}
      <div className="pointer-events-none absolute -right-40 top-1/4 h-[560px] w-[560px] rounded-full bg-brand-purple/[0.16] blur-[130px]" />
      {/* magenta discret în centru-sus */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[640px] -translate-x-1/2 rounded-full bg-brand-magenta/[0.07] blur-[120px]" />

      {/* fascicule — liniile de lumină diagonale din banner */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="absolute -left-24 bottom-[18%] h-px w-[46%] rotate-[24deg] bg-gradient-to-r from-transparent via-brand-orange/70 to-transparent shadow-[0_0_14px_rgba(255,107,26,0.8)]" />
        <span className="absolute -left-10 bottom-[10%] h-px w-[36%] rotate-[24deg] bg-gradient-to-r from-transparent via-brand-orangeLight/50 to-transparent" />
        <span className="absolute -right-24 top-[22%] h-px w-[46%] rotate-[-24deg] bg-gradient-to-r from-transparent via-brand-purple/70 to-transparent shadow-[0_0_14px_rgba(139,47,247,0.8)]" />
        <span className="absolute -right-10 top-[32%] h-px w-[34%] rotate-[-24deg] bg-gradient-to-r from-transparent via-brand-magenta/50 to-transparent" />
      </div>

      {/* scântei fine, ca pulberea de lumină din banner */}
      <div className="absolute inset-0 opacity-70">
        <ParticleField density={70} color="rgba(255, 165, 80," />
      </div>
      <Spotlight color="rgba(255, 107, 26, 0.16)" size={700} />

      {/* vignetă spre negru pur */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(5,5,7,0.95)_100%)]" />

      {/* === CONȚINUT === */}
      <div className="container-app relative z-10 py-24 text-center">
        {/* Titlu — exact ca în banner: chrome + gradient */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mx-auto mt-2 max-w-6xl font-display text-[2.5rem] font-black uppercase leading-[1.04] tracking-tight text-text sm:text-6xl md:text-7xl lg:text-[5.25rem] xl:text-[6.25rem]"
        >
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-chrome block"
          >
            Tu ai ideea.
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-gradient block drop-shadow-[0_0_30px_rgba(255,46,154,0.35)]"
          >
            Noi o aducem la&nbsp;viață.
          </motion.span>
        </motion.h1>

        {/* linia de lumină de sub titlu, ca în banner */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-8 h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />

        {/* Rândul de servicii cu iconițe — ca în banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-y-4 divide-x divide-white/10"
        >
          {services.map((s) => (
            <div key={s.l2} className="flex items-center gap-2.5 px-4 sm:px-6">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.03]">
                <s.icon className="h-4 w-4 text-brand-orange" strokeWidth={1.8} />
              </span>
              <span className="text-left text-[13px] font-medium leading-tight text-text sm:text-sm">
                {s.l1}
                <br />
                {s.l2}
              </span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:mt-10 sm:gap-3"
        >
          <Magnetic strength={0.45}>
            <a
              href="/brief"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-orange-gradient px-5 py-3 text-sm font-semibold text-white shadow-glow-orange transition-all hover:scale-[1.04] hover:shadow-[0_0_60px_rgba(255,46,154,0.6)] sm:gap-2.5 sm:px-8 sm:py-4 sm:text-base"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <Zap className="h-5 w-5" />
              Primește estimare
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Magnetic>
          <a
            href="/proiecte"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-medium text-text backdrop-blur transition hover:border-brand-magenta/60 hover:bg-white/[0.07] sm:gap-3 sm:px-5 sm:py-3 sm:text-sm"
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-full bg-orange-gradient text-white">
              <span className="absolute inset-0 rounded-full pulse-ring" />
              <Play className="relative h-3.5 w-3.5 fill-white" strokeWidth={0} />
            </span>
            Vezi proiecte
          </a>
        </motion.div>

        {/* Stats animate */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.15 }}
          className="mt-10 flex flex-wrap items-start justify-center gap-x-8 gap-y-4 sm:mt-16 sm:gap-x-14"
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
        <span className="h-8 w-px bg-gradient-to-b from-brand-magenta to-transparent" />
      </motion.div>
    </section>
  );
}
