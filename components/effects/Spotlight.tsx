"use client";

import { useEffect, useRef } from "react";

// Mouse-follow spotlight — radial gradient care urmărește cursorul
// și luminează zona din jur. Folosit ca overlay peste hero.
export function Spotlight({
  className = "",
  color = "rgba(255, 107, 26, 0.18)",
  size = 500,
}: {
  className?: string;
  color?: string;
  size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      el.style.background = `radial-gradient(${size}px circle at ${x}px ${y}px, ${color}, transparent 70%)`;
    };
    const onLeave = () => {
      el.style.background = "transparent";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [color, size]);

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${className}`}
      aria-hidden="true"
    />
  );
}
