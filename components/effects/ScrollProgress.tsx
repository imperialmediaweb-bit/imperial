"use client";

import { useEffect, useState } from "react";

// Bar subtil sus care arată progresul scroll-ului pe pagină.
export function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const tick = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      setP(pct);
    };
    tick();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    return () => {
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
    };
  }, []);

  return (
    <div className="fixed left-0 top-0 z-50 h-0.5 w-full bg-transparent">
      <div
        className="h-full bg-orange-gradient shadow-[0_0_10px_2px_rgba(255,107,26,0.7)] transition-[width] duration-100"
        style={{ width: `${p}%` }}
      />
    </div>
  );
}
