"use client";

// Card cu efect "shine" la hover — o rază de lumină traversează cardul.
// + border glow care urmărește mouse-ul (stil Magic UI / Aceternity).

import { useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function ShineCard({ children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={`group relative overflow-hidden ${className}`}
    >
      {/* Spot de lumină care urmărește mouse-ul */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: hovering ? 1 : 0,
          background: `radial-gradient(320px circle at ${pos.x}px ${pos.y}px, rgba(255,107,26,0.12), transparent 65%)`,
        }}
      />
      {children}
    </div>
  );
}
