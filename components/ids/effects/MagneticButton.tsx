'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion, type ReducedMotionMode } from '../hooks/useReducedMotion';

export interface MagneticButtonProps {
  children: ReactNode;
  /** Pull strength (0–1): how far the element follows the pointer. Default 0.4. */
  strength?: number;
  /** Activation radius around the element in px. Default 80. */
  radius?: number;
  /** Inner content moves a little more than the shell for depth (0–1). Default 0.5. */
  innerStrength?: number;
  /** Elastic return duration in seconds. Default 0.9. */
  release?: number;
  reducedMotion?: ReducedMotionMode;
  className?: string;
  style?: CSSProperties;
  /** Element rendered as the magnetic shell. Default "div". */
  as?: 'div' | 'span';
}

/**
 * MOTION 12 — Magnetic Buttons
 *
 * Within a radius the element eases toward the pointer (quickTo), its inner content a
 * little further for depth, and springs back elastically when the pointer leaves.
 * Skipped on coarse pointers and reduced motion.
 */
export function MagneticButton({
  children,
  strength = 0.4,
  radius = 80,
  innerStrength = 0.5,
  release = 0.9,
  reducedMotion = 'auto',
  className,
  style,
  as: Tag = 'div',
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion(reducedMotion);

  useEffect(() => {
    const el = ref.current;
    const inner = innerRef.current;
    if (!el || !inner || reduced) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });
    const ixTo = gsap.quickTo(inner, 'x', { duration: 0.45, ease: 'power3.out' });
    const iyTo = gsap.quickTo(inner, 'y', { duration: 0.45, ease: 'power3.out' });
    let active = false;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const reach = Math.max(r.width, r.height) / 2 + radius;
      if (dist < reach) {
        active = true;
        const f = (1 - dist / reach) * strength + strength * 0.4;
        xTo(dx * f);
        yTo(dy * f);
        ixTo(dx * f * innerStrength);
        iyTo(dy * f * innerStrength);
      } else if (active) {
        active = false;
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: release,
          ease: 'elastic.out(1, 0.45)',
          overwrite: true,
        });
        gsap.to(inner, {
          x: 0,
          y: 0,
          duration: release,
          ease: 'elastic.out(1, 0.45)',
          overwrite: true,
        });
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [strength, radius, innerStrength, release, reduced]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ display: 'inline-block', willChange: 'transform', ...style }}
      data-imperial-effect="magnetic-button"
    >
      <div ref={innerRef} style={{ display: 'inline-block', willChange: 'transform' }}>
        {children}
      </div>
    </Tag>
  );
}
