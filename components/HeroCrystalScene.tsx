"use client";

// Scena 3D din hero (cioburi + cristal) — fișier separat, ca motorul 3D să se descarce
// doar pe desktop și doar după prima interacțiune, nu odată cu pagina.

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import type { Group } from "three";
import { FloatingRocks } from "./ids/three/rocks/FloatingRocks";

/* conținut 3D suplimentar: cristalul central glossy + wireframe (igloo + basement) */
function CrystalCore() {
  const g = useRef<Group>(null);
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * 0.35;
  });
  return (
    <>
      <group ref={g} position={[2.9, 0.3, 2]}>
      {/* cristalul central — obsidian lucios cu reflexe */}
      <mesh rotation={[0.4, 0.8, 0.1]}>
        <icosahedronGeometry args={[2, 0]} />
        <meshPhysicalMaterial
          color="#1a1424"
          metalness={0.45}
          roughness={0.07}
          clearcoat={1}
          clearcoatRoughness={0.05}
          emissive="#3a1245"
          emissiveIntensity={0.55}
          flatShading
        />
      </mesh>
      {/* muchiile neon ale cristalului */}
      <mesh rotation={[0.4, 0.8, 0.1]} scale={1.004}>
        <icosahedronGeometry args={[2, 0]} />
        <meshBasicMaterial color="#FF2E9A" wireframe transparent opacity={0.6} />
      </mesh>
      {/* lumina din interiorul cristalului */}
      <pointLight position={[0, 0, 0]} intensity={24} color="#FF2E9A" distance={8} />
      </group>
      {/* pulbere de scântei aurii + violete prin toată scena */}
      <Sparkles count={120} scale={14} size={2.4} speed={0.5} color="#FFB020" opacity={0.75} />
      <Sparkles count={70} scale={16} size={2} speed={0.35} color="#B06CFF" opacity={0.55} />
      {/* gridul wireframe de sub scenă — basement vibe */}
      <gridHelper args={[60, 48, "#3a1430", "#160a1c"]} position={[0, -4.2, 0]} />
      {/* lumini suplimentare în culorile brandului */}
      <pointLight position={[4, 2, 4]} intensity={30} color="#FF2E9A" distance={16} />
      <pointLight position={[-5, -1, 3]} intensity={22} color="#FF6B1A" distance={16} />
      <pointLight position={[0, 4, -3]} intensity={18} color="#8B2FF7" distance={18} />
    </>
  );
}

export default function HeroCrystalScene() {
  return (
    <FloatingRocks
      count={36}
      spread={8}
      size={0.7}
      speed={1.25}
      drift={0.8}
      roughness={0.12}
      color="#2a2236"
      accent="#FF2E9A"
      background="#050507"
      quality="medium"
      style={{ position: "absolute", inset: 0 }}
      label="Cioburi de obsidian lucios plutind în spațiu"
    >
      <CrystalCore />
    </FloatingRocks>
  );
}
