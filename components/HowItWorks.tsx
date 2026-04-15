"use client";

import { motion } from "framer-motion";
import { FileText, Calculator, Rocket } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Completezi briefingul",
    text: "Ne spui ce vrei: tip site, culori preferate, funcționalități, pagini. Dura ~2 minute.",
  },
  {
    icon: Calculator,
    title: "Calculăm prețul",
    text: "Analizăm cererea ta și pregătim oferta personalizată potrivită bugetului tău.",
  },
  {
    icon: Rocket,
    title: "Primești oferta în 24h",
    text: "Te contactăm pe email și telefon cu propunerea completă: preț, termen, ce include.",
  },
];

export function HowItWorks() {
  return (
    <section id="cum-functioneaza" className="section relative">
      <div className="container-app">
        <div className="text-center">
          <span className="chip">Procesul nostru</span>
          <h2 className="section-title mt-4 mx-auto">
            Cum <span className="text-gradient">funcționează</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Trei pași simpli — de la primul click până la oferta pe email.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="card relative"
            >
              <span className="absolute -top-4 -left-2 grid h-10 w-10 place-items-center rounded-full bg-orange-gradient text-sm font-bold text-white shadow-glow-orange">
                {idx + 1}
              </span>
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl border border-bg-border bg-bg-soft text-brand-orange">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-text">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {step.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
