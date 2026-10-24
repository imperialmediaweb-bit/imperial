'use client';

import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { ThreeCanvas, type ThreeCanvasProps } from '../core/ThreeCanvas';
import type { QualitySettings } from '../core/quality';
import { createRandom } from '../core/random';
import {
  dustFragment,
  dustVertex,
  glowFragment,
  glowVertex,
  haloFragment,
  haloVertex,
} from './shaders';

export interface GlowingOrbitalRingProps extends Pick<
  ThreeCanvasProps,
  'quality' | 'reducedMotion' | 'className' | 'style' | 'fallback' | 'label' | 'pauseWhenHidden'
> {
  /** Primary ring colour (CSS/hex). Default gold. */
  color?: string;
  /** Secondary tint used in the halo centre. Default deep blue. */
  secondaryColor?: string;
  /** Rotation speed multiplier (0–3). Default 1. */
  speed?: number;
  /** Glow intensity (0–2). Default 1. */
  intensity?: number;
  /** Ring tilt in radians. Default 1.05. */
  tilt?: number;
  /** Orbiting dust particle count at full quality. Default 600. */
  particleCount?: number;
  /** Follow the pointer with a subtle parallax. Default true. */
  interactive?: boolean;
  /** Ring radius in scene units. Default 2.2. */
  radius?: number;
  /** Background colour (set to "transparent" to overlay). Default #050507. */
  background?: string;
  /** Extra scene content. */
  children?: ReactNode;
}

interface SceneProps {
  color: string;
  secondaryColor: string;
  speed: number;
  intensity: number;
  tilt: number;
  particleCount: number;
  interactive: boolean;
  radius: number;
  quality: QualitySettings;
  reduced: boolean;
  children?: ReactNode;
}

function buildDustGeometry(count: number, radius: number): THREE.BufferGeometry {
  const rand = createRandom(1337 + count);
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const offsets = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2;
    const r = radius + (rand() - 0.5) * radius * 0.28;
    const y = (rand() - 0.5) * radius * 0.16;
    positions[i * 3] = Math.cos(a) * r;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(a) * r;
    sizes[i] = 0.6 + rand() * 1.6;
    offsets[i] = rand();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  g.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  g.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 1));
  return g;
}

