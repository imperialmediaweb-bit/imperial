"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, Zap } from "lucide-react";
import { ParticleField } from "./effects/ParticleField";
import { Meteors } from "./effects/Meteors";
import { Spotlight } from "./effects/Spotlight";
import { Aurora } from "./effects/Aurora";
import { InteractiveGrid } from "./effects/InteractiveGrid";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Straturi efecte */}
      <Aurora />
      <InteractiveGrid />
      <div className="absolute inset-0">
        <ParticleField density={75} color="rgba(255, 165, 80," />
      </div>
      <Meteors count={14} />
      <Spotlight color="rgba(255, 107, 26, 0.22)" size={600} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(14,6,23,0.85)_100%)]" />

      <div className="container-app relative z-10 grid min-h-[90vh] items-center gap-12 pt-10 pb-20 lg:grid-cols-[1fr,1fr] lg:gap-12 lg:pt-16">
        {/* LEFT — copy minimal */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex"
          >
            <div className="gradient-border rounded-full">
              <span className="relative inline-flex items-center gap-2 rounded-full bg-bg-card/90 px-4 py-1.5 text-xs font-medium backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-brand-orange" />
                <span className="text-shimmer font-semibold">
                  Creatori de Emoții digitale
                </span>
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-7 font-display text-5xl font-extrabold leading-[0.98] tracking-tight text-text sm:text-6xl lg:text-[5.2rem]"
          >
            Site-uri care{" "}
            <span className="text-shimmer">impresionează</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 max-w-md text-base text-text-muted sm:text-lg"
          >
            Design premium, dezvoltare rapidă, rezultate reale.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href="#brief"
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-orange-gradient px-7 py-3.5 text-base font-semibold text-white shadow-glow-orange transition-all hover:scale-[1.04] hover:shadow-[0_0_60px_rgba(255,107,26,0.7)]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <Zap className="h-4 w-4" />
              Începe proiectul
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <button
              type="button"
              className="group inline-flex items-center gap-3 rounded-full border border-bg-border bg-bg-card/40 px-4 py-3 text-sm font-medium text-text backdrop-blur transition hover:border-brand-orange hover:bg-bg-card/80"
            >
              <span className="relative grid h-8 w-8 place-items-center rounded-full bg-orange-gradient text-white">
                <span className="absolute inset-0 rounded-full pulse-ring" />
                <Play
                  className="relative h-3 w-3 fill-white"
                  strokeWidth={0}
                />
              </span>
              Vezi reel
            </button>
          </motion.div>
        </div>

        {/* RIGHT — visual cu mockup-uri */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center lg:justify-end"
        >
          <HeroVisual />
        </motion.div>
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
