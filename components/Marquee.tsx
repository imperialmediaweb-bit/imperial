"use client";

import Image from "next/image";

// Banda de proiecte: două rânduri de screenshot-uri REALE care curg în direcții
// opuse — munca livrată, nu vorbe. Color discret, viu la hover.
const ROW_A = [
  "/proiecte/clinica-sf-gheorghe/home.jpg",
  "/proiecte/sarami/home.jpg",
  "/proiecte/clinica-sf-gheorghe/medici.jpg",
  "/proiecte/sarami/portofoliu.jpg",
  "/proiecte/clinica-sf-gheorghe/programare.jpg",
];
const ROW_B = [
  "/proiecte/sarami/editare-video.jpg",
  "/proiecte/clinica-sf-gheorghe/servicii.jpg",
  "/proiecte/sarami/blog.jpg",
  "/proiecte/clinica-sf-gheorghe/despre.jpg",
  "/proiecte/sarami/landing.jpg",
];

function Row({ imgs, reverse }: { imgs: string[]; reverse?: boolean }) {
  const all = [...imgs, ...imgs, ...imgs];
  return (
    <div
      className="flex w-max animate-marquee gap-5"
      style={reverse ? { animationDirection: "reverse", animationDuration: "38s" } : { animationDuration: "34s" }}
    >
      {all.map((src, i) => (
        <div
          key={i}
          className="relative h-32 w-52 shrink-0 overflow-hidden rounded-xl border border-bg-border/80 opacity-95 saturate-100 transition-all duration-300 hover:opacity-100 hover:border-brand-orange/50 sm:h-40 sm:w-64"
        >
          <Image src={src} alt="Proiect livrat Imperial Media" fill sizes="260px" className="object-cover object-top" />
        </div>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <section className="relative overflow-hidden border-y border-bg-border/60 bg-[#050507] py-10">
      <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-text-subtle">
        384+ proiecte livrate — câteva dintre ele
      </p>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-[#050507] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-[#050507] to-transparent" />
      <div className="space-y-5">
        <Row imgs={ROW_A} />
        <Row imgs={ROW_B} reverse />
      </div>
    </section>
  );
}
