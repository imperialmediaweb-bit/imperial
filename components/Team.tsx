"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

const team = [
  { initials: "AI", name: "A. Ionuț", role: "CEO & Web Designer", grad: "from-brand-orange to-pink-600" },
  { initials: "VT", name: "Victor T.", role: "Web Developer", grad: "from-brand-purple to-indigo-600" },
  { initials: "ED", name: "Elena D.", role: "Project Manager", grad: "from-pink-500 to-brand-purple" },
  { initials: "ML", name: "Mihai L.", role: "Digital Marketing", grad: "from-brand-orange to-amber-500" },
];

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
              {/* Avatar — placeholder colored gradient circle with initials */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${m.grad} opacity-90`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-7xl font-extrabold text-white/90 drop-shadow-2xl">
                    {m.initials}
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg-card to-transparent" />
                {/* Play overlay button */}
                <button
                  type="button"
                  aria-label={`Vezi mai mult despre ${m.name}`}
                  className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-orange-gradient text-white shadow-glow-orange transition group-hover:scale-110"
                >
                  <Play className="h-3.5 w-3.5 fill-white" strokeWidth={0} />
                </button>
              </div>

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
