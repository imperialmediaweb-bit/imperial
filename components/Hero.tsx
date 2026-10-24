"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { RibbonField } from "./effects/RibbonField";
import { ParticleField } from "./effects/ParticleField";
import { Spotlight } from "./effects/Spotlight";
import { Magnetic } from "./effects/MagneticButton";
import { NumberTicker } from "./effects/NumberTicker";
import { ProjectShowcase } from "./ProjectShowcase";

// Hero asimetric, tip mare agenție: stânga — titlu chrome cu UN accent în
// gradient; dreapta — munca reală într-un slider cu ramă de sticlă. Fundalul e
// „video-ul”: panglici de lumină în culorile brandului, generate live pe canvas.

const line: Variants = {
  hidden: {},
  show: (d: number) => ({ transition: { staggerChildren: 0.08, delayChildren: d } }),
};
const word: Variants = {
  hidden: { opacity: 0, y: 34, rotateX: 45 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function Line({ words, delay, className }: { words: string[]; delay: number; className?: string }) {
  return (
    <motion.span
      variants={line}
      custom={delay}
      initial="hidden"
      animate="show"
      className="block"
      style={{ perspective: 600 }}
    >
      {words.map((w, i) => (
        <motion.span key={i} variants={word} className={`mr-[0.22em] inline-block ${className ?? ""}`}>
          {w}
        </motion.span>
      ))}
    </motion.span>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#050507]">
      {/* fundal static de adâncime (și fallback-ul de mobil) */}
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-[480px] w-[480px] rounded-full bg-brand-orange/[0.13] blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 top-10 h-[480px] w-[480px] rounded-full bg-brand-purple/[0.13] blur-[120px]" />

      {/* „video-ul”: panglicile de lumină (doar desktop) */}
      <RibbonField />
      <div className="absolute inset-0 opacity-60">
        <ParticleField density={55} color="rgba(255, 165, 80," />
      </div>
      <Spotlight color="rgba(255, 107, 26, 0.13)" size={650} />

      {/* vigneta spre negru */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,5,7,0.85)_100%)]" />

      <div className="container-app relative z-10 grid min-h-[85vh] items-center gap-12 py-20 sm:min-h-[92vh] lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        {/* ───── STÂNGA: mesajul ───── */}
        <div className="text-center lg:text-left">
          {/* kicker */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-semibold uppercase tracking-[0.3em] text-text-subtle"
          >
            Web · AI · Software · Automatizări
          </motion.p>

          {/* titlul — chrome, cu UN cuvânt în gradient */}
          <h1 className="mt-5 font-display text-[2.4rem] font-black uppercase leading-[1.04] tracking-tight sm:text-5xl lg:text-[3.6rem] xl:text-[4.3rem]">
            <Line words={["Tu", "ai", "ideea."]} delay={0.15} className="text-chrome" />
            <Line words={["Noi", "o", "aducem"]} delay={0.45} className="text-chrome" />
            <motion.span
              variants={line}
              custom={0.75}
              initial="hidden"
              animate="show"
              className="block"
              style={{ perspective: 600 }}
            >
              <motion.span variants={word} className="text-chrome mr-[0.22em] inline-block">
                la
              </motion.span>
              <motion.span
                variants={word}
                className="text-gradient inline-block drop-shadow-[0_0_26px_rgba(255,107,26,0.3)]"
              >
                viață.
              </motion.span>
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.05 }}
            className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-text-muted lg:mx-0"
          >
            Construim de la zero site-uri, aplicații și automatizări cu AI pentru
            firme din toată România — și le promovăm în propria rețea de 50 de
            ziare online.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <Magnetic strength={0.45}>
              <a
                href="/brief"
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-orange-gradient px-7 py-3.5 text-[15px] font-semibold text-white shadow-glow-orange transition-all hover:scale-[1.04] hover:shadow-[0_0_55px_rgba(255,46,154,0.5)]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <Zap className="h-5 w-5" />
                Primește estimare
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Magnetic>
            <a
              href="/site-start"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-text backdrop-blur transition hover:border-brand-orange/70 hover:bg-white/[0.08]"
            >
              Site Start — 1.500 lei
            </a>
          </motion.div>

          {/* statistici reale */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.45 }}
            className="mt-10 flex items-start justify-center gap-8 sm:gap-12 lg:justify-start"
          >
            {[
              { value: 10, suffix: "", label: "ani experiență" },
              { value: 200, suffix: "+", label: "clienți" },
              { value: 384, suffix: "+", label: "proiecte livrate" },
            ].map((s) => (
              <div key={s.label} className="text-center lg:text-left">
                <NumberTicker
                  value={s.value}
                  suffix={s.suffix}
                  className="font-display text-2xl font-extrabold text-text sm:text-[1.7rem]"
                />
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-text-subtle">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ───── DREAPTA: munca reală ───── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden lg:block"
        >
          <ProjectShowcase />
        </motion.div>

        {/* pe mobil, vitrina vine sub text, mai compactă */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="lg:hidden"
        >
          <ProjectShowcase />
        </motion.div>
      </div>

      {/* linia de lumină de la baza hero-ului */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-orange/50 via-50% to-transparent" />
    </section>
  );
}
