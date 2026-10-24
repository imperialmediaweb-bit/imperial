'use client';

import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ThreeCanvas, type ThreeCanvasProps } from '../core/ThreeCanvas';
import type { QualitySettings } from '../core/quality';
import { createRandom } from '../core/random';

export interface FloatingRocksProps extends Pick<
  ThreeCanvasProps,
  'quality' | 'reducedMotion' | 'className' | 'style' | 'fallback' | 'label' | 'pauseWhenHidden'
> {
  /** Number of fragments at full quality. Default 28. */
  count?: number;
  /** Spread radius in scene units. Default 7. */
  spread?: number;
  /** Base fragment size. Default 0.6. */
  size?: number;
  /** Drift/rotation speed multiplier. Default 1. */
  speed?: number;
  /** How far fragments bob vertically. Default 0.4. */
  drift?: number;
  /** Surface roughness of the stone. Default 0.85. */
  roughness?: number;
  color?: string;
  /** Accent light colour. Default gold. */
  accent?: string;
  /** Pointer parallax on the whole field. Default true. */
  interactive?: boolean;
  /** Random seed for the layout. Default 7. */
  seed?: number;
  background?: string;
  children?: ReactNode;
}

interface RockSpec {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  variant: number;
  phase: number;
  spin: [number, number, number];
}

/** Displace an icosahedron's vertices radially with seeded noise to make a rock. */
function makeRockGeometry(rand: () => number, detail = 1): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(1, detail);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  const seen = new Map<string, number>();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const key = `${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}`;
    let f = seen.get(key);
    if (f === undefined) {
      f = 0.72 + rand() * 0.5;
      seen.set(key, f);
    }
    v.multiplyScalar(f);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

function RocksScene({
  count,
  spread,
  size,
  speed,
  drift,
  roughness,
  color,
  accent,
  interactive,
  seed,
  quality,
  reduced,
  children,
}: Required<
  Pick<
    FloatingRocksProps,
    | 'count'
    | 'spread'
    | 'size'
    | 'speed'
    | 'drift'
    | 'roughness'
    | 'color'
    | 'accent'
    | 'interactive'
    | 'seed'
  >
> & { quality: QualitySettings; reduced: boolean; children?: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const n = Math.max(4, Math.round(count * quality.budget));

  const geometries = useMemo(() => {
    const rand = createRandom(seed * 31 + 1);
    return Array.from({ length: 6 }, (_, i) =>
      makeRockGeometry(rand, quality.level === 'low' ? 0 : i % 2 === 0 ? 1 : 2),
    );
  }, [seed, quality.level]);
  useEffect(() => () => geometries.forEach((g) => g.dispose()), [geometries]);

  const rocks = useMemo<RockSpec[]>(() => {
    const rand = createRandom(seed);
    return Array.from({ length: n }, (_, i) => {
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * spread;
      return {
        position: [
          Math.cos(a) * r,
          (rand() - 0.5) * spread * 0.9,
          Math.sin(a) * r - rand() * spread * 0.4,
        ],
        rotation: [rand() * Math.PI, rand() * Math.PI, rand() * Math.PI],
        scale: size * (0.35 + rand() * 1.3) * (i % 7 === 0 ? 1.8 : 1),
        variant: Math.floor(rand() * 6),
        phase: rand() * Math.PI * 2,
        spin: [(rand() - 0.5) * 0.4, (rand() - 0.5) * 0.4, (rand() - 0.5) * 0.3],
      };
    });
  }, [n, spread, size, seed]);

  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.08, flatShading: true }),
    [color, roughness],
  );
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state, delta) => {
    if (reduced) return;
    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime * speed;
    const g = group.current;
    if (!g) return;
    g.children.forEach((child, i) => {
      const spec = rocks[i];
      if (!spec) return;
      child.position.y = spec.position[1] + Math.sin(t * 0.6 + spec.phase) * drift;
      child.position.x = spec.position[0] + Math.cos(t * 0.35 + spec.phase) * drift * 0.35;
      child.rotation.x += spec.spin[0] * dt * speed;
      child.rotation.y += spec.spin[1] * dt * speed;
      child.rotation.z += spec.spin[2] * dt * speed;
    });
    if (interactive) {
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, pointer.x * 0.18, 2.5, dt);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -pointer.y * 0.12, 2.5, dt);
    }
  });

  return (
    <>
      <fog attach="fog" args={['#06060a', 6, 22]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 8, 4]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-6, -2, -4]} intensity={1.2} color="#6b7fff" />
      <pointLight position={[0, -3, 3]} intensity={6} color={accent} distance={14} decay={2} />
      <group ref={group}>
        {rocks.map((r, i) => (
          <mesh
            key={i}
            geometry={geometries[r.variant]}
            material={material}
            position={r.position}
            rotation={r.rotation}
            scale={r.scale}
            castShadow={false}
            receiveShadow={false}
          />
        ))}
      </group>
      {children}
    </>
  );
}

const defaultFallback = (
  <div
    aria-hidden
    style={{
      position: 'absolute',
      inset: 0,
      background:
        'radial-gradient(60% 50% at 50% 60%, rgba(201,169,110,0.18), transparent 60%), #06060a',
    }}
  />
);

/**
 * 3D 02 — Floating Rocks
 *
 * Procedural stone fragments (seeded, vertex-displaced icosahedra from a small pool of
 * variants sharing one material) drifting and tumbling independently in a lit, fogged
 * field with pointer parallax. Fragment count scales with the quality budget.
 */
export function FloatingRocks({
  count = 28,
  spread = 7,
  size = 0.6,
  speed = 1,
  drift = 0.4,
  roughness = 0.85,
  color = '#8d8a84',
  accent = '#c9a96e',
  interactive = true,
  seed = 7,
  background = '#06060a',
  children,
  fallback = defaultFallback,
  label = 'Floating stone fragments drifting in space',
  ...canvas
}: FloatingRocksProps) {
  return (
    <ThreeCanvas
      {...canvas}
      fallback={fallback}
      label={label}
      background={background}
      camera={{ position: [0, 0.5, 11], fov: 45, near: 0.1, far: 60 }}
    >
      {({ quality, reduced }) => (
        <>
          <color attach="background" args={[background]} />
          <RocksScene
            count={count}
            spread={spread}
            size={size}
            speed={speed}
            drift={drift}
            roughness={roughness}
            color={color}
            accent={accent}
            interactive={interactive && !reduced}
            seed={seed}
            quality={quality}
            reduced={reduced}
          >
            {children}
          </RocksScene>
        </>
      )}
    </ThreeCanvas>
  );
}
