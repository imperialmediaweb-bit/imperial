"use client";

import { useEffect, useRef } from "react";

// „Firul de lumină”: o linie verticală pe marginea stângă care se umple cu
// gradientul brandului pe măsură ce cobori în pagină — scânteia care aduce
// ideea la viață. Doar pe desktop; pur vizual, zero interacțiune.
export function LightThread() {
  const fill = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);

  // actualizare directă prin transform — fără re-randare React și fără recalcul de layout la fiecare cadru
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (fill.current) fill.current.style.transform = `scaleY(${p})`;
      if (head.current && box.current) head.current.style.transform = `translate(-50%, ${p * box.current.clientHeight}px) translateY(-50%)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={box}
      aria-hidden="true"
      className="pointer-events-none fixed bottom-0 left-4 top-0 z-30 hidden w-px bg-white/[0.06] print:hidden lg:block xl:left-6"
    >
      {/* Umplerea cu gradient */}
      <div
        ref={fill}
        className="absolute left-0 top-0 h-full w-full origin-top"
        style={{
          transform: "scaleY(0)",
          background: "linear-gradient(180deg, #FF6B1A 0%, #FF2E9A 55%, #8B2FF7 100%)",
        }}
      />
      {/* Capul firului — scânteia */}
      <div
        ref={head}
        className="absolute left-1/2 top-0 h-2.5 w-2.5 rounded-full"
        style={{
          transform: "translate(-50%, 0) translateY(-50%)",
          background: "#FF2E9A",
          boxShadow: "0 0 10px 2px rgba(255,46,154,0.9), 0 0 30px 8px rgba(255,107,26,0.45)",
        }}
      />
    </div>
  );
}
