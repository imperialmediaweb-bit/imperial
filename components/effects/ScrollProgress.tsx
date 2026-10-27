"use client";

import { useEffect, useRef } from "react";

// Bar subtil sus care arată progresul scroll-ului pe pagină.
// Se actualizează direct (transform), fără re-randare React la fiecare eveniment de scroll.
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
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
    <div className="fixed left-0 top-0 z-50 h-0.5 w-full bg-transparent print:hidden">
      <div
        ref={bar}
        className="h-full w-full origin-left bg-orange-gradient shadow-[0_0_10px_2px_rgba(255,107,26,0.7)]"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
