"use client";

import { motion } from "framer-motion";
import { MessageCircle, Pencil, Code2, Rocket } from "lucide-react";
import { IconBadge } from "./IconBadge";

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

function StepCard({ step, idx }: { step: (typeof steps)[number]; idx: number }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-bg-border glass-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-magenta/50 lg:p-8">
      {/* numărul uriaș din fundal */}
      <span className="absolute -right-4 -top-6 font-display text-8xl font-black text-white/[0.04] lg:text-9xl">
        0{idx + 1}
      </span>

      <div className="relative">
        <div className="flex items-center gap-4">
          <IconBadge icon={step.icon} className="transition-transform duration-300 group-hover:scale-110" />
          <h3 className="font-display text-lg font-bold text-text lg:text-xl">
            {step.title}
          </h3>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-text-muted lg:text-[15px]">
          {step.text}
        </p>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const heading = (
    <div className="text-center lg:text-left">
      <span className="chip">Cum procedăm?</span>
      <h2 className="section-title mt-4 mx-auto lg:mx-0">
        Pașii noștri de <span className="text-gradient">lucru</span>
      </h2>
      <p className="section-subtitle mx-auto lg:mx-0">
        De la consultanța inițială la lansare și mentenanță — procesul care
        aduce proiectul tău la viață.
      </p>
    </div>
  );

  return (
    <>
      {/* ───── Mobil + tabletă: listă clasică, fără pinning ───── */}
      <section id="cum-functioneaza" className="section relative">
        <div className="container-app">
          {heading}
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <StepCard step={step} idx={idx} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
