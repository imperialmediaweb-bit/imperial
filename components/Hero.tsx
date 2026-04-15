"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-bg" />
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="container-app relative z-10 pt-16 pb-24 sm:pt-24 sm:pb-32 lg:pt-32 lg:pb-40">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <span className="chip border-brand-orange/40 bg-brand-orange/10 text-brand-orangeLight">
            <Sparkles className="h-3.5 w-3.5" />
            Pachete complete pentru afacerea ta
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 text-center font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-text sm:text-6xl lg:text-7xl"
        >
          Cere ofertă pentru
          <br />
          <span className="text-gradient">site-ul tău profesional</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mx-auto mt-6 max-w-2xl text-center text-base text-text-muted sm:text-lg"
        >
          Spune-ne ce vrei — culori, tip de site, funcționalități. Calculăm
          prețul și revenim cu oferta personalizată în maximum 24 de ore.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a href="#brief" className="btn-primary text-base">
            Completează briefingul
            <ArrowRight className="h-4 w-4" />
          </a>
          <a href="#pachete" className="btn-ghost text-base">
            Vezi pachetele
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-text-muted"
        >
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand-orange" />
            10 ani experiență
          </span>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand-orange" />
            200+ clienți mulțumiți
          </span>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand-orange" />
            384+ proiecte finalizate
          </span>
        </motion.div>
      </div>
    </section>
  );
}
