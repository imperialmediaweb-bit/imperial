"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import type { Group } from "three";

// Cristalul de obsidian 3D — piesa centrală a primului slide. Negru lucios,
// luminat din 3 părți cu culorile brandului (foc / magenta / violet), se
// rotește lent și se apleacă după mouse.

function Gem({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const g = useRef<Group>(null);
  useFrame((_, dt) => {
    if (!g.current) return;
    g.current.rotation.y += dt * 0.25;
    // înclinare lină după mouse
    g.current.rotation.x += (mouse.current.y * 0.35 - g.current.rotation.x) * 0.05;
    g.current.rotation.z += (mouse.current.x * 0.2 - g.current.rotation.z) * 0.05;
  });
  return (
    <group ref={g}>
      {/* corpul principal — low-poly, fațete mari */}
      <mesh>
        <icosahedronGeometry args={[1.35, 0]} />
        <meshPhysicalMaterial
          color="#2b2338"
          metalness={0.35}
          roughness={0.28}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive="#3d1458"
          emissiveIntensity={0.55}
          flatShading
        />
      </mesh>
      {/* muchii luminoase — neonul e intenționat, piesa de design */}
      <mesh scale={1.004}>
        <icosahedronGeometry args={[1.35, 0]} />
        <meshBasicMaterial color="#FF2E9A" wireframe transparent opacity={0.55} />
      </mesh>
      <mesh scale={1.06}>
        <icosahedronGeometry args={[1.35, 0]} />
        <meshBasicMaterial color="#FF6B1A" wireframe transparent opacity={0.1} />
      </mesh>
      {/* lumina din interiorul cristalului */}
      <pointLight position={[0, 0, 0]} intensity={18} color="#FF2E9A" distance={6} />
      {/* cioburi satelit */}
      <mesh position={[1.9, 0.7, -0.4]} scale={0.28}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial color="#0a0a10" metalness={0.9} roughness={0.15} clearcoat={1} flatShading />
      </mesh>
      <mesh position={[-1.7, -0.9, 0.3]} scale={0.2}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial color="#0a0a10" metalness={0.9} roughness={0.15} clearcoat={1} flatShading />
      </mesh>
    </group>
  );
}

export function Crystal3D() {
  const mouse = useRef({ x: 0, y: 0 });
  return (
    <div
      className="h-full w-full"
      onPointerMove={(e) => {
        const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        mouse.current = {
          x: ((e.clientX - r.left) / r.width - 0.5) * 2,
          y: ((e.clientY - r.top) / r.height - 0.5) * 2,
        };
      }}
    >
      <Canvas camera={{ position: [0, 0, 4.6], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          {/* luminile brandului */}
          <ambientLight intensity={0.5} />
          <hemisphereLight args={["#B06CFF", "#FF6B1A", 1.2]} />
          <directionalLight position={[-4, -2, 3]} intensity={6} color="#FF6B1A" />
          <directionalLight position={[4, 3, 2]} intensity={5} color="#8B2FF7" />
          <pointLight position={[0, 2.5, 3.5]} intensity={40} color="#FF2E9A" distance={14} />
          <pointLight position={[-2.5, -1.5, 2.5]} intensity={30} color="#FF6B1A" distance={12} />
          <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.9}>
            <Gem mouse={mouse} />
          </Float>
          {/* pulbere de scântei în jur */}
          <Sparkles count={70} scale={6} size={2.2} speed={0.35} color="#FFB020" opacity={0.7} />
          <Sparkles count={40} scale={7} size={1.8} speed={0.25} color="#B06CFF" opacity={0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Crystal3D;
