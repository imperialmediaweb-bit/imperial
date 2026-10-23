"use client";

import { useEffect, useState } from "react";

// „Firul de lumină”: o linie verticală pe marginea stângă care se umple cu
// gradientul brandului pe măsură ce cobori în pagină — scânteia care aduce
// ideea la viață. Doar pe desktop; pur vizual, zero interacțiune.
export function LightThread() {
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      raf = 0;
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
      aria-hidden="true"
      className="pointer-events-none fixed bottom-0 left-4 top-0 z-30 hidden w-px bg-white/[0.06] print:hidden lg:block xl:left-6"
    >
      {/* Umplerea cu gradient */}
      <div
        className="absolute left-0 top-0 w-full origin-top"
        style={{
          height: "100%",
          transform: `scaleY(${p})`,
          background: "linear-gradient(180deg, #FF6B1A 0%, #FF2E9A 55%, #8B2FF7 100%)",
        }}
      />
      {/* Capul firului — scânteia */}
      <div
        className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          top: `${p * 100}%`,
          background: "#FF2E9A",
          boxShadow:
            "0 0 10px 2px rgba(255,46,154,0.9), 0 0 30px 8px rgba(255,107,26,0.45)",
        }}
      />
    </div>
  );
}
