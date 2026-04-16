"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin } from "lucide-react";

type Member = {
  initials: string;
  name: string;
  role: string;
  grad: string;
};

const team: Member[] = [
  {
    initials: "AI",
    name: "A. Ionuț",
    role: "CEO & Web Design",
    grad: "from-brand-orange to-pink-500",
  },
  {
    initials: "VT",
    name: "Victor T.",
    role: "Web Developer",
    grad: "from-brand-purple to-indigo-600",
  },
  {
    initials: "ED",
    name: "Elena D.",
    role: "Project Manager",
    grad: "from-pink-500 to-brand-purple",
  },
  {
    initials: "MI",
    name: "Mihai I.",
    role: "Digital Marketing",
    grad: "from-brand-orange to-amber-500",
  },
];

export function AboutTeam() {
  return (
    <section className="section relative overflow-hidden">
      <div className="container-app relative z-10">
        <div className="text-center">
          <span className="chip">Echipa Imperial Media</span>
          <h2 className="section-title mt-4 mx-auto">
            Suntem dedicați <span className="text-gradient">succesului</span>
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
              className="group relative overflow-hidden rounded-2xl border border-bg-border bg-bg-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/50"
            >
              {/* Avatar area */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${m.grad} opacity-80`}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.3),transparent_60%)]" />
                <span className="absolute inset-0 grid place-items-center font-display text-[5rem] font-extrabold text-white/90 drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                  {m.initials}
                </span>

                {/* Social reveal */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-bg/95 to-transparent p-4 pt-10 transition-transform duration-300 group-hover:translate-y-0">
                  <div className="flex items-center justify-center gap-2">
                    {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                      <span
                        key={i}
                        className="grid h-8 w-8 place-items-center rounded-full border border-bg-border bg-white/5 text-text-muted transition hover:border-brand-orange hover:text-brand-orange"
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-5 text-center">
                <p className="font-display text-base font-bold text-text">
                  {m.name}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-brand-orange">
                  {m.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
