'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { gsap, registerGsap, ScrollTrigger, useGSAP } from '../lib/gsap';

export interface PinnedProgressOptions {
  /** Section that defines where the pinned stretch starts. */
  rootRef: RefObject<HTMLElement | null>;
  /** Element that stays pinned while scrolling. */
  stageRef: RefObject<HTMLElement | null>;
  /** Number of stops (rooms, scenes). Progress runs from 0 to count − 1. */
  count: number;
  /** Viewports of scrolling between two stops. Default 1.2. */
  distance?: number;
  /** Scrub smoothing in seconds (0 = locked to the scrollbar). Default 0.6. */
  scrub?: number;
  /** Settle on the nearest stop when scrolling stops. Default true. */
  snap?: boolean;
  /** Custom scroll container (selector or element). */
  scroller?: string | HTMLElement;
  /** Reduced motion: no smoothing, instant jumps. */
  reduced?: boolean;
  /** Turn the scroll binding off (e.g. a step mode). Default true. */
  enabled?: boolean;
  /** Receives the progress on every scroll update. */
  onProgress: (progress: number) => void;
}

export interface PinnedProgressApi {
  /** Scroll to stop `index` with an eased, interruptible glide (wheel or touch takes over). */
  goTo: (index: number) => void;
}

/**
 * Pins `stageRef` and maps scrolling to a progress value 0 … count − 1, snapping to whole
 * stops. Shared by the scroll journeys (doors, portals): chapter jumps glide with a GSAP
 * tween, a pending snap follows the jump target instead of pulling the page back, and a
 * snap tween that already finished is never killed blindly (`getTween(true)` may not be a
 * tween then).
 */
export function usePinnedProgress({
  rootRef,
  stageRef,
  count,
  distance = 1.2,
  scrub = 0.6,
  snap = true,
  scroller,
  reduced = false,
  enabled = true,
  onProgress,
}: PinnedProgressOptions): PinnedProgressApi {
  const last = Math.max(0, count - 1);
  const stRef = useRef<ScrollTrigger | null>(null);
  const progressRef = useRef(0);
  const jumpRef = useRef<number | null>(null);
  const jumpTweenRef = useRef<ReturnType<typeof gsap.to> | null>(null);
  const jumpCleanupRef = useRef<(() => void) | null>(null);
  const onProgressRef = useRef(onProgress);
  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useGSAP(
    () => {
      registerGsap();
      if (!enabled) return;
      const root = rootRef.current;
      const stage = stageRef.current;
      if (!root || !stage || count < 1) return;
      const proxy = { p: 0 };
      progressRef.current = 0;
      onProgressRef.current(0);
      const tween = gsap.to(proxy, {
        p: last,
        ease: 'none',
        paused: true,
        onUpdate: () => {
          progressRef.current = proxy.p;
          onProgressRef.current(proxy.p);
        },
      });
      const stops = last ? Array.from({ length: count }, (_, i) => i / last) : [0];
      const snapToStop = gsap.utils.snap(stops);
      const st = ScrollTrigger.create({
        trigger: root,
        scroller,
        start: 'top top',
        end: () => `+=${Math.max(1, last) * distance * (stage.clientHeight || window.innerHeight)}`,
        pin: stage,
        pinSpacing: true,
        scrub: reduced ? true : scrub,
        animation: tween,
        snap:
          snap && last > 0
            ? {
                // Nearest stop to where the scroll is (no momentum overshoot); during a jump,
                // the jump target, so a late snap cannot pull the page elsewhere.
                snapTo: (value: number, self?: ScrollTrigger) =>
                  jumpRef.current ?? snapToStop(self?.progress ?? value),
                duration: { min: 0.3, max: 1 },
                ease: 'power2.inOut',
                delay: 0.1,
              }
            : undefined,
        onUpdate: (self) => {
          const target = jumpRef.current;
          if (target !== null && Math.abs(self.progress - target) < 0.002) jumpRef.current = null;
        },
      });
      stRef.current = st;
      return () => {
        st.kill();
        tween.kill();
        stRef.current = null;
      };
    },
    {
      dependencies: [enabled, count, distance, scrub, snap, reduced, scroller],
      scope: rootRef,
    },
  );

  useEffect(
    () => () => {
      jumpTweenRef.current?.kill();
      jumpCleanupRef.current?.();
    },
    [],
  );

  const goTo = (index: number) => {
    const st = stRef.current;
    if (!st || !last) return;
    const i = Math.min(last, Math.max(0, index));
    const snapTween: unknown = st.getTween(true);
    if (snapTween && typeof (snapTween as { kill?: unknown }).kill === 'function')
      (snapTween as { kill: () => void }).kill();
    const progress = i / last;
    jumpRef.current = progress;
    window.setTimeout(() => {
      if (jumpRef.current === progress) jumpRef.current = null;
    }, 4000);
    const y = st.start + progress * (st.end - st.start);
    const el =
      typeof scroller === 'string'
        ? document.querySelector<HTMLElement>(scroller)
        : (scroller ?? null);
    const surface: HTMLElement | Window = el ?? window;
    const read = () => (el ? el.scrollTop : window.scrollY);
    const write = (v: number) => surface.scrollTo({ top: v, behavior: 'instant' });
    jumpTweenRef.current?.kill();
    jumpCleanupRef.current?.();
    if (reduced) {
      write(y);
      return;
    }
    const pos = { y: read() };
    const stop = () => {
      jumpTweenRef.current?.kill();
      jumpTweenRef.current = null;
      jumpRef.current = null;
      jumpCleanupRef.current?.();
    };
    surface.addEventListener('wheel', stop, { passive: true });
    surface.addEventListener('touchstart', stop, { passive: true });
    jumpCleanupRef.current = () => {
      surface.removeEventListener('wheel', stop);
      surface.removeEventListener('touchstart', stop);
      jumpCleanupRef.current = null;
    };
    const span = Math.abs(i - progressRef.current);
    jumpTweenRef.current = gsap.to(pos, {
      y,
      duration: Math.min(3.2, Math.max(0.8, span * 1.2)),
      ease: 'power2.inOut',
      onUpdate: () => write(pos.y),
      onComplete: () => {
        jumpTweenRef.current = null;
        jumpCleanupRef.current?.();
      },
    });
  };

  return { goTo };
}