function RingScene({
  color,
  secondaryColor,
  speed,
  intensity,
  tilt,
  particleCount,
  interactive,
  radius,
  quality,
  reduced,
  children,
}: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const dust = useRef<THREE.Points>(null);
  const haloMat = useRef<THREE.ShaderMaterial>(null);
  const dustMat = useRef<THREE.ShaderMaterial>(null);
  const { pointer, viewport } = useThree();

  const primary = useMemo(() => new THREE.Color(color), [color]);
  const secondary = useMemo(() => new THREE.Color(secondaryColor), [secondaryColor]);
  const tube = radius * 0.016;

  const glowUniforms = useMemo(
    () => ({
      uColor: { value: primary },
      uIntensity: { value: 1.6 * intensity },
      uPower: { value: 1.8 },
    }),
    [primary, intensity],
  );
  const outerGlowUniforms = useMemo(
    () => ({
      uColor: { value: primary },
      uIntensity: { value: 0.55 * intensity },
      uPower: { value: 2.6 },
    }),
    [primary, intensity],
  );
  const haloUniforms = useMemo(
    () => ({
      uColor: { value: primary },
      uColor2: { value: secondary },
      uTime: { value: 0 },
      uIntensity: { value: 0.9 * intensity },
    }),
    [primary, secondary, intensity],
  );
  const dustUniforms = useMemo(
    () => ({
      uColor: { value: primary },
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(quality.dpr[1], 2) },
    }),
    [primary, quality.dpr],
  );

  // Particles scattered in a torus-shaped band around the ring (seeded, so renders are deterministic).
  const dustGeometry = useMemo(
    () => buildDustGeometry(Math.max(40, Math.round(particleCount * quality.budget)), radius),
    [particleCount, quality.budget, radius],
  );
  useEffect(() => () => dustGeometry.dispose(), [dustGeometry]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (haloMat.current) haloMat.current.uniforms.uTime!.value = t;
    if (dustMat.current) dustMat.current.uniforms.uTime!.value = t;
    if (reduced) return;
    const dt = Math.min(delta, 1 / 30);
    if (inner.current) inner.current.rotation.y += dt * 0.25 * speed;
    if (dust.current) dust.current.rotation.y -= dt * 0.12 * speed;
    if (group.current) {
      const targetX = tilt + (interactive ? pointer.y * -0.18 : 0) + Math.sin(t * 0.35) * 0.04;
      const targetZ = (interactive ? pointer.x * 0.22 : 0) + Math.cos(t * 0.27) * 0.05;
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 3, dt);
      group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, targetZ, 3, dt);
    }
  });

  const haloSize = Math.max(viewport.width, viewport.height) * 1.1;

  return (
    <>
      <color attach="background" args={['#050507']} />
      <fog attach="fog" args={['#050507', 6, 16]} />
      <ambientLight intensity={0.15} />
      <pointLight
        position={[0, 0, 0]}
        color={primary}
        intensity={6 * intensity}
        distance={12}
        decay={2}
      />
      <pointLight
        position={[radius * 1.6, radius * 0.8, radius]}
        color={secondary}
        intensity={2}
        distance={14}
        decay={2}
      />

      <Billboard position={[0, 0, -radius * 0.6]}>
        <mesh scale={[haloSize, haloSize, 1]}>
          <planeGeometry args={[1, 1]} />
          <shaderMaterial
            ref={haloMat}
            vertexShader={haloVertex}
            fragmentShader={haloFragment}
            uniforms={haloUniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </Billboard>

      <group ref={group} rotation={[tilt, 0, 0]}>
        <group ref={inner}>
          {/* Core luminous ring */}
          <mesh>
            <torusGeometry args={[radius, tube, 32, 220]} />
            <meshStandardMaterial
              color={primary}
              emissive={primary}
              emissiveIntensity={3 * intensity}
              toneMapped={false}
              roughness={0.25}
              metalness={0.6}
            />
          </mesh>
          {/* Fresnel glow sleeves (fake bloom without post-processing) */}
          <mesh>
            <torusGeometry args={[radius, tube * 7, 32, 160]} />
            <shaderMaterial
              vertexShader={glowVertex}
              fragmentShader={glowFragment}
              uniforms={glowUniforms}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh>
            <torusGeometry args={[radius, tube * 18, 24, 120]} />
            <shaderMaterial
              vertexShader={glowVertex}
              fragmentShader={glowFragment}
              uniforms={outerGlowUniforms}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* Thin secondary orbit for depth */}
          <mesh rotation={[0.35, 0, 0.2]} scale={1.28}>
            <torusGeometry args={[radius, tube * 0.45, 16, 200]} />
            <meshBasicMaterial color={secondary} transparent opacity={0.35} toneMapped={false} />
          </mesh>
        </group>
        <points ref={dust} geometry={dustGeometry}>
          <shaderMaterial
            ref={dustMat}
            vertexShader={dustVertex}
            fragmentShader={dustFragment}
            uniforms={dustUniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
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
        'radial-gradient(circle at 50% 55%, rgba(201,169,110,0.35) 0%, rgba(201,169,110,0.08) 22%, transparent 45%), radial-gradient(circle at 50% 55%, transparent 30%, rgba(201,169,110,0.5) 31%, transparent 33%), #050507',
    }}
  />
);

/**
 * 3D 01 — Glowing Orbital Ring
 *
 * A luminous orbital ring with layered fresnel glow, an atmospheric shader halo,
 * orbiting dust particles and smooth damped rotation that follows the pointer.
 */
export function GlowingOrbitalRing({
  color = '#c9a96e',
  secondaryColor = '#3b5bdb',
  speed = 1,
  intensity = 1,
  tilt = 1.05,
  particleCount = 600,
  interactive = true,
  radius = 2.2,
  background = '#050507',
  children,
  fallback = defaultFallback,
  label = 'Glowing orbital ring, a luminous 3D ring rotating slowly in space',
  ...canvas
}: GlowingOrbitalRingProps) {
  return (
    <ThreeCanvas
      {...canvas}
      fallback={fallback}
      label={label}
      background={background}
      camera={{ position: [0, 0.7, 9.2], fov: 40, near: 0.1, far: 40 }}
    >
      {({ quality, reduced }) => (
        <RingScene
          color={color}
          secondaryColor={secondaryColor}
          speed={speed}
          intensity={intensity}
          tilt={tilt}
          particleCount={particleCount}
          interactive={interactive && !reduced}
          radius={radius}
          quality={quality}
          reduced={reduced}
        >
          {children}
        </RingScene>
      )}
    </ThreeCanvas>
  );
}
