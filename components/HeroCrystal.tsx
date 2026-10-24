"use client";

/**
 * Hero „Crystal & Wireframe” — direcția aleasă de Ionuț (igloo.inc + basement.studio):
 * cioburi de obsidian LUCIOASE care plutesc (FloatingRocks, din design system),
 * un cristal central glossy cu muchii neon și un grid wireframe — totul în
 * culorile brandului, cu parallax la mouse. Pe mobil: poster static (viteză).
 */

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import type { Group } from "three";
import dynamic from "next/dynamic";
import Link from "next/link";
import { gsap, registerGsap, useGSAP } from "./ids/lib/gsap";
import { useReducedMotion } from "./ids/hooks";
import { MagneticButton } from "./ids/effects/MagneticButton";
import { NumberTicker } from "./effects/NumberTicker";
import { Zap } from "lucide-react";

const FloatingRocks = dynamic(
  () => import("./ids/three/rocks/FloatingRocks").then((m) => m.FloatingRocks),
  { ssr: false }
);

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

/* conținut 3D suplimentar: cristalul central glossy + wireframe (igloo + basement) */
function CrystalCore() {
  const g = useRef<Group>(null);
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * 0.35;
  });
  return (
    <>
      <group ref={g} position={[2.9, 0.3, 2]}>
      {/* cristalul central — obsidian lucios cu reflexe */}
      <mesh rotation={[0.4, 0.8, 0.1]}>
        <icosahedronGeometry args={[2, 0]} />
        <meshPhysicalMaterial
          color="#1a1424"
          metalness={0.45}
          roughness={0.07}
          clearcoat={1}
          clearcoatRoughness={0.05}
          emissive="#3a1245"
          emissiveIntensity={0.55}
          flatShading
        />
      </mesh>
      {/* muchiile neon ale cristalului */}
      <mesh rotation={[0.4, 0.8, 0.1]} scale={1.004}>
        <icosahedronGeometry args={[2, 0]} />
        <meshBasicMaterial color="#FF2E9A" wireframe transparent opacity={0.6} />
      </mesh>
      {/* lumina din interiorul cristalului */}
      <pointLight position={[0, 0, 0]} intensity={24} color="#FF2E9A" distance={8} />
      </group>
      {/* pulbere de scântei aurii + violete prin toată scena */}
      <Sparkles count={120} scale={14} size={2.4} speed={0.5} color="#FFB020" opacity={0.75} />
      <Sparkles count={70} scale={16} size={2} speed={0.35} color="#B06CFF" opacity={0.55} />
      {/* gridul wireframe de sub scenă — basement vibe */}
      <gridHelper args={[60, 48, "#3a1430", "#160a1c"]} position={[0, -4.2, 0]} />
      {/* lumini suplimentare în culorile brandului */}
      <pointLight position={[4, 2, 4]} intensity={30} color="#FF2E9A" distance={16} />
      <pointLight position={[-5, -1, 3]} intensity={22} color="#FF6B1A" distance={16} />
      <pointLight position={[0, 4, -3]} intensity={18} color="#8B2FF7" distance={18} />
    </>
  );
}

export function HeroCrystal() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    setIsDesktop(window.matchMedia("(min-width: 1024px)").matches);
  }, []);

  return (
    <section className="relative h-[calc(100svh-6rem)] min-h-[560px] overflow-hidden bg-[#050507] sm:h-[calc(100svh-7rem)] md:h-[calc(100svh-8rem)]">
      {/* scena 3D (desktop) / posterul clipului (mobil) */}
      {isDesktop ? (
        <FloatingRocks
          count={36}
          spread={8}
          size={0.7}
          speed={1.25}
          drift={0.8}
          roughness={0.12}
          color="#0d0b12"
          accent="#FF2E9A"
          background="#050507"
          quality="medium"
          style={{ position: "absolute", inset: 0 }}
          label="Cioburi de obsidian lucios plutind în spațiu"
        >
          <CrystalCore />
        </FloatingRocks>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/video/hero-poster.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* vignetă + lizibilitate text */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(5,5,7,0.78)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#050507] to-transparent" />

      {/* conținutul */}
      <div className="container-app relative z-10 flex h-full flex-col items-start justify-center">
        <p className="font-jmono text-[11px] uppercase tracking-[0.32em] text-brand-magenta">
          Imperial Media — studio de design & development
        </p>
        <LineReveal className="mt-5 max-w-[18ch] font-display text-[clamp(1.9rem,4.4vw,4.2rem)] font-black uppercase leading-[0.98] tracking-tight">
          <span data-line className="text-chrome block">Site-uri pe care oamenii</span>
          <span data-line className="text-gradient block">nu le uită.</span>
        </LineReveal>

        <div className="mt-8 flex flex-wrap items-center gap-3">
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

        <div className="mt-10 flex items-start gap-8 sm:gap-12">
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
