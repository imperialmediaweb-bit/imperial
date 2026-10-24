'use client';

import { useRef, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { SplitText } from 'gsap/SplitText';
import { gsap, registerGsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { resolveEase, type EasingName } from '../lib/easing';
import { useReducedMotion, type ReducedMotionMode } from '../hooks/useReducedMotion';
import type { ScrollEffectProps } from '../lib/scroll';

export interface SplitTextRevealProps extends ScrollEffectProps {
  children: ReactNode;
  /** Element rendered around the text. Default "p". */
  as?: ElementType;
  /** Split granularity. Default "lines". */
  type?: 'lines' | 'words' | 'chars';
  /** "mount" animates immediately, "scroll" when entering the viewport, "scrub" follows scroll. Default "scroll". */
  trigger?: 'mount' | 'scroll' | 'scrub';
  /** Seconds between each unit. Default 0.08 (lines), 0.03 (words), 0.015 (chars). */
  stagger?: number;
  duration?: number;
  ease?: EasingName | (string & {});
  /** Distance the units travel in, as a percentage of their height. Default 110. */
  distance?: number;
  /** Rotate units slightly as they rise (degrees). Default 0. */
  rotate?: number;
  /** Clip each line/word so text rises out of a mask. Default true. */
  mask?: boolean;
  /** Delay before the reveal in seconds. Default 0. */
  delay?: number;
  /** Replay the animation every time the element enters. Default false. */
  repeat?: boolean;
  reducedMotion?: ReducedMotionMode;
  className?: string;
  style?: CSSProperties;
}

/**
 * MOTION 01 — SplitText Reveal
 *
 * Splits text into lines, words or characters with GSAP SplitText (included in GSAP ≥ 3.13),
 * wraps each unit in an overflow mask and reveals them with a staggered rise. The split
 * is reverted on unmount and re-run when fonts load or the element resizes (autoSplit).
 */
export function SplitTextReveal({
  children,
  as: Tag = 'p',
  type = 'lines',
  trigger = 'scroll',
  stagger,
  duration = 1,
  ease = 'imperial',
  distance = 110,
  rotate = 0,
  mask = true,
  delay = 0,
  repeat = false,
  reducedMotion = 'auto',
  scroller,
  start = 'top 85%',
  end = 'bottom 40%',
  markers,
  className,
  style,
}: SplitTextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion(reducedMotion);
  const easeStr = resolveEase(ease);
  const each = stagger ?? (type === 'lines' ? 0.08 : type === 'words' ? 0.03 : 0.015);

  useGSAP(
    () => {
      registerGsap();
      gsap.registerPlugin(SplitText);
      const el = ref.current;
      if (!el) return;
      if (reduced) {
        gsap.set(el, { autoAlpha: 1 });
        return;
      }
      gsap.set(el, { autoAlpha: 1 });
      const split = SplitText.create(el, {
        type: type === 'lines' ? 'lines' : type === 'words' ? 'lines,words' : 'lines,words,chars',
        mask: mask ? (type === 'lines' ? 'lines' : 'words') : undefined,
        linesClass: 'imperial-split-line',
        wordsClass: 'imperial-split-word',
        charsClass: 'imperial-split-char',
        autoSplit: true,
        onSplit: (self) => {
          const targets =
            type === 'lines' ? self.lines : type === 'words' ? self.words : self.chars;
          const vars: gsap.TweenVars = {
            yPercent: 0,
            rotate: 0,
            autoAlpha: 1,
            duration,
            ease: easeStr,
            stagger: each,
            delay,
          };
          const fromVars: gsap.TweenVars = { yPercent: distance, rotate, autoAlpha: mask ? 1 : 0 };
          if (trigger === 'mount') return gsap.fromTo(targets, fromVars, vars);
          return gsap.fromTo(targets, fromVars, {
            ...vars,
            scrollTrigger: {
              trigger: el,
              scroller,
              start,
              end,
              markers,
              scrub: trigger === 'scrub' ? 0.5 : false,
              toggleActions: repeat ? 'play none none reset' : 'play none none none',
            },
          });
        },
      });
      return () => {
        split.revert();
        ScrollTrigger.refresh();
      };
    },
    {
      dependencies: [
        type,
        trigger,
        each,
        duration,
        easeStr,
        distance,
        rotate,
        mask,
        delay,
        repeat,
        reduced,
        scroller,
        start,
        end,
      ],
      scope: ref,
    },
  );

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ visibility: 'hidden', ...style }}
      data-imperial-effect="split-text-reveal"
    >
      {children}
    </Tag>
  );
}
