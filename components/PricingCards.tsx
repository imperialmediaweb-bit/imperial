"use client";

import { motion } from "framer-motion";
import { Check, X, ArrowRight, Crown } from "lucide-react";
import { packages } from "@/lib/packages";

export function PricingCards() {
  return (
    <section id="pachete" className="section relative">
      <div className="container-app">
        <div className="text-center">
          <span className="chip">Pachete flexibile</span>
          <h2 className="section-title mt-4 mx-auto">
            Alege <span className="text-gradient">soluția digitală</span> ideală
          </h2>
          <p className="section-subtitle mx-auto">
            Patru pachete clare. Poți alege unul sau combina mai multe — îți
            facem ofertă personalizată după ce completezi briefingul.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((pkg, idx) => (
            <motion.div
              key={pkg.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className={`group relative flex flex-col rounded-2xl border bg-bg-card bg-card-gradient p-7 shadow-card transition-all duration-300 hover:-translate-y-1 ${
                pkg.popular
                  ? "border-brand-orange/60 shadow-glow-orange"
                  : "border-bg-border hover:border-brand-purple/50"
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-orange-gradient px-3 py-1 text-xs font-semibold text-white shadow-glow-orange">
                  <Crown className="h-3 w-3" />
                  {pkg.highlight}
                </span>
              )}

              <h3 className="font-display text-lg font-bold text-text">
                {pkg.name}
              </h3>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-extrabold text-text">
                  {pkg.price}
                </span>
                {pkg.priceUnit && (
                  <span className="text-base font-medium text-text-muted">
                    {pkg.priceUnit}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs uppercase tracking-wider text-text-subtle">
                {pkg.priceNote}
              </p>

              <ul className="mt-6 space-y-2.5 text-sm">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-brand-orange/15 text-brand-orange">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="text-text-muted">{f}</span>
                  </li>
                ))}
                {pkg.excluded?.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 opacity-70"
                  >
                    <span className="mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-text-subtle/20 text-text-subtle">
                      <X className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="text-text-subtle">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={`#brief?pachet=${pkg.key}`}
                onClick={(e) => {
                  e.preventDefault();
                  // Scroll + setează pachetul în brief via custom event
                  document
                    .getElementById("brief")
                    ?.scrollIntoView({ behavior: "smooth" });
                  window.dispatchEvent(
                    new CustomEvent("brief:setPackage", { detail: pkg.key })
                  );
                }}
                className={`mt-7 inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all ${
                  pkg.popular
                    ? "bg-orange-gradient text-white shadow-glow-orange hover:scale-[1.02]"
                    : "border border-bg-border bg-white/5 text-text hover:border-brand-orange hover:bg-brand-orange/10"
                }`}
              >
                Cere oferta
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
