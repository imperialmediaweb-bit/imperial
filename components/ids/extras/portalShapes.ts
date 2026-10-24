/**
 * Portal shapes for PortalScroll, in unit coordinates centred on (0, 0), y pointing down
 * (SVG). `focus` is the point the zoom heads for, `inner` the radius of the largest circle
 * around it that stays inside the shape: the zoom ends once that circle covers the screen.
 */
export type PortalShape = 'arch' | 'door' | 'keyhole' | 'circle' | 'diamond' | 'hexagon';

export interface PortalShapeDef {
  path: string;
  focus: [number, number];
  inner: number;
}

export const portalShapes: Record<PortalShape, PortalShapeDef> = {
  arch: {
    path: 'M-0.28 0.45 L-0.28 -0.17 A0.28 0.28 0 0 1 0.28 -0.17 L0.28 0.45 Z',
    focus: [0, -0.17],
    inner: 0.28,
  },
  door: {
    path: 'M-0.26 0.45 L-0.26 -0.42 Q-0.26 -0.45 -0.23 -0.45 L0.23 -0.45 Q0.26 -0.45 0.26 -0.42 L0.26 0.45 Z',
    focus: [0, 0],
    inner: 0.26,
  },
  keyhole: {
    path: 'M-0.07 -0.016 A0.16 0.16 0 1 1 0.07 -0.016 L0.14 0.4 L-0.14 0.4 Z',
    focus: [0, -0.16],
    inner: 0.16,
  },
  circle: {
    path: 'M0 -0.5 A0.5 0.5 0 1 1 0 0.5 A0.5 0.5 0 1 1 0 -0.5 Z',
    focus: [0, 0],
    inner: 0.5,
  },
  diamond: {
    path: 'M0 -0.5 L0.5 0 L0 0.5 L-0.5 0 Z',
    focus: [0, 0],
    inner: 0.3535,
  },
  hexagon: {
    path: 'M0 -0.5 L0.433 -0.25 L0.433 0.25 L0 0.5 L-0.433 0.25 L-0.433 -0.25 Z',
    focus: [0, 0],
    inner: 0.433,
  },
};

/**
 * Scale (in px per unit) of the portal at transition progress `t` for a `w`×`h` stage:
 * an exponential zoom from a small opening to the size where the inner circle covers the
 * whole stage, so the growth feels like walking at a steady pace.
 */
export function portalScale(shape: PortalShape, t: number, w: number, h: number): number {
  const def = portalShapes[shape];
  const start = Math.min(w, h) * 0.16;
  const end = (Math.hypot(w, h) / 2 / def.inner) * 1.04;
  const x = t < 0 ? 0 : t > 1 ? 1 : t;
  return start * Math.pow(end / start, x);
}

/** SVG transform placing the shape's focus at the stage centre at scale `s`. */
export function portalTransform(shape: PortalShape, s: number, w: number, h: number): string {
  const [fx, fy] = portalShapes[shape].focus;
  return `translate(${w / 2} ${h / 2}) scale(${s}) translate(${-fx} ${-fy})`;
}
