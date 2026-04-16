"use client";

import { motion } from "framer-motion";
import {
  Globe,
  ShoppingBag,
  Palette,
  Code2,
  Megaphone,
  Wrench,
  ArrowUpRight,
} from "lucide-react";
import { TiltCard } from "./effects/TiltCard";
import { Meteors } from "./effects/Meteors";

const services = [
  {
    icon: Globe,
    name: "Creare website-uri",
    text: "Realizăm website-uri atractive, optimizate pentru toate dispozitivele, adaptate nevoilor afacerii tale.",
    accent: "from-brand-orange to-brand-orangeDark",
  },
  {
    icon: ShoppingBag,
    name: "Magazine online",
    text: "Dezvoltăm magazine online performante, ușor de utilizat și optimizate pentru conversii rapide și sigure.",
    accent: "from-brand-orange to-brand-orangeDark",
  },
  {
    icon: Palette,
    name: "Branding",
    text: "Vă ajutăm să dați viață ideilor dvs. Oferim o gamă completă de servicii creative adaptate afacerii dvs.",
    accent: "from-brand-purple to-brand-glow",
  },
  {
    icon: Code2,
    name: "Dezvoltare web",
    text: "Dezvoltăm aplicații și platforme web personalizate, adaptate specificului afacerii tale și nevoilor clienților.",
    accent: "from-brand-orange to-brand-orangeDark",
  },
  {
    icon: Megaphone,
    name: "PR & marketing",
    text: "Îți promovăm afacerea prin strategii de PR și marketing digital, atrăgând noi clienți și creșterea vizibilității.",
    accent: "from-brand-purple to-brand-glow",
  },
  {
    icon: Wrench,
    name: "Mentenanță web",
    text: "Oferim servicii de mentenanță și administrare web pentru funcționarea optimă și siguranța continuă a site-ului tău.",
    accent: "from-brand-orange to-brand-orangeDark",
  },
];

export function Services() {
  return (
    <section id="servicii" className="section relative overflow-hidden">
      {/* Subtle meteors background */}
      <Meteors count={8} />

      <div className="container-app relative z-10">
        <div className="text-center">
          <span className="chip">Serviciile noastre</span>
          <h2 className="section-title mt-4 mx-auto">
            Soluții <span className="text-shimmer">complete</span>
          </h2>
          <p className="section-subtitle mx-auto">
            De la primul click până la lansare — acoperim tot ce ai nevoie
            pentru o prezență online de excepție.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, idx) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
            >
              <TiltCard className="group rounded-2xl border border-bg-border bg-bg-card bg-card-gradient transition-all hover:border-brand-orange/50">
                <a href="/brief" className="relative block h-full p-7">
                  {/* Glow corner */}
                  <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-orange/0 blur-3xl transition-all duration-500 group-hover:bg-brand-orange/30" />

                  <div className="relative z-10">
                    <h3 className="font-display text-xl font-bold text-text">
                      {s.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-muted">
                      {s.text}
                    </p>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text transition group-hover:text-brand-orange">
                        Read More
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                      <span
                        className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${s.accent} shadow-glow-orange transition-transform group-hover:scale-110 group-hover:rotate-12`}
                      >
                        <s.icon
                          className="h-6 w-6 text-white"
                          strokeWidth={1.8}
                        />
                      </span>
                    </div>
                  </div>
                </a>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
