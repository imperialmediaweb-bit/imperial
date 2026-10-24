'use client';

import { useMemo, useRef, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react';
import { Canvas, type CanvasProps } from '@react-three/fiber';
import {
  useInView,
  useReducedMotion,
  usePageVisibility,
  type ReducedMotionMode,
} from '../../hooks';
import { detectWebGL } from '../../webgl/detectWebGL';
import { resolveQuality, type QualityPreset, type QualitySettings } from './quality';

export interface ThreeCanvasProps extends Omit<
  CanvasProps,
  'children' | 'frameloop' | 'dpr' | 'fallback'
> {
  children: ReactNode | ((ctx: { quality: QualitySettings; reduced: boolean }) => ReactNode);
  /** Shown when WebGL is unavailable. */
  fallback?: ReactNode;
  /** Shown while the WebGL check runs on the client (default: nothing). */
  loading?: ReactNode;
  quality?: QualityPreset;
  reducedMotion?: ReducedMotionMode;
  /** Pause the render loop when scrolled out of view / tab hidden. Default true. */
  pauseWhenHidden?: boolean;
  /** Background colour of the wrapper element. */
  background?: string;
  className?: string;
  style?: CSSProperties;
  /** Accessible description of the scene (rendered for screen readers). */
  label?: string;
}

const noopSubscribe = () => () => {};
const getWebGLSnapshot = () => detectWebGL().supported;
const getServerSnapshot = (): boolean | null => null;

/**
 * Opinionated R3F canvas: WebGL detection with fallback, quality presets,
 * reduced-motion handling (single static frame) and render-loop pausing when
 * off-screen or in a hidden tab. Import via `next/dynamic` with `ssr: false`.
 */
export function ThreeCanvas({
  children,
  fallback = null,
  loading = null,
  quality = 'auto',
  reducedMotion = 'auto',
  pauseWhenHidden = true,
  background = 'transparent',
  className,
  style,
  label,
  gl,
  ...canvasProps
}: ThreeCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  // null during SSR/hydration, then the memoised client-side detection result.
  const support = useSyncExternalStore(noopSubscribe, getWebGLSnapshot, getServerSnapshot);
  const reduced = useReducedMotion(reducedMotion);
  const inView = useInView(wrapperRef, { rootMargin: '120px' });
  const visible = usePageVisibility();
  const q = useMemo(() => resolveQuality(quality), [quality]);

  const running = !pauseWhenHidden || (inView && visible);
  const frameloop: 'always' | 'demand' | 'never' = reduced
    ? 'demand'
    : running
      ? 'always'
      : 'never';

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%', background, ...style }}
      role={label ? 'img' : undefined}
      aria-label={label}
      data-imperial-three
      data-quality={q.level}
    >
      {support === null ? loading : null}
      {support === false ? fallback : null}
      {support ? (
        <Canvas
          frameloop={frameloop}
          dpr={q.dpr}
          gl={{ antialias: q.antialias, alpha: true, powerPreference: 'high-performance', ...gl }}
          style={{ position: 'absolute', inset: 0 }}
          {...canvasProps}
        >
          {typeof children === 'function' ? children({ quality: q, reduced }) : children}
        </Canvas>
      ) : null}
    </div>
  );
}
