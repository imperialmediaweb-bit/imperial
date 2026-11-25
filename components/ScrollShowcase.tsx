"use client";

// Secțiunea „din cristal, site-uri reale”, imediat sub hero.
// Cât derulezi, ecranul laptopului trece prin trei site-uri livrate, cristalul
// (același icosaedru ca în hero) iese din ecran, crește, apoi se sparge și din el
// se desfac cardurile cu proiectele. Totul e legat de scroll (framer-motion
// useScroll), fără video și fără three.js — doar SVG + transformări CSS.
// Cine are „reduce motion” vede direct starea finală, fără derulare legată.

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site";

const SITES = [
  { key: "teona-ariana", name: "Asociația Teona Ariana", domain: "teona-ariana.ro", href: "/proiecte/site-asociatia-teona-ariana-suceava" },
  { key: "clinica-sf-gheorghe", name: "Clinica Sf. Gheorghe", domain: "clinicasfantulgheorghe.ro", href: "/proiecte/site-clinica-sfantul-gheorghe-botosani" },
  { key: "sarami-media", name: "Sarami Media", domain: "sarami.ro", href: "/proiecte/sarami-media-editare-video" },
] as const;

const coverSrc = (key: string) => `/proiecte/${key}/cover.jpg`;

// ── icosaedrul, proiectat 2D ──
const PHI = (1 + Math.sqrt(5)) / 2;
const VERTS: [number, number, number][] = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0], [0, -1, PHI], [0, 1, PHI],
  [0, -1, -PHI], [0, 1, -PHI], [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
];
const EDGES: [number, number][] = [];
for (let i = 0; i < 12; i++)
  for (let j = i + 1; j < 12; j++) {
    const d = Math.hypot(VERTS[i][0] - VERTS[j][0], VERTS[i][1] - VERTS[j][1], VERTS[i][2] - VERTS[j][2]);
    if (Math.abs(d - 2) < 1e-6) EDGES.push([i, j]);
  }

