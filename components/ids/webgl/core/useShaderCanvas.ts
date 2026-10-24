'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import {
  useInView,
  usePageVisibility,
  useReducedMotion,
  type ReducedMotionMode,
} from '../../hooks';
import { detectWebGL } from '../detectWebGL';

export interface ShaderCanvasController {
  /** Called once with the canvas; return a frame function and a dispose function. */
  setup: (
    canvas: HTMLCanvasElement,
    size: { width: number; height: number; dpr: number },
  ) => {
    frame: (time: number, dt: number) => void;
    resize: (width: number, height: number, dpr: number) => void;
    dispose: () => void;
  } | null;
  maxDpr?: number;
  reducedMotion?: ReducedMotionMode;
  /** Render a single frame under reduced motion instead of looping. Default true. */
  staticWhenReduced?: boolean;
}

export interface ShaderCanvasState {
  canvasRef: RefObject<HTMLCanvasElement>;
  wrapperRef: RefObject<HTMLDivElement>;
  /** null until checked; false when WebGL (or the effect's requirements) are unavailable. */
  supported: boolean | null;
  reduced: boolean;
}

/**
 * Lifecycle for raw-WebGL effects: WebGL detection, ResizeObserver-driven sizing with a
 * DPR cap, a rAF loop that only runs while visible and in a visible tab, reduced-motion
 * single frame, and guaranteed disposal.
 */
export function useShaderCanvas({
  setup,
  maxDpr = 1.5,
  reducedMotion = 'auto',
  staticWhenReduced = true,
}: ShaderCanvasController): ShaderCanvasState {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState<boolean | null>(null);
  const reduced = useReducedMotion(reducedMotion);
  const inView = useInView(wrapperRef, { rootMargin: '100px' });
  const visible = usePageVisibility();
  const setupRef = useRef(setup);
  useEffect(() => {
    setupRef.current = setup;
  }, [setup]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setSupported(detectWebGL().supported));
    return () => cancelAnimationFrame(id);
  }, []);

  // Visibility / reduced-motion changes must not tear the GL context down: the setup
  // effect depends only on `supported` and `maxDpr`, and the loop reads live flags from a ref.
  const runtime = useRef({ inView, visible, reduced, staticWhenReduced });
  const kickRef = useRef<() => void>(() => {});
  useEffect(() => {
    runtime.current = { inView, visible, reduced, staticWhenReduced };
    kickRef.current();
  }, [inView, visible, reduced, staticWhenReduced]);

  useEffect(() => {
    if (!supported) return;
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const rect = wrapper.getBoundingClientRect();
    const size = { width: Math.max(1, rect.width), height: Math.max(1, rect.height), dpr };
    canvas.width = Math.round(size.width * dpr);
    canvas.height = Math.round(size.height * dpr);
    let ctrl: ReturnType<ShaderCanvasController['setup']>;
    try {
      ctrl = setupRef.current(canvas, size);
    } catch (err) {
      console.warn('[imperial/webgl] shader setup failed, showing fallback:', err);
      ctrl = null;
    }
    if (!ctrl) {
      queueMicrotask(() => setSupported(false));
      return;
    }
    const controller = ctrl;
    const ro = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const w = Math.max(1, entry.contentRect.width);
      const h = Math.max(1, entry.contentRect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      controller.resize(w, h, dpr);
      controller.frame(performance.now() / 1000, 0);
    });
    ro.observe(wrapper);
    let raf = 0;
    let last = performance.now();
    let active = false;
    let disposed = false;
    const running = () => {
      const r = runtime.current;
      return r.inView && r.visible && !(r.reduced && r.staticWhenReduced);
    };
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      controller.frame(now / 1000, dt);
      if (running()) raf = requestAnimationFrame(loop);
      else active = false;
    };
    const kick = () => {
      if (disposed) return;
      if (running()) {
        if (active) return;
        active = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else {
        cancelAnimationFrame(raf);
        active = false;
        controller.frame(performance.now() / 1000, 0);
      }
    };
    kickRef.current = kick;
    kick();
    return () => {
      disposed = true;
      kickRef.current = () => {};
      cancelAnimationFrame(raf);
      ro.disconnect();
      controller.dispose();
    };
  }, [supported, maxDpr]);

  return { canvasRef, wrapperRef, supported, reduced };
}
