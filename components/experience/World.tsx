"use client";

/**
 * Lumea 3D a Experienței Imperial — un singur canvas persistent prin care
 * camera călătorește la scroll (stil igloo.inc): câmpul de cioburi → tunelul
 * de lumină → galeria-portal cu proiectele → firul procesului → cristalul final.
 * Breakpoint-urile camerei vin din DOM (Experience.tsx) ca perechi p→z.
 */

import { useMemo, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, useTexture } from "@react-three/drei";
import * as THREE from "three";

export type CameraMap = { ps: number[]; zs: number[] };

const BRAND = ["#FF6B1A", "#FF2E9A", "#8B2FF7"] as const;

function zAt(map: CameraMap, p: number) {
  const { ps, zs } = map;
  if (p <= ps[0]) return zs[0];
  for (let i = 1; i < ps.length; i++) {
    if (p <= ps[i]) {
      const t = (p - ps[i - 1]) / (ps[i] - ps[i - 1] || 1);
      return zs[i - 1] + (zs[i] - zs[i - 1]) * t;
    }
  }
  return zs[zs.length - 1];
}

function CameraRig({
  progressRef,
  mapRef,
}: {
  progressRef: React.MutableRefObject<number>;
  mapRef: React.MutableRefObject<CameraMap>;
}) {
  const smooth = useRef({ z: 8, x: 0, y: 0 });
  useFrame(({ camera, pointer }, dt) => {
    const p = progressRef.current;
    const targetZ = zAt(mapRef.current, p);
    // legănare fină pe traseu + parallax la mouse
    const swayX = Math.sin(p * Math.PI * 5) * 0.9 + pointer.x * 0.55;
    const swayY = Math.cos(p * Math.PI * 3.3) * 0.45 + pointer.y * 0.35;
    const k = 1 - Math.pow(0.0001, dt); // damp indep. de framerate
    smooth.current.z += (targetZ - smooth.current.z) * k;
    smooth.current.x += (swayX - smooth.current.x) * k * 0.8;
    smooth.current.y += (swayY - smooth.current.y) * k * 0.8;
    camera.position.set(smooth.current.x, smooth.current.y, smooth.current.z);
    camera.lookAt(smooth.current.x * 0.35, smooth.current.y * 0.25, smooth.current.z - 9);
  });
  return null;
}

/* ───── Capitolul 1: câmpul de cioburi + cristalul (z 4 … −20) ───── */
function ShardField() {
  const shards = useMemo(() => {
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    return Array.from({ length: 44 }, (_, i) => ({
      pos: [
        rnd(-7, 7) + (Math.abs(rnd(-1, 1)) < 0.35 ? rnd(3, 5) * Math.sign(rnd(-1, 1)) : 0),
        rnd(-4, 4),
        rnd(-20, 3),
      ] as [number, number, number],
      rot: [rnd(0, Math.PI), rnd(0, Math.PI), 0] as [number, number, number],
      s: rnd(0.25, 1.1),
      detail: i % 3,
    }));
  }, []);
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!g.current) return;
    g.current.children.forEach((m, i) => {
      m.rotation.x += 0.0006 * ((i % 3) + 1);
      m.rotation.y += 0.0008 * ((i % 2) + 1);
      m.position.y += Math.sin(clock.elapsedTime * 0.5 + i) * 0.0012;
    });
  });
  return (
    <group>
      <group ref={g}>
        {shards.map((s, i) => (
          <mesh key={i} position={s.pos} rotation={s.rot} scale={s.s}>
            {s.detail === 0 ? <icosahedronGeometry args={[1, 0]} /> : s.detail === 1 ? <tetrahedronGeometry args={[1, 0]} /> : <octahedronGeometry args={[1, 0]} />}
            <meshPhysicalMaterial color="#0d0b12" metalness={0.5} roughness={0.12} clearcoat={1} clearcoatRoughness={0.06} flatShading />
          </mesh>
        ))}
      </group>
      {/* cristalul-far cu muchii neon */}
      <group position={[2.8, 0.3, -8]}>
        <mesh rotation={[0.4, 0.8, 0.1]}>
          <icosahedronGeometry args={[2, 0]} />
          <meshPhysicalMaterial color="#1a1424" metalness={0.45} roughness={0.07} clearcoat={1} clearcoatRoughness={0.05} emissive="#3a1245" emissiveIntensity={0.55} flatShading />
        </mesh>
        <mesh rotation={[0.4, 0.8, 0.1]} scale={1.004}>
          <icosahedronGeometry args={[2, 0]} />
          <meshBasicMaterial color="#FF2E9A" wireframe transparent opacity={0.55} />
        </mesh>
        <pointLight intensity={22} color="#FF2E9A" distance={9} />
      </group>
      <pointLight position={[4, 2, -2]} intensity={26} color="#FF2E9A" distance={16} />
      <pointLight position={[-5, -1, -6]} intensity={20} color="#FF6B1A" distance={16} />
      <pointLight position={[0, 4, -14]} intensity={16} color="#8B2FF7" distance={18} />
      <Sparkles count={110} scale={[16, 10, 26]} position={[0, 0, -8]} size={2.2} speed={0.45} color="#FFB020" opacity={0.7} />
      <Sparkles count={60} scale={[16, 10, 26]} position={[0, 0, -8]} size={1.8} speed={0.3} color="#B06CFF" opacity={0.5} />
    </group>
  );
}

