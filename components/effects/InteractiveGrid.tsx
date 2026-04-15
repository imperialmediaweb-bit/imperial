"use client";

import { useEffect, useRef } from "react";

// Grid pattern care se luminează în jurul cursorului.
// Folosește un mask SVG pentru efect "spotlight on grid".
export function InteractiveGrid({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-auto absolute inset-0 ${className}`}
      style={
        {
          "--mx": "50%",
          "--my": "50%",
          backgroundImage:
            "linear-gradient(rgba(255,107,26,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,26,0.15) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(280px circle at var(--mx) var(--my), black, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(280px circle at var(--mx) var(--my), black, transparent 70%)",
        } as React.CSSProperties
      }
    />
  );
}
