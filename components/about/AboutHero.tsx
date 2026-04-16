"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { siteConfig } from "@/lib/site";

const features = [
  "Web design și dezvoltare site-uri",
  "Administrare website-uri",
  "Articole în presă online",
];

const avatars = [
  "https://www.imperial-media.ro/wp-content/uploads/2024/10/Screenshot_32.webp",
  "https://www.imperial-media.ro/wp-content/uploads/2024/10/b.webp",
  "https://www.imperial-media.ro/wp-content/uploads/2024/10/Screenshot_31.webp",
];

export function AboutHero() {
  return (
    <section className="section relative overflow-hidden">
      <div className="container-app relative z-10 grid items-center gap-12 lg:grid-cols-2">
        {/* LEFT — visual */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-brand-orange/30 via-brand-purple/20 to-transparent blur-3xl" />

          <div className="relative aspect-square overflow-hidden rounded-3xl border border-bg-border bg-bg-card bg-card-gradient">
            {/* Fluid abstract visual */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,107,26,0.55),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(123,47,247,0.5),transparent_55%)]" />
            <div className="absolute inset-0 bg-[conic-gradient(from_210deg_at_50%_50%,rgba(255,138,66,0.25),rgba(168,85,247,0.25),rgba(255,107,26,0.25))] mix-blend-screen" />
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

            {/* Floating experience badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute right-5 top-5 flex flex-col items-center justify-center rounded-2xl bg-orange-gradient px-6 py-4 text-white shadow-glow-orange"
            >
              <span className="font-display text-4xl font-extrabold leading-none">
                10+
              </span>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
                Ani de
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                experiență
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* RIGHT — copy */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span className="chip">Ce Oferim</span>
          <h2 className="section-title mt-4">
            Soluții digitale complete pentru afaceri —{" "}
            <span className="text-gradient">Web Design, Marketing</span>
          </h2>
          <p className="section-subtitle">
            De peste 10 ani, echipa noastră ajută companiile să-și dezvolte
            prezența online prin servicii moderne și eficiente. De la
            website-uri de prezentare și magazine online, până la promovare
            digitală și soluții IT integrate, livrăm rezultate concrete și
            parteneriate de lungă durată.
          </p>

          <ul className="mt-7 space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-text">
                <span className="mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-brand-orange/15 text-brand-orange">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <div className="flex -space-x-3">
              {avatars.map((a, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={a}
                  alt=""
                  loading="lazy"
                  className="h-11 w-11 rounded-full border-2 border-bg-card object-cover"
                />
              ))}
            </div>
            <p className="max-w-[220px] text-sm text-text-muted">
              Peste 140 de clienți au ales să colaboreze cu noi.
            </p>
          </div>

          <a
            href={`tel:${siteConfig.phoneRaw}`}
            className="btn-primary mt-8 uppercase tracking-[0.18em]"
          >
            Contact
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
