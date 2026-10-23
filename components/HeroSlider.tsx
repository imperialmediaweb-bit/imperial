"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Zap } from "lucide-react";
import { RibbonField } from "./effects/RibbonField";
import { ParticleField } from "./effects/ParticleField";
import { NumberTicker } from "./effects/NumberTicker";
import { Magnetic } from "./effects/MagneticButton";

// Hero = experiență: slider full-screen cu 3D, video-motion și proiecte reale.
// Text puțin; imaginea și mișcarea vorbesc.

const Crystal3D = dynamic(() => import("./effects/Crystal3D"), { ssr: false });

const AUTOPLAY = 7000;

type SlideDef = {
  key: string;
  render: (active: boolean, isDesktop: boolean) => React.ReactNode;
};

function BrandSlide({ isDesktop }: { isDesktop: boolean }) {
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
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-[11px] font-semibold uppercase tracking-[0.32em] text-text-subtle"
          >
            Web · AI · Software · Automatizări
          </motion.p>
          <h1 className="mt-4 font-display text-4xl font-black uppercase leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
            <motion.span
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="text-chrome block"
            >
              Tu ai ideea.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
              className="text-chrome block"
            >
              Noi o aducem{" "}
              <span className="text-gradient whitespace-nowrap drop-shadow-[0_0_26px_rgba(255,107,26,0.35)]">la viață.</span>
            </motion.span>
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <Magnetic strength={0.45}>
              <Link
                href="/brief"
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-orange-gradient px-7 py-3.5 text-[15px] font-semibold text-white shadow-glow-orange transition-all hover:scale-[1.04] hover:shadow-[0_0_55px_rgba(255,46,154,0.5)]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <Zap className="h-5 w-5" />
                Primește estimare
              </Link>
            </Magnetic>
            <Link
              href="/proiecte"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-text backdrop-blur transition hover:border-brand-orange/70 hover:bg-white/[0.08]"
            >
              Vezi proiectele
            </Link>
          </motion.div>
        </div>

        {/* 3D — doar desktop; pe mobil, glow static */}
        <div className="relative hidden h-[480px] lg:block">
          {isDesktop && <Crystal3D />}
        </div>
        <div className="pointer-events-none absolute right-[8%] top-1/2 hidden h-72 w-72 -translate-y-1/2 rounded-full bg-brand-magenta/20 blur-[100px] lg:block" />
      </div>
    </div>
  );
}

function ProjectSlide({
  img,
  tag,
  title,
  text,
  href,
}: {
  img: string;
  tag: string;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#050507]">
      {/* luminile din spate */}
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[420px] w-[420px] rounded-full bg-brand-orange/[0.12] blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 top-0 h-[420px] w-[420px] rounded-full bg-brand-purple/[0.14] blur-[120px]" />

      <div className="container-app relative z-10 grid h-full items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        {/* stânga: puțin text */}
        <div className="text-center lg:text-left">
          <motion.span
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="inline-block rounded-full border border-brand-orange/40 bg-black/50 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand-orangeLight backdrop-blur"
          >
            {tag}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-display text-4xl font-black uppercase leading-[1.05] text-white sm:text-5xl"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mx-auto mt-3 max-w-md text-[15px] text-white/70 lg:mx-0"
          >
            {text}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="mt-7"
          >
            <Link
              href={href}
              className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-6 py-3 text-sm font-semibold text-white shadow-glow-orange transition hover:scale-[1.04]"
            >
              Vezi proiectul <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        {/* dreapta: site-ul în ramă de sticlă, înclinată 3D, plutind */}
        <motion.div
          initial={{ opacity: 0, x: 60, rotateY: -16 }}
          animate={{ opacity: 1, x: 0, rotateY: -9 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden lg:block"
          style={{ perspective: 1200, transformStyle: "preserve-3d" }}
        >
          <div className="absolute -inset-6 rounded-[1.8rem] bg-imperial-gradient opacity-20 blur-3xl" />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="glass relative overflow-hidden rounded-2xl shadow-card"
            style={{ transform: "rotateY(-9deg) rotateX(3deg)" }}
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="mx-auto flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-0.5 text-[11px] text-text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                {new URL("https://" + hrefDomain(href, title)).hostname}
              </span>
              <span className="w-12" />
            </div>
            <div className="relative aspect-[16/10] overflow-hidden">
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: ["0%", "-18%", "0%"] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                className="absolute inset-x-0 top-0 h-[140%]"
              >
                <Image src={img} alt={title} fill sizes="640px" className="object-cover object-top" priority />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* pe mobil: rama simplă, dreaptă */}
        <div className="lg:hidden">
          <div className="glass relative overflow-hidden rounded-2xl shadow-card">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image src={img} alt={title} fill sizes="90vw" className="object-cover object-top" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// domeniul afișat în bara ramei — derivat simplu din titlu/proiect
function hrefDomain(href: string, title: string) {
  if (href.includes("clinica")) return "clinicasfantulgheorghe.ro";
  if (href.includes("sarami")) return "sarami.ro";
  return "imperial-media.ro";
}

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
          <span className="text-chrome">Cifrele</span>{" "}
          <span className="text-gradient">vorbesc.</span>
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

  const slides: SlideDef[] = [
    { key: "brand", render: (_a, d) => <BrandSlide isDesktop={d} /> },
    {
      key: "clinica",
      render: () => (
        <ProjectSlide
          img="/proiecte/clinica-sf-gheorghe/home.jpg"
          tag="Proiect livrat · spital privat"
          title="Clinica Sfântul Gheorghe"
          text="36 de pagini, programări online, asistent AI și panou de administrare — construit de la zero."
          href="/proiecte/site-clinica-sfantul-gheorghe-botosani"
        />
      ),
    },
    {
      key: "sarami",
      render: () => (
        <ProjectSlide
          img="/proiecte/sarami/home.jpg"
          tag="Proiect livrat · agenție video"
          title="Sarami Media"
          text="Migrare completă de pe WordPress: 124 de articole fără pierdere SEO, panou propriu, brief-uri și ofertare."
          href="/proiecte/sarami-media-editare-video"
        />
      ),
    },
    { key: "stats", render: () => <StatsSlide /> },
  ];

  const go = useCallback(
    (n: number) => setI((v) => (v + n + slides.length) % slides.length),
    [slides.length]
  );

  // autoplay cu pauză la hover
  useEffect(() => {
    timer.current = setInterval(() => {
      if (!paused.current) go(1);
    }, AUTOPLAY);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [go]);

  // săgețile de la tastatură
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
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      {/* slide-urile — wipe diagonal cinematic */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slides[i].key}
          initial={{ clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" }}
          animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
          exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.35 } }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {slides[i].render(true, isDesktop)}
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

      {/* linia de lumină de la bază */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent" />
    </section>
  );
}
