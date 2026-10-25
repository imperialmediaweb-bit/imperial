"use client";

/**
 * Hero-ul paginii Despre — aceeași lume ca pe homepage (cioburi de obsidian
 * glossy + scântei), dar cu povestea noastră în prim-plan. Mobil: poster static.
 */

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Sparkles as SparklesDrei } from "@react-three/drei";
import { NumberTicker } from "../effects/NumberTicker";

const FloatingRocks = dynamic(
  () => import("../ids/three/rocks/FloatingRocks").then((m) => m.FloatingRocks),
  { ssr: false }
);

const stats = [
  { value: 10, suffix: "+", label: "ani de experiență" },
  { value: 384, suffix: "+", label: "proiecte livrate" },
  { value: 200, suffix: "+", label: "clienți activi" },
  { value: 50, suffix: "", label: "ziare în rețea" },
];

function Lights() {
  return (
    <>
      <pointLight position={[4, 2, 4]} intensity={26} color="#FF2E9A" distance={16} />
      <pointLight position={[-5, -1, 3]} intensity={20} color="#FF6B1A" distance={16} />
      <SparklesDrei count={90} scale={14} size={2.2} speed={0.45} color="#FFB020" opacity={0.7} />
      <SparklesDrei count={50} scale={16} size={1.8} speed={0.3} color="#B06CFF" opacity={0.5} />
    </>
  );
}

export function DespreHero() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    setIsDesktop(window.matchMedia("(min-width: 1024px)").matches);
  }, []);

  return (
    <section className="relative min-h-[70svh] overflow-hidden bg-[#050507]">
      {isDesktop ? (
        <FloatingRocks
          count={26}
          spread={8}
          size={0.65}
          speed={1.1}
          drift={0.7}
          roughness={0.12}
          color="#0d0b12"
          accent="#FF2E9A"
          background="#050507"
          quality="medium"
          style={{ position: "absolute", inset: 0 }}
          label="Cioburi de obsidian plutind"
        >
          <Lights />
        </FloatingRocks>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/video/hero-poster.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(5,5,7,0.8)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050507] to-transparent" />

      <div className="container-app relative z-10 flex min-h-[70svh] flex-col items-start justify-center py-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="chip">Despre noi</span>
          <h1 className="mt-5 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.6rem)] font-semibold leading-[1.08] tracking-tight [text-shadow:0_2px_16px_rgba(0,0,0,0.85)]">
            Suntem Imperial Media.{" "}
            <span className="font-serifd italic text-gradient">Construim site-uri și magazine online din 2014.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-white/75 [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
            Studio de web design și dezvoltare din România, cu peste 384 de proiecte livrate
            și parteneriatul cu o rețea de 50 de publicații online.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 flex flex-wrap items-start gap-x-12 gap-y-6"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <NumberTicker value={s.value} suffix={s.suffix} className="font-display text-3xl font-extrabold text-text" />
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-text-subtle">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
