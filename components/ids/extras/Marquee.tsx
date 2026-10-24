'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { gsap } from '../lib/gsap';
import { useInView } from '../hooks/useInView';
import { usePageVisibility } from '../hooks/usePageVisibility';
import { useReducedMotion, type ReducedMotionMode } from '../hooks/useReducedMotion';

export interface MarqueeProps {
  children: ReactNode;
  /** Speed in CSS px per second. Default 60. */
  speed?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  /** Pause while hovered / focused within. Default true. */
  pauseOnHover?: boolean;
  /** Gap between repeated copies (any CSS length). Default "3rem". */
  gap?: string | number;
  /** Fade the edges over this many px (0 = no fade). Default 0. */
  fade?: number;
  /** Minimum number of copies (more are added automatically to fill the width). Default 2. */
  minCopies?: number;
  reducedMotion?: ReducedMotionMode;
  /** Accessible name for the region, e.g. "Client logos". */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * EXTRA 02 — Infinite Marquee
 *
 * The content is repeated enough times to cover the container, then the track is
 * translated by exactly one copy (content + gap) on a linear, infinitely repeating GSAP
 * tween, so the loop is seamless at any size. Pauses on hover, off-screen, in hidden
 * tabs, and renders static under reduced motion. Copies after the first are aria-hidden.
 */
export function Marquee({
  children,
  speed = 60,
  direction = 'left',
  pauseOnHover = true,
  gap = '3rem',
  fade = 0,
  minCopies = 2,
  reducedMotion = 'auto',
  label,
  className,
  style,
}: MarqueeProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(minCopies);
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion(reducedMotion);
  const inView = useInView(outerRef, { rootMargin: '50px' });
  const visible = usePageVisibility();
  const vertical = direction === 'up' || direction === 'down';
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // How many copies are needed to cover the container plus one for the loop.
  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;
    const measure = () => {
      const first = track.firstElementChild as HTMLElement | null;
      if (!first) return;
      const copySize = vertical ? first.offsetHeight : first.offsetWidth;
      const outerSize = vertical ? outer.clientHeight : outer.clientWidth;
      if (copySize <= 0) return;
      setCopies(Math.max(minCopies, Math.ceil(outerSize / copySize) + 1));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(outer);
    const first = track.firstElementChild;
    if (first) ro.observe(first);
    return () => ro.disconnect();
  }, [vertical, minCopies]);

  // The loop tween: translate by one copy + gap, repeat forever.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduced) return;
    const build = () => {
      tweenRef.current?.kill();
      const first = track.firstElementChild as HTMLElement | null;
      if (!first) return;
      const cs = getComputedStyle(track);
      const gapPx = Number.parseFloat(vertical ? cs.rowGap : cs.columnGap) || 0;
      const distance = (vertical ? first.offsetHeight : first.offsetWidth) + gapPx;
      if (distance <= 0) return;
      const prop = vertical ? 'y' : 'x';
      const reverse = direction === 'right' || direction === 'down';
      tweenRef.current = gsap.fromTo(
        track,
        { [prop]: reverse ? -distance : 0 },
        {
          [prop]: reverse ? 0 : -distance,
          duration: distance / Math.max(1, speed),
          ease: 'none',
          repeat: -1,
        },
      );
    };
    build();
    const ro = new ResizeObserver(build);
    const first = track.firstElementChild;
    if (first) ro.observe(first);
    return () => {
      ro.disconnect();
      tweenRef.current?.kill();
      tweenRef.current = null;
      gsap.set(track, { x: 0, y: 0 });
    };
  }, [speed, direction, vertical, reduced, copies]);

  useEffect(() => {
    const tween = tweenRef.current;
    if (!tween) return;
    const shouldPause = (pauseOnHover && hovered) || !inView || !visible;
    if (shouldPause) tween.pause();
    else tween.play();
  }, [hovered, inView, visible, pauseOnHover, copies]);

  const mask =
    fade > 0
      ? `linear-gradient(${vertical ? 'to bottom' : 'to right'}, transparent, #000 ${fade}px, #000 calc(100% - ${fade}px), transparent)`
      : undefined;

  return (
    <div
      ref={outerRef}
      className={className}
      data-imperial-effect="marquee"
      data-direction={direction}
      role={label ? 'region' : undefined}
      aria-label={label}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        overflow: 'hidden',
        width: vertical ? undefined : '100%',
        height: vertical ? '100%' : undefined,
        maskImage: mask,
        WebkitMaskImage: mask,
        ...style,
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          flexDirection: vertical ? 'column' : 'row',
          gap,
          width: vertical ? undefined : 'max-content',
          height: vertical ? 'max-content' : undefined,
          willChange: 'transform',
        }}
      >
        {Array.from({ length: copies }, (_, i) => (
          <div
            key={i}
            aria-hidden={i > 0 ? true : undefined}
            style={{
              display: 'flex',
              flexDirection: vertical ? 'column' : 'row',
              gap,
              flexShrink: 0,
              alignItems: 'center',
            }}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
