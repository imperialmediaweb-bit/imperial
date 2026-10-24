"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Zap } from "lucide-react";
import { RibbonField } from "./effects/RibbonField";
import { ParticleField } from "./effects/ParticleField";
import { NumberTicker } from "./effects/NumberTicker";
import { Magnetic } from "./effects/MagneticButton";

// Hero = experiență. 3 „camere”: CLIPUL de brand, cristalul 3D, cifrele.
// Tranziția dintre slide-uri e o trecere printr-o ușă: camera curentă vine
// spre tine și se dizolvă, următoarea se deschide din adâncime.

const Crystal3D = dynamic(() => import("./effects/Crystal3D"), { ssr: false });

const AUTOPLAY = 8000;

// Titlu care se asamblează literă cu literă (cascadă fină, cu rotație mică).
function Letters({ text, className, delay }: { text: string; className: string; delay: number }) {
  // Gradientul stă pe wrapper (background-clip: text acoperă și copiii), ca să
  // curgă pe toată fraza, nu pe fiecare literă; literele animă doar transform.
  return (
    <span className={`inline-block ${className}`} style={{ perspective: 400 }}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 22, rotateX: 60 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.5, delay: delay + i * 0.028, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ───── Slide 1: CLIPUL ───── */
function VideoSlide({ isDesktop }: { isDesktop: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#050507]">
      {/* clipul generat — doar desktop; pe mobil posterul static */}
      {isDesktop ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          poster="/video/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/video/hero-loop.webm" type="video/webm" />
          <source src="/video/hero-loop.mp4" type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/video/hero-poster.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,5,7,0.8)_100%)]" />

      <div className="container-app relative z-10 flex h-full flex-col items-center justify-center text-center">
        {/* sigla nouă: se DESENEAZĂ singură pe contur, apoi se aprinde */}
        <motion.svg
          viewBox="0 0 100 100"
          className="h-24 w-24 drop-shadow-[0_0_30px_rgba(255,46,154,0.5)] sm:h-28 sm:w-28"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <defs>
            <linearGradient id="hRing" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF6B1A" />
              <stop offset="55%" stopColor="#FF2E9A" />
              <stop offset="100%" stopColor="#8B2FF7" />
            </linearGradient>
          </defs>
          <motion.circle
            cx="50" cy="50" r="46" fill="rgba(7,6,10,0.75)"
            stroke="url(#hRing)" strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, delay: 0.2, ease: "easeInOut" }}
          />
          {["M22 66 L30 34 L40 50 L36 66 Z", "M50 26 L58 46 L50 66 L42 46 Z", "M78 66 L70 34 L60 50 L64 66 Z"].map((d, k) => (
            <motion.path
              key={d}
              d={d}
              stroke="url(#hRing)"
              strokeWidth="1.6"
              fill="url(#hRing)"
              initial={{ pathLength: 0, fillOpacity: 0 }}
              animate={{ pathLength: 1, fillOpacity: 1 }}
              transition={{
                pathLength: { duration: 0.7, delay: 0.5 + k * 0.18, ease: "easeInOut" },
                fillOpacity: { duration: 0.5, delay: 1.1 + k * 0.18 },
              }}
            />
          ))}
          <motion.path
            d="M50 16 L52.2 21.5 L50 24 L47.8 21.5 Z" fill="#FFB020"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 1], scale: [0, 1.6, 1] }}
            transition={{ duration: 0.6, delay: 1.7 }}
          />
        </motion.svg>

        {/* titlul: se asamblează literă cu literă */}
        <h1 className="mt-7 font-display text-3xl font-black uppercase leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          <Letters text="Tu ai ideea." className="text-chrome" delay={0.9} />{" "}
          <span className="whitespace-nowrap drop-shadow-[0_0_28px_rgba(255,46,154,0.4)]">
            <Letters text="Noi o aducem la viață." className="text-gradient" delay={1.45} />
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="mt-9"
        >
          <Magnetic strength={0.45}>
            <Link
              href="/brief"
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-orange-gradient px-8 py-4 text-base font-semibold text-white shadow-glow-orange transition-all hover:scale-[1.04] hover:shadow-[0_0_60px_rgba(255,46,154,0.55)]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <Zap className="h-5 w-5" />
              Primește estimare gratuită
            </Link>
          </Magnetic>
        </motion.div>
      </div>
    </div>
  );
}

