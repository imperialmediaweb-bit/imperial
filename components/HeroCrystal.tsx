"use client";

/**
 * Hero „Crystal & Wireframe” — direcția aleasă de Ionuț (igloo.inc + basement.studio):
 * cioburi de obsidian LUCIOASE care plutesc (FloatingRocks, din design system),
 * un cristal central glossy cu muchii neon și un grid wireframe — totul în
 * culorile brandului, cu parallax la mouse. Pe mobil: poster static (viteză).
 */

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { gsap, registerGsap, useGSAP } from "./ids/lib/gsap";
import { useAfterInteraction, useReducedMotion } from "./ids/hooks";
import { MagneticButton } from "./ids/effects/MagneticButton";
import { NumberTicker } from "./effects/NumberTicker";
import { Zap } from "lucide-react";

// Motorul 3D vine într-un fișier separat: pe telefon nu se descarcă deloc
const HeroCrystalScene = dynamic(() => import("./HeroCrystalScene"), { ssr: false });

/* titlul pe linii — chrome + gradient (fără copii inline-block sub clip) */
function LineReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion("auto");
  useGSAP(
    () => {
      registerGsap();
      const lines = ref.current?.querySelectorAll<HTMLElement>("[data-line]");
      if (!lines?.length || reduced) return;
      gsap.fromTo(
        lines,
        { y: 48, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.16, ease: "power3.out", delay: 0.3 }
      );
    },
    { scope: ref, dependencies: [reduced] }
  );
  return (
    <h1 ref={ref} className={className}>
      {children}
    </h1>
  );
}

export function HeroCrystal() {
  const [isDesktop, setIsDesktop] = useState(false);
  const interacted = useAfterInteraction();
  useEffect(() => {
    setIsDesktop(window.matchMedia("(min-width: 1024px)").matches);
  }, []);

  return (
    <section className="relative h-[calc(100svh-6rem)] min-h-[560px] overflow-hidden bg-[#050507] sm:h-[calc(100svh-7rem)] md:h-[calc(100svh-8rem)]">
      {/* posterul se afișează instant (e elementul principal la încărcare);
          pe desktop, scena 3D îl acoperă după prima interacțiune */}
      <Image src="/video/hero-poster.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
      {isDesktop && interacted ? <HeroCrystalScene /> : null}

      {/* vignetă + lizibilitate text */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(5,5,7,0.78)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#050507] to-transparent" />

      {/* conținutul */}
      <div className="container-app relative z-10 flex h-full flex-col items-center justify-center lg:items-start">
        {/* LOGO-ul ca vedetă: sigla + wordmark ca în identitate, slogan mic */}
        <LineReveal className="flex flex-col items-center lg:items-start">
          <span data-line className="text-chrome mt-6 block font-brand text-[clamp(1.7rem,3.4vw,3rem)] tracking-[0.14em]">
            IMPERIAL
          </span>
          <span data-line className="mt-2 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.55em] text-white/60">
            <span className="h-px w-10 bg-gradient-to-r from-transparent via-brand-orange to-brand-magenta" />
            MEDIA
            <span className="h-px w-10 bg-gradient-to-r from-brand-magenta via-brand-purple to-transparent" />
          </span>
          <span data-line className="mt-6 block max-w-md text-center text-[15px] leading-relaxed text-white/65 sm:text-[17px] lg:text-left">
            Site-uri pe care oamenii <span className="text-gradient font-semibold">nu le uită</span> —
            construite de la zero, cu 3D, mișcare și cod rapid.
          </span>
        </LineReveal>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
          <MagneticButton strength={0.4}>
            <Link
              href="/brief"
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-orange-gradient px-7 py-3.5 text-[15px] font-semibold text-white shadow-glow-orange transition-all hover:scale-[1.04] hover:shadow-[0_0_55px_rgba(255,46,154,0.5)]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <Zap className="h-5 w-5" />
              Primește estimare gratuită
            </Link>
          </MagneticButton>
          <Link
            href="/site-start"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-text backdrop-blur transition hover:border-brand-orange/70 hover:bg-white/[0.08]"
          >
            Site Start — 1.500 lei
          </Link>
        </div>

        <div className="mt-10 flex items-start justify-center gap-8 sm:gap-12 lg:justify-start">
          {[
            { value: 384, suffix: "+", label: "proiecte" },
            { value: 200, suffix: "+", label: "clienți" },
            { value: 50, suffix: "", label: "ziare în rețea" },
          ].map((s) => (
            <div key={s.label}>
              <NumberTicker
                value={s.value}
                suffix={s.suffix}
                className="font-display text-2xl font-extrabold text-text sm:text-[1.6rem]"
              />
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-text-subtle">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px bg-gradient-to-r from-transparent via-brand-magenta/50 to-transparent" />
    </section>
  );
}
