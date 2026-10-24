'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion, type ReducedMotionMode } from '../hooks/useReducedMotion';

export interface CustomCursorProps {
  /** Base size in px. Default 12. */
  size?: number;
  /** Size when hovering interactive elements. Default 56. */
  hoverSize?: number;
  color?: string;
  /** Mix blend mode for the cursor layer. Default "difference". */
  blend?: CSSProperties['mixBlendMode'];
  /** Follow smoothing in seconds (0 = instant). Default 0.18. */
  lag?: number;
  /** Hide the native cursor inside the container. Default true. */
  hideNative?: boolean;
  /** Selector for elements that trigger the hover state. */
  hoverSelector?: string;
  /** Limit the cursor to this element instead of the whole document. */
  container?: HTMLElement | null;
  reducedMotion?: ReducedMotionMode;
}

/**
 * MOTION 13 — Custom Cursor
 *
 * A lerped cursor follower with context-aware states: it grows over links/buttons,
 * shows a label from `data-cursor="View"` attributes and a "drag" state over
 * `data-cursor="drag"`. Disabled on coarse pointers and reduced motion; the native
 * cursor is only hidden while the custom one is active, so nothing breaks without it.
 */
export function CustomCursor({
  size = 12,
  hoverSize = 56,
  color = '#c9a96e',
  blend = 'difference',
  lag = 0.18,
  hideNative = true,
  hoverSelector = 'a, button, [role="button"], [data-cursor]',
  container = null,
  reducedMotion = 'auto',
}: CustomCursorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion(reducedMotion);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine) return;
    const id = requestAnimationFrame(() => setEnabled(true));
    return () => cancelAnimationFrame(id);
  }, [reduced]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const scope: HTMLElement | Document = container ?? document;
    const root = container ?? document.documentElement;
    const xTo = gsap.quickTo(el, 'x', { duration: lag, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: lag, ease: 'power3.out' });
    gsap.set(el, { xPercent: -50, yPercent: -50, width: size, height: size, autoAlpha: 0 });
    let shown = false;
    const setState = (state: 'default' | 'hover' | 'drag', label = '') => {
      el.dataset.state = state;
      if (labelRef.current) labelRef.current.textContent = label;
      const s = state === 'default' ? size : hoverSize;
      gsap.to(el, { width: s, height: s, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
    };
    const onMove = (e: PointerEvent) => {
      const rect = container ? container.getBoundingClientRect() : { left: 0, top: 0 };
      xTo(e.clientX - rect.left);
      yTo(e.clientY - rect.top);
      if (!shown) {
        shown = true;
        gsap.to(el, { autoAlpha: 1, duration: 0.3 });
      }
      const target = (e.target as Element | null)?.closest(hoverSelector);
      if (!target) return setState('default');
      const custom = target.getAttribute('data-cursor');
      if (custom === 'drag') setState('drag', 'Drag');
      else if (custom) setState('hover', custom);
      else setState('hover');
    };
    const onLeave = () => {
      shown = false;
      gsap.to(el, { autoAlpha: 0, duration: 0.3 });
    };
    const onDown = () => gsap.to(el, { scale: 0.8, duration: 0.2 });
    const onUp = () => gsap.to(el, { scale: 1, duration: 0.3, ease: 'elastic.out(1,0.5)' });
    scope.addEventListener('pointermove', onMove as EventListener, { passive: true });
    scope.addEventListener('pointerleave', onLeave as EventListener);
    scope.addEventListener('pointerdown', onDown as EventListener);
    scope.addEventListener('pointerup', onUp as EventListener);
    if (hideNative) root.classList.add('imperial-cursor-hidden');
    return () => {
      scope.removeEventListener('pointermove', onMove as EventListener);
      scope.removeEventListener('pointerleave', onLeave as EventListener);
      scope.removeEventListener('pointerdown', onDown as EventListener);
      scope.removeEventListener('pointerup', onUp as EventListener);
      root.classList.remove('imperial-cursor-hidden');
    };
  }, [enabled, container, lag, size, hoverSize, hideNative, hoverSelector]);

  if (!enabled) return null;
  return (
    <div
      ref={ref}
      aria-hidden
      data-imperial-effect="custom-cursor"
      data-state="default"
      style={{
        position: container ? 'absolute' : 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        borderRadius: '50%',
        background: color,
        mixBlendMode: blend,
        display: 'grid',
        placeItems: 'center',
        willChange: 'transform, width, height',
        opacity: 0,
      }}
    >
      <span
        ref={labelRef}
        style={{
          fontSize: 10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#0b0b0d',
          fontWeight: 600,
          mixBlendMode: 'normal',
        }}
      />
    </div>
  );
}
