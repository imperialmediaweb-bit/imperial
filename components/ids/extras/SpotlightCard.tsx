'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';
import { hexToRgb } from '../lib/noise';

export interface SpotlightCardProps {
  children: ReactNode;
  /** Spotlight colour (hex). Default gold. */
  color?: string;
  /** Spotlight radius in px. Default 320. */
  size?: number;
  /** Glow opacity (0–1). Default 0.35. */
  intensity?: number;
  /** Which layers to render. Default "both". */
  variant?: 'glow' | 'border' | 'both';
  /** Border width in px for the border layer. Default 1. */
  borderWidth?: number;
  /** Border radius (any CSS length). Default 16. */
  radius?: number | string;
  /** Fade-in/out duration in ms. Default 400. */
  transition?: number;
  as?: 'div' | 'article' | 'section' | 'li';
  className?: string;
  style?: CSSProperties;
}

/**
 * EXTRA 05 — Spotlight Hover
 *
 * Pointer position is written to CSS custom properties on the card; a radial gradient
 * overlay (glow) and a masked gradient ring (border) read those variables, so the effect
 * is pure CSS at paint time with no per-frame JavaScript. Works for touch (tap position)
 * and degrades to nothing without a pointer.
 */
export function SpotlightCard({
  children,
  color = '#c9a96e',
  size = 320,
  intensity = 0.35,
  variant = 'both',
  borderWidth = 1,
  radius = 16,
  transition = 400,
  as: Tag = 'div',
  className,
  style,
}: SpotlightCardProps) {
  const ref = useRef<HTMLElement>(null);
  const [r, g, b] = hexToRgb(color);
  const glow = `radial-gradient(${size}px circle at var(--imperial-spot-x) var(--imperial-spot-y), rgba(${r},${g},${b},${intensity}), transparent 70%)`;
  const ring = `radial-gradient(${size * 0.8}px circle at var(--imperial-spot-x) var(--imperial-spot-y), rgba(${r},${g},${b},${Math.min(1, intensity * 2.2)}), transparent 70%)`;
  const update = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--imperial-spot-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--imperial-spot-y', `${e.clientY - rect.top}px`);
    el.style.setProperty('--imperial-spot-o', '1');
  };
  const leave = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--imperial-spot-o', '0');
  };
  const Comp = Tag as 'div';
  return (
    <Comp
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      data-imperial-effect="spotlight-card"
      onPointerMove={update}
      onPointerDown={update}
      onPointerLeave={leave}
      style={
        {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: radius,
          isolation: 'isolate',
          '--imperial-spot-x': '50%',
          '--imperial-spot-y': '50%',
          '--imperial-spot-o': '0',
          ...style,
        } as CSSProperties
      }
    >
      {variant !== 'border' ? (
        <div
          aria-hidden
          data-spotlight-glow
          style={{
            position: 'absolute',
            inset: 0,
            background: glow,
            opacity: 'var(--imperial-spot-o)' as unknown as number,
            transition: `opacity ${transition}ms ease`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      ) : null}
      {variant !== 'glow' ? (
        <div
          aria-hidden
          data-spotlight-border
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            padding: borderWidth,
            background: ring,
            opacity: 'var(--imperial-spot-o)' as unknown as number,
            transition: `opacity ${transition}ms ease`,
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            maskComposite: 'exclude',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
      ) : null}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </Comp>
  );
}
