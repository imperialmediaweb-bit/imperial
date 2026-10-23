"use client";

import { useEffect, useRef } from "react";

// Dâră de scântei după cursor (doar desktop, doar pointer precis, respectă
// reduced-motion). Canvas full-screen, particule mici în culorile brandului.
const COLORS = ["255,107,26", "255,46,154", "139,47,247", "255,176,32"];

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: string;
};

export function SparkTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const sparks: Spark[] = [];
    let last = { x: -1, y: -1 };
    let raf = 0;
    let running = false;

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      // Scântei doar când cursorul chiar se mișcă — discret, nu artificii.
      if (last.x >= 0 && Math.hypot(dx, dy) > 6 && sparks.length < 90) {
        for (let i = 0; i < 2; i++) {
          sparks.push({
            x: e.clientX,
            y: e.clientY,
            vx: -dx * 0.03 + (Math.random() - 0.5) * 0.8,
            vy: -dy * 0.03 + (Math.random() - 0.5) * 0.8 + 0.3,
            life: 0,
            max: 28 + Math.random() * 20,
            size: 0.8 + Math.random() * 1.6,
            color: COLORS[(Math.random() * COLORS.length) | 0],
          });
        }
        if (!running) {
          running = true;
          raf = requestAnimationFrame(frame);
        }
      }
      last = { x: e.clientX, y: e.clientY };
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life++;
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.02;
        const a = 1 - s.life / s.max;
        if (a <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * a, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color},${(a * 0.9).toFixed(3)})`;
        ctx.shadowColor = `rgba(${s.color},0.8)`;
        ctx.shadowBlur = 6;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      if (sparks.length > 0) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] hidden print:hidden lg:block"
    />
  );
}
