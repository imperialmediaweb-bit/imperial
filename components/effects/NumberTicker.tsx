"use client";

// Number ticker — numărul urcă animat de la 0 când intră în viewport.
// Stil Magic UI, fără dependințe extra.

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

type Props = {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number; // ms
  className?: string;
};

export function NumberTicker({
  value,
  suffix = "",
  prefix = "",
  duration = 1600,
  className = "",
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      // easeOutExpo — accelerare naturală
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setDisplay(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {/* Pe ecran: numărul animat. La PRINT: valoarea finală — altfel PDF-ul
          arată „0" pentru tot ce n-a intrat în viewport înainte de tipărire. */}
      <span className="print:hidden">
        {prefix}
        {display.toLocaleString("ro-RO")}
        {suffix}
      </span>
      <span className="hidden print:inline">
        {prefix}
        {value.toLocaleString("ro-RO")}
        {suffix}
      </span>
    </span>
  );
}