/* ───── Capitolul 2: tunelul de lumină (z −26 … −64) ───── */
function Tunnel() {
  const rings = useMemo(
    () => Array.from({ length: 26 }, (_, i) => ({ z: -26 - i * 1.5, c: BRAND[i % 3], r: 3.1 + Math.sin(i * 0.7) * 0.25 })),
    []
  );
  const streaks = useMemo(() => {
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    return Array.from({ length: 46 }, () => {
      const a = rnd(0, Math.PI * 2);
      return { x: Math.cos(a) * 2.85, y: Math.sin(a) * 2.85, z: rnd(-64, -26), c: BRAND[(Math.random() * 3) | 0], l: rnd(0.5, 1.6) };
    });
  }, []);
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!g.current) return;
    g.current.children.forEach((m, i) => (m.rotation.z += dt * 0.12 * (i % 2 ? 1 : -1)));
  });
  return (
    <group>
      <group ref={g}>
        {rings.map((r, i) => (
          <mesh key={i} position={[0, 0, r.z]}>
            <torusGeometry args={[r.r, 0.032, 8, 64]} />
            <meshBasicMaterial color={r.c} transparent opacity={0.85} />
          </mesh>
        ))}
      </group>
      {streaks.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, s.l, 5]} />
          <meshBasicMaterial color={s.c} transparent opacity={0.65} />
        </mesh>
      ))}
      <pointLight position={[0, 0, -38]} intensity={26} color="#FF2E9A" distance={20} />
      <pointLight position={[0, 0, -56]} intensity={22} color="#8B2FF7" distance={20} />
      <Sparkles count={90} scale={[5, 5, 40]} position={[0, 0, -45]} size={1.6} speed={0.6} color="#FF9ADF" opacity={0.6} />
    </group>
  );
}

/* ───── Capitolul 3: galeria-portal cu proiectele (z −74 … −114) ───── */
const SHOTS = [
  "/proiecte/clinica-sf-gheorghe/home.jpg",
  "/proiecte/sarami/home.jpg",
  "/proiecte/teona-ariana/home.jpg",
  "/proiecte/clinica-sf-gheorghe/programare.jpg",
  "/proiecte/sarami/editare-video.jpg",
  "/proiecte/clinica-sf-gheorghe/mobil.jpg",
];

function GalleryInner() {
  const textures = useTexture(SHOTS);
  textures.forEach((t) => {
    t.colorSpace = THREE.SRGBColorSpace;
  });
  return (
    <group>
      {textures.map((tex, i) => {
        const left = i % 2 === 0;
        const z = -75 - i * 8;
        const x = left ? -2.75 : 2.75;
        const c = BRAND[i % 3];
        return (
          <group key={i} position={[x, Math.sin(i) * 0.5, z]} rotation={[0, left ? 0.42 : -0.42, 0]}>
            {/* rama de lumină */}
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[4.85, 3.12]} />
              <meshBasicMaterial color={c} transparent opacity={0.8} />
            </mesh>
            <mesh>
              <planeGeometry args={[4.7, 2.97]} />
              <meshBasicMaterial map={tex} toneMapped={false} />
            </mesh>
            <pointLight position={[0, 0, 1.6]} intensity={9} color={c} distance={6} />
          </group>
        );
      })}
      <Sparkles count={70} scale={[10, 7, 48]} position={[0, 0, -94]} size={1.7} speed={0.35} color="#FFB020" opacity={0.5} />
    </group>
  );
}
function Gallery() {
  return (
    <Suspense fallback={null}>
      <GalleryInner />
    </Suspense>
  );
}

