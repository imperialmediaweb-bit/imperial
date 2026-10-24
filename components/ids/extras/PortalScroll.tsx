'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { usePinnedProgress } from '../hooks/usePinnedProgress';
import { useReducedMotion, type ReducedMotionMode } from '../hooks/useReducedMotion';
import { portalScale, portalShapes, portalTransform, type PortalShape } from './portalShapes';

export interface PortalScene {
  id: string;
  /** Name for the scene list and announcements. */
  label: string;
  /** The full-screen scene. */
  content: ReactNode;
  /** CSS background of the scene (colour, gradient or `url(...)`). */
  background?: string;
  /** Outline colour of the portal that leads INTO this scene. */
  accent?: string;
  /** Shape of the portal that leads INTO this scene; overrides the component's `shape`. */
  shape?: PortalShape;
}

export interface PortalScrollProps {
  scenes: PortalScene[];
  /** Portal shape between scenes. Default "arch". */
  shape?: PortalShape;
  /** Viewports of scrolling per transition. Default 1.2. */
  distance?: number;
  /** Scrub smoothing in seconds. Default 0.6. */
  scrub?: number;
  /** Settle on whole scenes when scrolling stops. Default true. */
  snap?: boolean;
  /** Show the scene list. Default true. */
  nav?: boolean;
  /** Outline colour of the portals (per-scene `accent` wins). Default the theme accent. */
  accent?: string;
  scroller?: string | HTMLElement;
  reducedMotion?: ReducedMotionMode;
  label?: string;
  onChange?: (index: number) => void;
  className?: string;
  style?: CSSProperties;
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * EXTRA — Portal Scroll
 *
 * Scroll through a sequence of full-screen scenes by walking through a portal: the next
 * scene appears inside a small shape (arch, door, keyhole, circle, diamond, hexagon) that
 * grows with an exponential zoom until it fills the screen, while the current scene leans
 * toward it and dims. Pure DOM + SVG clip paths (no WebGL), so it runs on any phone. The
 * scene list jumps to any scene; reduced motion crossfades instead.
 */
export function PortalScroll({
  scenes,
  shape = 'arch',
  distance = 1.2,
  scrub = 0.6,
  snap = true,
  nav = true,
  accent = 'var(--imperial-accent, #c9a96e)',
  scroller,
  reducedMotion = 'auto',
  label = 'Portal scroll',
  onChange,
  className,
  style,
}: PortalScrollProps) {
  const uid = useId().replace(/:/g, '');
  const reduced = useReducedMotion(reducedMotion);
  const count = scenes.length;
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const activeRef = useRef(0);
  const sizeRef = useRef({ w: 1, h: 1 });
  const [active, setActive] = useState(0);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const shapeOf = useCallback(
    (i: number): PortalShape => scenes[i]?.shape ?? shape,
    [scenes, shape],
  );

  /** Writes every scene's clip, zoom, veil and outline for a progress value. */
  const apply = useCallback(
    (p: number) => {
      const stage = stageRef.current;
      if (!stage) return;
      const { w, h } = sizeRef.current;
      const base = Math.min(count - 1, Math.max(0, Math.floor(p)));
      stage.querySelectorAll<HTMLElement>('[data-portal-scene]').forEach((panel, i) => {
        const inner = panel.querySelector<HTMLElement>('[data-portal-inner]');
        const veil = panel.querySelector<HTMLElement>('[data-portal-veil]');
        const clip = stage.querySelector<SVGPathElement>(`[data-portal-clip="${i}"]`);
        const outline = stage.querySelector<SVGPathElement>(`[data-portal-outline="${i}"]`);
        const tIn = clamp01(p - (i - 1)); // entering this scene
        const tOut = clamp01(p - i); // leaving this scene
        // Only the scene being left and the one coming through the portal are drawn.
        const visible = i === base || (i === base + 1 && tIn > 0);
        panel.style.setProperty('visibility', visible ? 'visible' : 'hidden');
        if (i > 0) {
          if (reduced) {
            panel.style.setProperty('clip-path', 'none');
            panel.style.setProperty('opacity', String(tIn));
          } else if (tIn >= 1) {
            panel.style.setProperty('clip-path', 'none');
            panel.style.setProperty('opacity', '1');
          } else {
            const sh = shapeOf(i);
            const s = portalScale(sh, tIn, w, h);
            clip?.setAttribute('transform', portalTransform(sh, s, w, h));
            panel.style.setProperty('clip-path', `url(#${uid}-clip-${i})`);
            panel.style.setProperty('opacity', '1');
          }
          if (outline) {
            const sh = shapeOf(i);
            outline.setAttribute(
              'transform',
              portalTransform(sh, portalScale(sh, tIn, w, h), w, h),
            );
            const o = reduced
              ? 0
              : tIn <= 0 || tIn >= 1
                ? 0
                : Math.min(1, tIn / 0.06) * (1 - clamp01((tIn - 0.55) / 0.35));
            outline.style.setProperty('opacity', String(o));
          }
        }
        if (inner && !reduced) {
          // Leaving: lean toward the portal. Entering: the new world comes to meet you.
          const zoom = tOut > 0 ? 1 + tOut * 0.35 : i > 0 ? 1.22 - tIn * 0.22 : 1;
          inner.style.setProperty('transform', `scale(${zoom})`);
        }
        if (veil) veil.style.setProperty('opacity', String(reduced ? 0 : tOut * 0.6));
      });
    },
    [count, reduced, shapeOf, uid],
  );

  const report = useCallback(
    (p: number) => {
      progressRef.current = p;
      const i = Math.min(Math.max(0, count - 1), Math.max(0, Math.round(p)));
      if (i === activeRef.current) return;
      activeRef.current = i;
      setActive(i);
      onChangeRef.current?.(i);
    },
    [count],
  );

  const pinned = usePinnedProgress({
    rootRef,
    stageRef,
    count,
    distance,
    scrub,
    snap,
    scroller,
    reduced,
    onProgress: (p) => {
      apply(p);
      report(p);
    },
  });

  // Keep the stage size current for the clip maths.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      sizeRef.current = { w: stage.clientWidth || 1, h: stage.clientHeight || 1 };
      apply(progressRef.current);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [apply]);

