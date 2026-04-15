"use client";

import { useRef, ReactNode } from "react";

// Magnetic wrapper — copilul (link/button) e atras spre cursor
// în raza wrapper-ului. Oferă interacțiune "premium".
export function Magnetic({
  children,
  strength = 0.35,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  function move(e: React.MouseEvent) {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    inner.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  function reset() {
    if (innerRef.current)
      innerRef.current.style.transform = "translate3d(0,0,0)";
  }

  return (
    <span
      ref={wrapRef}
      onMouseMove={move}
      onMouseLeave={reset}
      className="relative inline-block"
    >
      <span
        ref={innerRef}
        className="inline-block transition-transform duration-200 ease-out"
      >
        {children}
      </span>
    </span>
  );
}
