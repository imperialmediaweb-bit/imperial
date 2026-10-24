'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, registerGsap } from '../lib/gsap';
import { useReducedMotion, type ReducedMotionMode } from '../hooks';

export interface SmoothScrollEvent {
  scroll: number;
  limit: number;
  velocity: number;
  progress: number;
  direction: 1 | -1 | 0;
}

export interface SmoothScrollProviderProps {
  children: ReactNode;
  /** Interpolation factor per frame (0–1, lower = smoother). Default 0.1. */
  lerp?: number;
  /** Alternative to lerp: duration of a scroll in seconds (used when `lerp` is undefined). */
  duration?: number;
  /** Smooth the wheel (true) or only programmatic scrolls (false). Default true. */
  smoothWheel?: boolean;
  /** Also smooth touch scrolling (off by default: native touch scrolling feels better). */
  syncTouch?: boolean;
  orientation?: 'vertical' | 'horizontal';
  /**
   * `window` (default) smooths the page scroll. `container` renders its own scrolling
   * wrapper around `children`, for showcases and nested scroll areas.
   */
  mode?: 'window' | 'container';
  /** Turn smoothing off without unmounting (native scrolling, ScrollTrigger still works). */
  enabled?: boolean;
  reducedMotion?: ReducedMotionMode;
  onScroll?: (event: SmoothScrollEvent) => void;
  className?: string;
  style?: CSSProperties;
}

export interface SmoothScrollContextValue {
  /** Scroll to a target (px, selector or element). No-op when smoothing is disabled. */
  scrollTo: (
    target: number | string | HTMLElement,
    options?: { offset?: number; duration?: number; immediate?: boolean; lock?: boolean },
  ) => void;
  /** Pause / resume smoothing (e.g. while a modal is open). */
  stop: () => void;
  start: () => void;
  /** The live Lenis instance, or null when disabled / reduced motion. */
  getInstance: () => Lenis | null;
  /** True while Lenis is driving the scroll. */
  isActive: () => boolean;
}

const noop = () => {};
const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  scrollTo: noop,
  stop: noop,
  start: noop,
  getInstance: () => null,
  isActive: () => false,
});

/** Access the smooth-scroll controls from anywhere under `SmoothScrollProvider`. */
export function useSmoothScroll(): SmoothScrollContextValue {
  return useContext(SmoothScrollContext);
}

/**
 * EXTRA 01 — Lenis Smooth Scroll
 *
 * Mounts a Lenis instance driven by the GSAP ticker (one rAF for everything), calls
 * `ScrollTrigger.update` on every scroll so pins and scrubs stay in sync, and steps aside
 * under reduced motion or when `enabled` is false, where native scrolling is used.
 * Elements with `data-lenis-prevent` keep native scrolling (nested scroll areas).
 */
export function SmoothScrollProvider({
  children,
  lerp = 0.1,
  duration,
  smoothWheel = true,
  syncTouch = false,
  orientation = 'vertical',
  mode = 'window',
  enabled = true,
  reducedMotion = 'auto',
  onScroll,
  className,
  style,
}: SmoothScrollProviderProps) {
  const reduced = useReducedMotion(reducedMotion);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const onScrollRef = useRef(onScroll);
  useEffect(() => {
    onScrollRef.current = onScroll;
  }, [onScroll]);

  const active = enabled && !reduced;

  useEffect(() => {
    if (!active) return;
    registerGsap();
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    const lenis = new Lenis({
      ...(duration === undefined ? { lerp } : { duration }),
      smoothWheel,
      syncTouch,
      orientation,
      autoRaf: false,
      ...(mode === 'container' && wrapper && content ? { wrapper, content } : {}),
    });
    lenisRef.current = lenis;
    const handleScroll = (instance: Lenis) => {
      ScrollTrigger.update();
      onScrollRef.current?.({
        scroll: instance.scroll,
        limit: instance.limit,
        velocity: instance.velocity,
        progress: instance.progress,
        direction: instance.direction as 1 | -1 | 0,
      });
    };
    lenis.on('scroll', handleScroll);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.off('scroll', handleScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [active, lerp, duration, smoothWheel, syncTouch, orientation, mode]);

  const value = useMemo<SmoothScrollContextValue>(
    () => ({
      scrollTo: (target, options) => lenisRef.current?.scrollTo(target, options),
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
      getInstance: () => lenisRef.current,
      isActive: () => lenisRef.current !== null,
    }),
    [],
  );

  if (mode === 'container') {
    return (
      <SmoothScrollContext.Provider value={value}>
        <div
          ref={wrapperRef}
          className={className}
          data-imperial-effect="smooth-scroll"
          data-smooth-scroll-active={active ? 'true' : 'false'}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: orientation === 'vertical' ? 'hidden auto' : 'auto hidden',
            overscrollBehavior: 'contain',
            ...style,
          }}
        >
          <div ref={contentRef}>{children}</div>
        </div>
      </SmoothScrollContext.Provider>
    );
  }
  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>;
}