  return (
    <section
      ref={rootRef}
      className={className}
      data-imperial-portal-scroll
      data-active-scene={active}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      // No fixed height: the pin spacer around the 100svh stage must push the page down.
      style={{ position: 'relative', ...style }}
    >
      <div
        ref={stageRef}
        data-portal-stage
        style={{
          position: 'relative',
          height: '100svh',
          overflow: 'hidden',
          background: '#050507',
        }}
      >
        <svg aria-hidden width="0" height="0" style={{ position: 'absolute' }} focusable="false">
          <defs>
            {scenes.map((scene, i) =>
              i > 0 ? (
                <clipPath key={scene.id} id={`${uid}-clip-${i}`} clipPathUnits="userSpaceOnUse">
                  <path data-portal-clip={i} d={portalShapes[shapeOf(i)].path} />
                </clipPath>
              ) : null,
            )}
          </defs>
        </svg>
        {scenes.map((scene, i) => {
          const isActive = i === active;
          return (
            <section
              key={scene.id}
              data-portal-scene
              role="group"
              aria-roledescription="scene"
              aria-label={`${i + 1} of ${count}: ${scene.label}`}
              aria-hidden={!isActive}
              inert={!isActive}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: i + 1,
                overflow: 'hidden',
                visibility: i === 0 ? 'visible' : 'hidden',
                background: scene.background ?? '#0b0b0d',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div
                data-portal-inner
                style={{
                  position: 'absolute',
                  inset: 0,
                  transformOrigin: '50% 45%',
                  willChange: 'transform',
                }}
              >
                {scene.content}
              </div>
              <div
                data-portal-veil
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#000',
                  opacity: 0,
                  pointerEvents: 'none',
                }}
              />
            </section>
          );
        })}
        <svg
          aria-hidden
          focusable="false"
          data-portal-outlines
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: count + 2,
            pointerEvents: 'none',
            overflow: 'visible',
          }}
        >
          {scenes.map((scene, i) =>
            i > 0 ? (
              <path
                key={scene.id}
                data-portal-outline={i}
                d={portalShapes[shapeOf(i)].path}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
                style={{
                  color: scene.accent ?? accent,
                  opacity: 0,
                  filter: 'drop-shadow(0 0 10px currentColor)',
                }}
              />
            ) : null,
          )}
        </svg>
        {nav && count > 1 ? (
          <nav data-scene-nav aria-label="Scenes" style={{ zIndex: count + 3 }}>
            <ol>
              {scenes.map((scene, i) => (
                <li key={scene.id}>
                  <button
                    type="button"
                    data-active={i === active || undefined}
                    aria-current={i === active ? 'step' : undefined}
                    onClick={() => pinned.goTo(i)}
                  >
                    <span data-scene-nav-dot aria-hidden />
                    <span data-scene-nav-label>{scene.label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <div
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            overflow: 'hidden',
            clip: 'rect(0 0 0 0)',
            whiteSpace: 'nowrap',
          }}
        >
          {scenes[active] ? `Scene ${active + 1} of ${count}: ${scenes[active]!.label}` : ''}
        </div>
      </div>
    </section>
  );
}
