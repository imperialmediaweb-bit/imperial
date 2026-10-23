"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

// Vitrina din hero: ramă de browser din sticlă cu slider automat prin
// screenshot-urile REALE ale site-urilor livrate. Munca vinde, nu vorbele.
const SLIDES = [
  {
    src: "/proiecte/clinica-sf-gheorghe/home.jpg",
    title: "Clinica Sfântul Gheorghe",
    tag: "Spital privat · programări online · AI",
    url: "clinicasfantulgheorghe.ro",
  },
  {
    src: "/proiecte/sarami/home.jpg",
    title: "Sarami Media",
    tag: "Agenție video · migrare de pe WordPress",
    url: "sarami.ro",
  },
  {
    src: "/proiecte/clinica-sf-gheorghe/programare.jpg",
    title: "Programări online",
    tag: "Modul construit de la zero",
    url: "clinicasfantulgheorghe.ro",
  },
  {
    src: "/proiecte/sarami/landing.jpg",
    title: "Landing de campanie",
    tag: "Facebook Ads · conversii măsurate",
    url: "sarami.ro",
  },
];

const INTERVAL = 4200;

export function ProjectShowcase() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(id);
  }, []);

  const s = SLIDES[i];

  return (
    <div className="relative mx-auto w-full max-w-xl">
      {/* glow-ul din spatele ramei */}
      <div className="absolute -inset-5 rounded-[1.8rem] bg-imperial-gradient opacity-25 blur-2xl" />

      {/* rama de browser din sticlă */}
      <div className="glass relative overflow-hidden rounded-2xl shadow-card">
        {/* bara de sus */}
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <AnimatePresence mode="wait">
            <motion.span
              key={s.url + i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="mx-auto flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-0.5 text-[11px] text-text-muted"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              {s.url}
            </motion.span>
          </AnimatePresence>
          <span className="w-12" />
        </div>

        {/* ecranul — tranziție tip cinema cu clip-path */}
        <div className="relative aspect-[16/11] overflow-hidden bg-bg-soft">
          <AnimatePresence initial={false}>
            <motion.div
              key={i}
              initial={{ clipPath: "inset(0 0 0 100%)", scale: 1.06 }}
              animate={{ clipPath: "inset(0 0 0 0%)", scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={s.src}
                alt={s.title}
                fill
                sizes="(max-width: 1024px) 90vw, 560px"
                className="object-cover object-top"
                priority={i === 0}
              />
              {/* umbră jos pentru etichetă */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* eticheta proiectului */}
          <AnimatePresence mode="wait">
            <motion.div
              key={"label" + i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, delay: 0.25 }}
              className="absolute bottom-3.5 left-4 right-4 z-10 flex items-end justify-between gap-3"
            >
              <div>
                <p className="font-display text-base font-extrabold text-white sm:text-lg">{s.title}</p>
                <p className="text-[11px] text-white/60 sm:text-xs">{s.tag}</p>
              </div>
              <Link
                href="/proiecte"
                className="shrink-0 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur transition hover:border-brand-orange hover:bg-black/60"
              >
                Vezi tot →
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* bulele de progres */}
        <div className="flex items-center justify-center gap-2 border-t border-white/10 px-4 py-3">
          {SLIDES.map((_, k) => (
            <button
              key={k}
              type="button"
              aria-label={`Slide ${k + 1}`}
              onClick={() => setI(k)}
              className="group relative h-1 w-10 overflow-hidden rounded-full bg-white/10"
            >
              {k === i && (
                <motion.span
                  key={"bar" + i}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: INTERVAL / 1000, ease: "linear" }}
                  className="absolute inset-0 origin-left bg-imperial-gradient"
                />
              )}
              {k < i && <span className="absolute inset-0 bg-white/25" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
