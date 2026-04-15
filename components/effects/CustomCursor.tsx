"use client";

import { useEffect, useRef, useState } from "react";

// Custom cursor: dot + ring care urmărește mouse-ul.
// Ring-ul se mărește/morph pe hover peste link/butoane.
// Doar desktop; pe touch dispare.
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    // Detect touch device — ignoră cursor custom
    const isTouch = matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    setVisible(true);

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    // Ring lags behind with smooth easing
    const tick = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    let raf = requestAnimationFrame(tick);

    // Detect hover over interactive elements
    const interactiveSelectors = "a, button, [role=button], input, textarea, select, [data-cursor=hover]";
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(interactiveSelectors)) setHover(true);
    };
    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(interactiveSelectors)) setHover(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Hide native cursor globally */}
      <style jsx global>{`
        @media (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
      {/* Inner dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-brand-orange shadow-[0_0_10px_2px_rgba(255,107,26,0.8)]"
        style={{
          transform: "translate(-50%, -50%)",
          transition: "width 0.2s ease, height 0.2s ease, opacity 0.2s ease",
          opacity: hover ? 0 : 1,
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full border border-brand-orange/70 backdrop-blur-[1px]"
        style={{
          transform: "translate(-50%, -50%)",
          width: hover ? "56px" : "28px",
          height: hover ? "56px" : "28px",
          transition: "width 0.25s ease, height 0.25s ease, background 0.25s ease, border-color 0.25s ease",
          background: hover ? "rgba(255,107,26,0.15)" : "transparent",
          borderColor: hover ? "#FF6B1A" : "rgba(255,107,26,0.45)",
        }}
      />
    </>
  );
}
