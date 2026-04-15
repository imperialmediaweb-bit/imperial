"use client";

import { motion } from "framer-motion";
import {
  MessageCircle,
  Pencil,
  Code2,
  Rocket,
} from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    title: "Consultanță inițială",
    text: "Identificăm nevoile afacerii tale și propunem soluția digitală potrivită.",
  },
  {
    icon: Pencil,
    title: "Modele și design",
    text: "Îți prezentăm modele și creăm împreună design-ul ideal, personalizat pentru brand-ul tău.",
  },
  {
    icon: Code2,
    title: "Dezvoltare",
    text: "Implementăm proiectul și efectuăm teste pentru a garanta performanța optimă.",
  },
  {
    icon: Rocket,
    title: "Lansare și suport",
    text: "Lansăm site-ul și oferim mentenanță pentru funcționarea fără probleme.",
  },
];

export function HowItWorks() {
  return (
    <section id="cum-functioneaza" className="section relative">
      <div className="container-app">
        <div className="text-center">
          <span className="chip">Cum procedăm?</span>
          <h2 className="section-title mt-4 mx-auto">
            Pașii noștri de <span className="text-gradient">lucru</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Descoperă procesul nostru pas cu pas pentru a aduce proiectul tău
            la viață, de la consultanța inițială la lansare și mentenanță.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-bg-border bg-bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/50"
            >
              {/* number bg */}
              <span className="absolute -right-4 -top-4 font-display text-7xl font-extrabold text-white/[0.04]">
                0{idx + 1}
              </span>

              <div className="relative">
                <div className="grid h-14 w-14 place-items-center rounded-2xl border border-bg-border bg-bg-soft shadow-card transition-all group-hover:border-brand-orange/50 group-hover:bg-orange-gradient">
                  <step.icon
                    className="h-6 w-6 text-brand-orange transition group-hover:text-white"
                    strokeWidth={2}
                  />
                </div>

                <h3 className="mt-5 font-display text-lg font-bold text-text">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {step.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