/* ───── Capitolul 4: firul procesului (z −119 … −141) ───── */
const NODE_COLORS = ["#FF9A1A", "#FF2E9A", "#B04CF7", "#8B2FF7"] as const;
function Thread() {
  const { tube, nodes } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.4, -1.1, -119),
      new THREE.Vector3(1.8, 0.6, -126),
      new THREE.Vector3(-1.6, 1.2, -133),
      new THREE.Vector3(2.2, -0.6, -141),
    ]);
    const tube = new THREE.TubeGeometry(curve, 120, 0.028, 8, false);
    const nodes = [0.04, 0.36, 0.66, 0.96].map((t) => curve.getPoint(t));
    return { tube, nodes };
  }, []);
  return (
    <group>
      <mesh geometry={tube}>
        <meshBasicMaterial color="#FF2E9A" transparent opacity={0.9} />
      </mesh>
      {nodes.map((p, i) => (
        <group key={i} position={p}>
          <mesh>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshBasicMaterial color={NODE_COLORS[i]} />
          </mesh>
          <pointLight intensity={10} color={NODE_COLORS[i]} distance={6} />
        </group>
      ))}
      <Sparkles count={40} scale={[8, 6, 26]} position={[0, 0, -130]} size={1.5} speed={0.3} color="#FF9ADF" opacity={0.5} />
    </group>
  );
}

/* ───── Capitolul 5: cristalul final (z −150 … −168) ───── */
function Finale() {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * 0.3;
  });
  return (
    <group position={[0, 0.1, -164]}>
      <group ref={g}>
        <mesh rotation={[0.35, 0.6, 0.1]}>
          <icosahedronGeometry args={[2.3, 0]} />
          <meshPhysicalMaterial color="#1a1424" metalness={0.45} roughness={0.06} clearcoat={1} clearcoatRoughness={0.04} emissive="#3a1245" emissiveIntensity={0.6} flatShading />
        </mesh>
        <mesh rotation={[0.35, 0.6, 0.1]} scale={1.004}>
          <icosahedronGeometry args={[2.3, 0]} />
          <meshBasicMaterial color="#FF2E9A" wireframe transparent opacity={0.6} />
        </mesh>
      </group>
      <mesh rotation={[1.25, 0, 0.2]}>
        <torusGeometry args={[3.5, 0.02, 8, 90]} />
        <meshBasicMaterial color="#B06CFF" transparent opacity={0.8} />
      </mesh>
      <pointLight intensity={28} color="#FF2E9A" distance={12} />
      <pointLight position={[4, 2, 3]} intensity={20} color="#FF6B1A" distance={14} />
      <pointLight position={[-4, -2, 3]} intensity={18} color="#8B2FF7" distance={14} />
      <Sparkles count={120} scale={[14, 9, 18]} size={2.4} speed={0.5} color="#FFB020" opacity={0.75} />
      <Sparkles count={70} scale={[16, 10, 20]} size={2} speed={0.35} color="#B06CFF" opacity={0.55} />
    </group>
  );
}

/* gridul wireframe care însoțește tot traseul (basement vibe) */
function Grid() {
  return (
    <>
      <gridHelper args={[60, 48, "#3a1430", "#160a1c"]} position={[0, -4.4, -20]} />
      <gridHelper args={[60, 48, "#3a1430", "#160a1c"]} position={[0, -4.4, -90]} />
      <gridHelper args={[60, 48, "#3a1430", "#160a1c"]} position={[0, -4.4, -155]} />
    </>
  );
}

export function World({
  progressRef,
  mapRef,
}: {
  progressRef: React.MutableRefObject<number>;
  mapRef: React.MutableRefObject<CameraMap>;
}) {
  return (
    <Canvas
      gl={{ antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      camera={{ fov: 62, near: 0.1, far: 60, position: [0, 0, 8] }}
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
      aria-label="Călătorie 3D prin universul Imperial Media"
    >
      <color attach="background" args={["#050507"]} />
      <fog attach="fog" args={["#050507", 8, 38]} />
      <ambientLight intensity={0.3} />
      <CameraRig progressRef={progressRef} mapRef={mapRef} />
      <ShardField />
      <Tunnel />
      <Gallery />
      <Thread />
      <Finale />
      <Grid />
    </Canvas>
  );
}
