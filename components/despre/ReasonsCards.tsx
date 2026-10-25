"use client";

import { motion } from "framer-motion";
import { Award, Zap, HeartHandshake, Layers } from "lucide-react";
import { SpotlightCard } from "../ids/extras/SpotlightCard";
import { IconBadge } from "../IconBadge";

const reasons = [
  {
    icon: Award,
    wash: "from-brand-orange/[0.14] via-brand-magenta/[0.05] to-transparent",
    title: "Ne ținem de cuvânt",
    text: "Termene reale, prețuri spuse de la început, fără surprize pe factură.",
  },
  {
    icon: Zap,
    wash: "from-brand-magenta/[0.14] via-brand-purple/[0.05] to-transparent",
    title: "Rezultate, nu vorbe",
    text: "Rezervări dublate, programări zilnice, magazine care chiar vând. Cu astea ne lăudăm.",
  },
  {
    icon: HeartHandshake,
    wash: "from-brand-purple/[0.15] via-brand-magenta/[0.05] to-transparent",
    title: "Clienții rămân cu anii",
    text: "200+ de firme lucrează cu noi și azi. Site-ul e începutul, nu finalul.",
  },
  {
    icon: Layers,
    wash: "from-brand-orange/[0.12] via-brand-purple/[0.06] to-transparent",
    title: "Totul în casă",
    text: "Design, cod, SEO, presă, reclame — nu dăm nimic mai departe. Facem noi.",
  },
];

export function ReasonsCards() {
  return (
    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {reasons.map((r, i) => (
        <motion.div
          key={r.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
        >
          <SpotlightCard
            color="#FF2E9A"
            intensity={0.28}
            radius={16}
            className="group h-full rounded-2xl border border-bg-border glass-card transition-all hover:border-brand-magenta/50"
          >
            <div className="relative h-full overflow-hidden p-6">
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${r.wash}`} />
              <r.icon className="pointer-events-none absolute -bottom-5 -right-5 h-24 w-24 text-white/[0.05]" strokeWidth={1} />
              <div className="relative">
                <IconBadge icon={r.icon} className="transition-transform duration-300 group-hover:scale-110" />
                <h3 className="mt-4 font-display text-lg font-bold text-text">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{r.text}</p>
              </div>
            </div>
          </SpotlightCard>
        </motion.div>
      ))}
    </div>
  );
}
