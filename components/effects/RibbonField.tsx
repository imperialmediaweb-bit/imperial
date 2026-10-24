"use client";

import { useEffect, useRef } from "react";

// „Video-ul” din hero: panglici de lumină foc→magenta→violet care curg continuu
// pe negru, ca în artworkul de brand — dar generate live pe canvas (0 MB de video).
// Desktop only; pe mobil / reduced-motion rămâne fundalul static CSS de dedesubt.

type Ribbon = {
  baseY: number; // poziția verticală de ancorare (fracție din înălțime)
  amp: number; // amplitudinea valului
  freq: number; // frecvența valului
  speed: number; // viteza de curgere
  width: number; // grosimea panglicii
  hueStops: [string, string, string]; // gradientul propriu
  phase: number;
  alpha: number;
};

const RIBBONS: Ribbon[] = [
  // foc — jos-stânga
  { baseY: 0.82, amp: 0.10, freq: 1.6, speed: 0.12, width: 90, hueStops: ["rgba(255,107,26,0)", "rgba(255,107,26,0.55)", "rgba(255,176,32,0)"], phase: 0, alpha: 0.8 },
  { baseY: 0.90, amp: 0.07, freq: 2.2, speed: 0.17, width: 46, hueStops: ["rgba(255,138,66,0)", "rgba(255,138,66,0.45)", "rgba(255,46,154,0)"], phase: 2.1, alpha: 0.7 },
  // magenta — mijloc, foarte discret
  { baseY: 0.50, amp: 0.16, freq: 1.1, speed: 0.07, width: 120, hueStops: ["rgba(255,46,154,0)", "rgba(255,46,154,0.16)", "rgba(139,47,247,0)"], phase: 4.4, alpha: 0.55 },
  // violet — sus-dreapta
  { baseY: 0.16, amp: 0.09, freq: 1.8, speed: 0.10, width: 80, hueStops: ["rgba(139,47,247,0)", "rgba(139,47,247,0.45)", "rgba(176,108,255,0)"], phase: 1.2, alpha: 0.75 },
  { baseY: 0.08, amp: 0.06, freq: 2.6, speed: 0.15, width: 36, hueStops: ["rgba(176,108,255,0)", "rgba(255,46,154,0.35)", "rgba(139,47,247,0)"], phase: 5.3, alpha: 0.6 },
];

export function RibbonField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (reduced || !desktop) return;

    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let raf = 0;
    let visible = true;
    let last = 0;
    let t = 0;

    // interacțiune: panglicile se îndoaie fin spre cursor (revin singure)
    const mouse = { x: -9999, y: 0, cx: -9999, cy: 0 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      // ~30fps e suficient și ține GPU-ul liniștit
      if (now - last < 33) return;
      t += (now - last) / 1000;
      last = now;

      // cursorul „efectiv” alunecă lin spre cel real (mișcare elastică)
      mouse.cx += (mouse.x - mouse.cx) * 0.08;
      mouse.cy += (mouse.y - mouse.cy) * 0.08;
      const hasMouse = mouse.x > -9000 && mouse.cx > -9000;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (const r of RIBBONS) {
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, r.hueStops[0]);
        grad.addColorStop(0.5, r.hueStops[1]);
        grad.addColorStop(1, r.hueStops[2]);

        // panglica = mai multe linii subțiri paralele, decalate — efect de mătase
        for (let k = 0; k < 4; k++) {
          const off = (k - 1.5) * (r.width / 4);
          ctx.beginPath();
          for (let x = -40; x <= w + 40; x += 16) {
            const n = x / w;
            let y =
              h * r.baseY +
              off +
              Math.sin(n * Math.PI * r.freq + t * r.speed * Math.PI * 2 + r.phase) * h * r.amp +
              Math.sin(n * Math.PI * r.freq * 2.7 + t * r.speed * 1.6 + r.phase * 2) * h * r.amp * 0.3;
            // îndoire locală spre cursor (clopot gaussian în jurul lui x)
            if (hasMouse) {
              const dx = (x - mouse.cx) / 260;
              y += (mouse.cy - y) * 0.22 * Math.exp(-dx * dx);
            }
            if (x === -40) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = grad;
          ctx.globalAlpha = (r.alpha * (1 - Math.abs(k - 1.5) / 2.6)) / 2.2;
          ctx.lineWidth = r.width / 7;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);
    const onVis = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame((n) => {
      last = n;
      draw(n);
    });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