/* ───── Slide 2: cristalul 3D ───── */
function CrystalSlide({ isDesktop }: { isDesktop: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#050507]">
      <RibbonField />
      <div className="absolute inset-0 opacity-60">
        <ParticleField density={45} color="rgba(255, 165, 80," />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(5,5,7,0.85)_100%)]" />

      <div className="container-app relative z-10 grid h-full items-center gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="text-[11px] font-semibold uppercase tracking-[0.32em] text-text-subtle"
          >
            Web · AI · Software · Automatizări
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-display text-4xl font-black uppercase leading-[1.05] sm:text-5xl lg:text-6xl"
          >
            <span className="text-chrome">Construit de la zero.</span>
            <br />
            <span className="text-gradient">Fără șabloane.</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <Link
              href="/site-start"
              className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-glow-orange transition hover:scale-[1.04]"
            >
              Site Start — 1.500 lei
            </Link>
            <Link
              href="/servicii"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-text backdrop-blur transition hover:border-brand-orange/70 hover:bg-white/[0.08]"
            >
              Toate serviciile
            </Link>
          </motion.div>
        </div>
        <div className="relative hidden h-[460px] lg:block">{isDesktop && <Crystal3D />}</div>
      </div>
    </div>
  );
}

/* ───── Slide 3: cifrele ───── */
function StatsSlide() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#050507]">
      <div className="absolute inset-0 opacity-80">
        <ParticleField density={110} color="rgba(255, 46, 154," />
      </div>
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-[420px] w-[420px] rounded-full bg-brand-orange/[0.14] blur-[120px]" />
      <div className="pointer-events-none absolute -top-24 right-1/4 h-[380px] w-[380px] rounded-full bg-brand-purple/[0.14] blur-[120px]" />

      <div className="container-app relative z-10 flex h-full flex-col items-center justify-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl font-display text-4xl font-black uppercase leading-[1.05] sm:text-5xl lg:text-6xl"
        >
          <span className="text-chrome">Cifrele</span> <span className="text-gradient">vorbesc.</span>
        </motion.h2>
        <div className="mt-12 grid grid-cols-2 gap-x-14 gap-y-10 sm:grid-cols-4">
          {[
            { value: 384, suffix: "+", label: "proiecte livrate" },
            { value: 200, suffix: "+", label: "clienți" },
            { value: 50, suffix: "", label: "ziare în rețea" },
            { value: 10, suffix: "", label: "ani de meserie" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 + i * 0.1 }}
              className="text-center"
            >
              <NumberTicker
                value={s.value}
                suffix={s.suffix}
                className="font-display text-5xl font-black text-text sm:text-6xl"
              />
              <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-text-subtle">{s.label}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-12"
        >
          <Link
            href="/brief"
            className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-7 py-3.5 text-[15px] font-semibold text-white shadow-glow-orange transition hover:scale-[1.04]"
          >
            <Zap className="h-5 w-5" /> Hai să construim al tău
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export function HeroSlider() {
  const [i, setI] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const paused = useRef(false);

  useEffect(() => {
    setIsDesktop(window.matchMedia("(min-width: 1024px)").matches);
  }, []);

  const slides = [
    { key: "clip", el: <VideoSlide isDesktop={isDesktop} /> },
    { key: "crystal", el: <CrystalSlide isDesktop={isDesktop} /> },
    { key: "stats", el: <StatsSlide /> },
  ];

  const go = useCallback(
    (n: number) => setI((v) => (v + n + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    timer.current = setInterval(() => {
      if (!paused.current) go(1);
    }, AUTOPLAY);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [go]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <section
      className="relative h-[calc(100svh-6rem)] min-h-[560px] overflow-hidden bg-[#050507] sm:h-[calc(100svh-7rem)] md:h-[calc(100svh-8rem)]"
      style={{ perspective: 1400 }}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      {/* trecerea „dintr-o cameră în alta”: slide-ul curent vine spre tine și
          se dizolvă; următorul se deschide din adâncime */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slides[i].key}
          initial={{ opacity: 0, scale: 0.82, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.45, filter: "blur(14px)", transition: { duration: 0.7, ease: [0.4, 0, 1, 1] } }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
          style={{ transformOrigin: "50% 50%" }}
        >
          {slides[i].el}
        </motion.div>
      </AnimatePresence>

      {/* controale */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4">
        <button
          type="button"
          aria-label="Slide anterior"
          onClick={() => go(-1)}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur transition hover:border-brand-orange hover:bg-black/70"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          {slides.map((s, k) => (
            <button
              key={s.key}
              type="button"
              aria-label={`Slide ${k + 1}`}
              onClick={() => setI(k)}
              className="group relative h-1.5 w-9 overflow-hidden rounded-full bg-white/15"
            >
              {k === i && (
                <motion.span
                  key={"p" + i}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: AUTOPLAY / 1000, ease: "linear" }}
                  className="absolute inset-0 origin-left bg-imperial-gradient"
                />
              )}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Slide următor"
          onClick={() => go(1)}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur transition hover:border-brand-orange hover:bg-black/70"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent" />
    </section>
  );
}