function Crystal({ spin, burst }: { spin: number; burst: number }) {
  // spin: rotația (rad); burst 0→1: muchiile zboară în afară și se sting
  const ry = spin, rx = 0.5 + Math.sin(spin * 0.45) * 0.25;
  const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
  const pts = VERTS.map(([x, y, z]) => {
    const X = x * cy + z * sy;
    let Z = -x * sy + z * cy;
    const Y = y * cx - Z * sx;
    Z = y * sx + Z * cx;
    const f = 6 / (6 + Z);
    return [X * 60 * f, Y * 60 * f, Z] as const;
  });
  return (
    <svg viewBox="-160 -160 320 320" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="ss-cg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff6a1a" />
          <stop offset=".5" stopColor="#ff2d8a" />
          <stop offset="1" stopColor="#a83cff" />
        </linearGradient>
        <radialGradient id="ss-cf">
          <stop offset="0" stopColor="#ff2d8a" stopOpacity=".45" />
          <stop offset="1" stopColor="#3a0a3a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle r={115 * (1 + burst)} fill="url(#ss-cf)" opacity={1 - burst} />
      {EDGES.map(([a, b], i) => {
        const za = (pts[a][2] + pts[b][2]) / 2;
        const mx = (pts[a][0] + pts[b][0]) / 2, my = (pts[a][1] + pts[b][1]) / 2;
        const push = burst * 1.5; // fiecare muchie zboară în direcția ei
        return (
          <line
            key={i}
            x1={pts[a][0] + mx * push}
            y1={pts[a][1] + my * push}
            x2={pts[b][0] + mx * push}
            y2={pts[b][1] + my * push}
            stroke="url(#ss-cg)"
            strokeWidth={za > 0 ? 1.4 : 2.8}
            strokeOpacity={(za > 0 ? 0.45 : 1) * (1 - burst)}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

function LaptopScreen({ progress }: { progress: MotionValue<number> }) {
  // trei site-uri care se succed pe ecran, cu o derulare ușoară în fiecare
  const o1 = useTransform(progress, [0, 0.16, 0.2], [1, 1, 0]);
  const o2 = useTransform(progress, [0.16, 0.2, 0.32, 0.36], [0, 1, 1, 0]);
  const o3 = useTransform(progress, [0.32, 0.36, 1], [0, 1, 1]);
  const y = useTransform(progress, [0, 0.45], ["0%", "-6%"]);
  const ops = [o1, o2, o3];
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[10px] bg-black">
      {SITES.map((s, i) => (
        <motion.div key={s.key} style={{ opacity: ops[i], y }} className="absolute inset-0">
          <Image src={coverSrc(s.key)} alt={`Site ${s.name}`} fill sizes="(min-width: 1024px) 760px, 90vw" className="object-cover object-top" />
        </motion.div>
      ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
    </div>
  );
}

export function ScrollShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // starea cristalului — re-randăm SVG-ul doar când se mișcă scroll-ul
  const [crystal, setCrystal] = useState({ spin: 0.6, burst: 0 });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setCrystal({ spin: 0.6 + v * 7, burst: Math.min(1, Math.max(0, (v - 0.58) / 0.14)) });
  });

  // laptopul urcă și se apropie, apoi se retrage când apar cardurile
  const lapY = useTransform(scrollYProgress, [0, 0.12, 0.58, 0.72], ["12%", "0%", "0%", "18%"]);
  const lapScale = useTransform(scrollYProgress, [0, 0.12, 0.58, 0.72], [0.9, 1, 1.04, 0.82]);
  const lapOpacity = useTransform(scrollYProgress, [0.6, 0.72], [1, 0]);

  // cristalul iese din ecran (0.36 → 0.5), plutește, se sparge (0.58 → 0.72)
  const cY = useTransform(scrollYProgress, [0.34, 0.5], ["5%", "-38%"]);
  const cScale = useTransform(scrollYProgress, [0.34, 0.5, 0.58], [0.3, 1.3, 1.4]);
  const cOpacity = useTransform(scrollYProgress, [0.34, 0.38], [0, 1]);

  // textele
  const t1 = useTransform(scrollYProgress, [0, 0.06, 0.3, 0.36], [0, 1, 1, 0]);
  const t2 = useTransform(scrollYProgress, [0.38, 0.44, 0.56, 0.6], [0, 1, 1, 0]);
  const t3 = useTransform(scrollYProgress, [0.7, 0.78], [0, 1]);
  const t3y = useTransform(scrollYProgress, [0.7, 0.78], [30, 0]);

  // cardurile se desfac din centrul cristalului
  const fan = useTransform(scrollYProgress, [0.64, 0.82], [0, 1]);

  if (reduce) return <StaticShowcase />;

  return (
    <section ref={ref} aria-label="Site-uri livrate de Imperial Media" className="relative h-[340vh]">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        {/* lumini de fundal */}
        <div aria-hidden className="pointer-events-none absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-brand-orange/20 blur-[120px]" />
        <div aria-hidden className="pointer-events-none absolute -right-40 bottom-0 h-[520px] w-[520px] rounded-full bg-brand-purple/25 blur-[130px]" />

        {/* textele, unul după altul */}
        <div className="pointer-events-none absolute inset-x-0 top-[15vh] z-20 px-6 text-center sm:top-[17vh]">
          <motion.p style={{ opacity: t1 }} className="absolute inset-x-0 font-display text-[clamp(1.9rem,4.6vw,3.6rem)] font-extrabold leading-tight tracking-tight text-text">
            Construite de la zero.
            <span className="block text-[0.55em] font-semibold text-white/65">Fiecare site, pe brandul clientului.</span>
          </motion.p>
          <motion.p style={{ opacity: t2 }} className="absolute inset-x-0 font-display text-[clamp(1.9rem,4.6vw,3.6rem)] font-extrabold leading-tight tracking-tight text-text">
            Cu mișcare care <span className="text-gradient">se ține minte</span>.
          </motion.p>
        </div>

        {/* laptopul */}
        <motion.div style={{ y: lapY, scale: lapScale, opacity: lapOpacity }} className="relative z-10 w-[min(88vw,760px)]">
          <div className="relative rounded-t-[22px] rounded-b-md bg-[#1a1920] p-[1.6%] pb-[2.6%] shadow-[0_0_0_1px_#2e2c36_inset,0_50px_100px_rgba(0,0,0,.7),0_0_100px_rgba(255,45,138,.15)]">
            <LaptopScreen progress={scrollYProgress} />
          </div>
          <div className="relative mx-auto h-[14px] w-[110%] -translate-x-[4.5%] rounded-b-[26px] bg-gradient-to-b from-[#c9c8cf] to-[#8e8d96] sm:h-[22px]" />
        </motion.div>

        {/* cristalul care iese din ecran */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-[min(60vw,380px)] w-[min(60vw,380px)] -translate-x-1/2 -translate-y-1/2">
          <motion.div
            style={{ y: cY, scale: cScale, opacity: cOpacity }}
            className="h-full w-full drop-shadow-[0_0_24px_rgba(255,45,138,.9)] [filter:drop-shadow(0_0_24px_rgba(255,45,138,.9))_drop-shadow(0_0_60px_rgba(10,5,20,.9))]"
          >
            <Crystal spin={crystal.spin} burst={crystal.burst} />
          </motion.div>
        </div>

        {/* cardurile proiectelor */}
        <div className="absolute inset-x-0 top-[38%] z-40 flex -translate-y-1/2 justify-center">
          {SITES.map((s, i) => (
            <FanCard key={s.key} site={s} index={i} fan={fan} />
          ))}
        </div>

        {/* finalul */}
        <motion.div style={{ opacity: t3, y: t3y }} className="absolute inset-x-0 bottom-[5vh] z-50 px-6 text-center">
          <p className="font-display text-[clamp(1.7rem,4vw,3rem)] font-extrabold tracking-tight text-text">
            <span className="text-gradient">{siteConfig.stats.projects}+</span> proiecte. Al tău e următorul.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link href="/estimare" className="group inline-flex items-center gap-2 rounded-full bg-orange-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-glow-orange transition hover:scale-[1.03]">
              Află cât costă site-ul tău
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link href="/proiecte" className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-text transition hover:border-brand-orange/70">
              Vezi portofoliul
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FanCard({ site, index, fan }: { site: (typeof SITES)[number]; index: number; fan: MotionValue<number> }) {
  const dir = index - 1; // -1, 0, 1
  const x = useTransform(fan, [0, 1], ["0%", `${dir * 58}%`]);
  const y = useTransform(fan, [0, 1], ["0%", `${Math.abs(dir) * 8}%`]);
  const rotate = useTransform(fan, [0, 1], [0, dir * 7]);
  const scale = useTransform(fan, [0, 1], [0.2, 1]);
  const opacity = useTransform(fan, [0, 0.25], [0, 1]);
  return (
    <motion.div style={{ x, y, rotate, scale, opacity, zIndex: index === 1 ? 3 : 2 }} className="absolute w-[min(52vw,340px)]">
      <Link href={site.href} className="block overflow-hidden rounded-2xl border border-white/10 bg-bg-card shadow-[0_40px_80px_rgba(0,0,0,.65)] transition hover:border-brand-orange/60">
        <div className="flex h-7 items-center gap-1.5 bg-[#1f1e26] px-3">
          <i className="h-2 w-2 rounded-full bg-white/20" />
          <i className="h-2 w-2 rounded-full bg-white/20" />
          <i className="h-2 w-2 rounded-full bg-white/20" />
          <span className="ml-2 truncate text-[11px] font-medium text-white/50">{site.domain}</span>
        </div>
        <div className="relative aspect-[16/10]">
          <Image src={coverSrc(site.key)} alt={`Site ${site.name}`} fill sizes="(min-width: 640px) 340px, 52vw" className="object-cover object-top" />
        </div>
        <p className="px-4 py-3 text-sm font-semibold text-text">{site.name}</p>
      </Link>
    </motion.div>
  );
}

// fără animație: aceeași poveste, așezată simplu
function StaticShowcase() {
  return (
    <section aria-label="Site-uri livrate de Imperial Media" className="section">
      <div className="container-app text-center">
        <p className="font-display text-[clamp(1.7rem,4vw,3rem)] font-extrabold tracking-tight text-text">
          <span className="text-gradient">{siteConfig.stats.projects}+</span> proiecte. Al tău e următorul.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {SITES.map((s) => (
            <Link key={s.key} href={s.href} className="block overflow-hidden rounded-2xl border border-white/10 bg-bg-card text-left">
              <div className="relative aspect-[16/10]">
                <Image src={coverSrc(s.key)} alt={`Site ${s.name}`} fill sizes="(min-width: 640px) 33vw, 90vw" className="object-cover object-top" />
              </div>
              <p className="px-4 py-3 text-sm font-semibold text-text">{s.name}</p>
            </Link>
          ))}
        </div>
        <Link href="/estimare" className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-gradient px-6 py-3.5 text-sm font-semibold text-white">
          Află cât costă site-ul tău <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
