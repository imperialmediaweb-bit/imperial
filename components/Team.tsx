"use client";

import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import { useState } from "react";

type Member = {
  initials: string;
  name: string;
  role: string;
  grad: string;
  photo?: string; // ex: "/team/ionut.jpg"
};

// Pentru a adăuga poza reală: urcă fișierul în public/team/<nume>.jpg
// și setează câmpul `photo` de mai jos. Dacă lipsește, se afișează inițialele
// colorate ca fallback — layout-ul rămâne identic.
// Poze preluate direct de pe imperial-media.ro (WP uploads) — browser-ul
// le încarcă fără probleme (domeniul e whitelisted în next.config.mjs).
const team: Member[] = [
  {
    initials: "AI",
    name: "A. Ionuț",
    role: "CEO & Web Designer",
    grad: "from-brand-orange to-pink-600",
    photo: "https://www.imperial-media.ro/wp-content/uploads/2023/12/team-d1.jpg",
  },
  {
    initials: "VT",
    name: "Victor T.",
    role: "Web Developer",
    grad: "from-brand-purple to-indigo-600",
    photo: "https://www.imperial-media.ro/wp-content/uploads/2023/12/team-d2.jpg",
  },
  {
    initials: "ED",
    name: "Elena D.",
    role: "Project Manager",
    grad: "from-pink-500 to-brand-purple",
    photo: "https://www.imperial-media.ro/wp-content/uploads/2023/12/team-d3.jpg",
  },
  {
    initials: "ML",
    name: "Mihai L.",
    role: "Digital Marketing",
    grad: "from-brand-orange to-amber-500",
    photo: "https://www.imperial-media.ro/wp-content/uploads/2023/12/team-d04.jpg",
  },
];

function Avatar({ m }: { m: Member }) {
  const [failed, setFailed] = useState(false);
  const showPhoto = m.photo && !failed;
  return (
    <div className="relative aspect-[3/4] overflow-hidden bg-bg-soft">
      {/* Gradient background (vizibil până se încarcă poza sau dacă eșuează) */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${m.grad} opacity-90`}
      />
      {/* Inițiale fallback — sub fotografie */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-7xl font-extrabold text-white/90 drop-shadow-2xl">
          {m.initials}
        </span>
      </div>
      {/* Fotografia reală — plain <img> ca să ocolim optimizer-ul Next.js
          (imperial-media.ro are hotlink protection anti-server-side-fetch) */}
      {showPhoto && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={m.photo!}
          alt={m.name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
      )}
      {/* Overlay fade spre card — mai scurt să nu acopere fața */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg-card via-bg-card/60 to-transparent" />
      {/* LinkedIn badge */}
      <button
        type="button"
        aria-label={`LinkedIn ${m.name}`}
        className="absolute bottom-4 right-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-orange-gradient text-white shadow-glow-orange transition group-hover:scale-110"
      >
        <Linkedin className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  );
}

export function Team() {
  return (
    <section className="section relative">
      <div className="container-app">
        <div className="text-center">
          <span className="chip">Echipa Imperial Media</span>
          <h2 className="section-title mt-4 mx-auto">
            Suntem dedicați{" "}
            <span className="text-gradient">succesului afacerii tale</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, idx) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-bg-border bg-bg-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/50 hover:shadow-glow-orange"
            >
              <Avatar m={m} />

              <div className="border-t border-bg-border/60 p-4 text-center">
                <h3 className="font-display text-base font-bold text-text">
                  {m.name}
                </h3>
                <p className="mt-1 text-xs text-text-muted">{m.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
