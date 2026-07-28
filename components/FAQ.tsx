"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const items = [
  {
    q: "Cât durează realizarea unui site?",
    a: "Pentru un site de prezentare standard durează între 2 și 4 săptămâni de la primirea conținutului. Magazinele online durează 4-8 săptămâni, în funcție de complexitate.",
  },
  {
    q: "Ce se întâmplă cu domeniul și hostingul după primul an?",
    a: "Primul an sunt incluse gratuit. După, costul de reînnoire e între 50€ și 80€/an, în funcție de extensia domeniului. Te anunțăm cu o lună înainte.",
  },
  {
    q: "Pot combina mai multe pachete?",
    a: "Da, absolut. De exemplu Website Prezentare + Promovare + Administrare lunară. Îți facem o ofertă combinată cu reducere.",
  },
  {
    q: "Cum se face plata?",
    a: "50% avans la începerea proiectului, 50% la livrare. Acceptăm transfer bancar și emitem factură.",
  },
  {
    q: "Pot face modificări după ce site-ul e gata?",
    a: "Da. Modificările minore în primele 30 de zile sunt gratuite. Pentru modificări majore sau ulterioare, recomandăm pachetul de Administrare lunară.",
  },
  {
    q: "Site-ul va fi optimizat pentru telefon mobil?",
    a: "Da, toate site-urile noastre sunt 100% responsive și optimizate pentru toate dispozitivele.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section relative">
      {/* FAQPage Schema — Google rich results + citare de către LLM-uri */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((it) => ({
              "@type": "Question",
              name: it.q,
              acceptedAnswer: { "@type": "Answer", text: it.a },
            })),
          }),
        }}
      />
      <div className="container-app max-w-3xl">
        <div className="text-center">
          <span className="chip">Întrebări frecvente</span>
          <h2 className="section-title mt-4 mx-auto">
            Răspundem la <span className="text-gradient">orice nelămurire</span>
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {items.map((it, idx) => {
            const isOpen = open === idx;
            return (
              <div
                key={it.q}
                className="overflow-hidden rounded-2xl border border-bg-border bg-bg-card"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/5"
                >
                  <span className="font-medium text-text">{it.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-brand-orange transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-text-muted">
                        {it.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
