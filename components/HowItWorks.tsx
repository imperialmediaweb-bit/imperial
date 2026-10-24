"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MessageCircle, Pencil, Code2, Rocket } from "lucide-react";

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
    <div className="group relative overflow-hidden rounded-2xl border border-bg-border glass-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-magenta/50 lg:w-[380px] lg:shrink-0 lg:p-8">
      {/* numărul uriaș din fundal */}
      <span className="absolute -right-4 -top-6 font-display text-8xl font-black text-white/[0.04] lg:text-9xl">
        0{idx + 1}
      </span>

      <div className="relative">
        <div className="grid h-14 w-14 place-items-center rounded-2xl border border-bg-border bg-bg-soft shadow-card transition-all group-hover:border-transparent group-hover:bg-orange-gradient">
          <step.icon
            className="h-6 w-6 text-brand-orange transition group-hover:text-white"
            strokeWidth={2}
          />
        </div>

        <h3 className="mt-5 font-display text-lg font-bold text-text lg:text-xl">
          {step.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-text-muted lg:text-[15px]">
          {step.text}
        </p>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef });
  // Pașii se derulează orizontal cât timp secțiunea e „pinned”.
  const x = useTransform(scrollYProgress, [0.05, 0.95], ["4%", "-58%"]);
  const beam = useTransform(scrollYProgress, [0.05, 0.95], ["0%", "100%"]);

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
      <section id="cum-functioneaza" className="section relative lg:hidden">
        <div className="container-app">
          {heading}
          <div className="mt-14 grid gap-5 sm:grid-cols-2">
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

      {/* ───── Desktop: secțiune pinned cu derulare orizontală ───── */}
      <section ref={trackRef} className="relative hidden h-[280vh] lg:block">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="container-app">{heading}</div>

          {/* firul de progres al procesului */}
          <div className="container-app mt-10">
            <div className="relative h-px w-full bg-white/[0.07]">
              <motion.div
                className="absolute left-0 top-0 h-full bg-imperial-gradient shadow-[0_0_12px_rgba(255,46,154,0.7)]"
                style={{ width: beam }}
              />
            </div>
          </div>

          <motion.div style={{ x }} className="mt-10 flex gap-8 pl-[max(2rem,calc((100vw-80rem)/2+3rem))]">
            {steps.map((step, idx) => (
              <StepCard key={step.title} step={step} idx={idx} />
            ))}
            {/* cartea finală — CTA */}
            <div className="relative flex w-[380px] shrink-0 flex-col items-start justify-center overflow-hidden rounded-2xl border border-brand-magenta/30 glass-card p-8">
              <div className="pointer-events-none absolute inset-0 bg-hero-gradient opacity-60" />
              <h3 className="relative font-display text-2xl font-black uppercase text-text">
                Gata de <span className="text-gradient">start?</span>
              </h3>
              <p className="relative mt-2 text-sm text-text-muted">
                Primești estimarea gratuită în 2 minute.
              </p>
              <a href="/brief" className="btn-primary relative mt-5 text-sm">
                Primește estimare
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
