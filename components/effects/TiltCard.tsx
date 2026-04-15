"use client";

import { useRef, useState, ReactNode } from "react";

// 3D tilt wrapper — cardul se înclină după mouse, cu shine effect.
// Folosit pe cardurile de servicii pentru efect "premium".
export function TiltCard({
  children,
  className = "",
  intensity = 12,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [shine, setShine] = useState({ x: 50, y: 50, opacity: 0 });

  function handleMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const tiltX = (0.5 - y) * intensity;
    const tiltY = (x - 0.5) * intensity;
    setTransform(
      `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`
    );
    setShine({ x: x * 100, y: y * 100, opacity: 0.6 });
  }

  function handleLeave() {
    setTransform("perspective(1000px) rotateX(0) rotateY(0) scale(1)");
    setShine({ x: 50, y: 50, opacity: 0 });
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transform, transition: "transform 0.15s ease-out" }}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      {/* Shine overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.18), transparent 50%)`,
          opacity: shine.opacity,
        }}
      />
    </div>
  );
}
