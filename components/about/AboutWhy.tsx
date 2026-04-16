"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const reasons = [
  {
    title: "Profesionalism dovedit",
    text: "Am trecut prin multiple etape de dezvoltare digitală și am rămas mereu conectați la noile tehnologii.",
  },
  {
    title: "Rezultate reale",
    text: "Site-uri funcționale, magazine online performante, campanii de promovare care au adus conversii.",
  },
  {
    title: "Încrederea clienților",
    text: "Peste 240 de parteneri din România și din străinătate au ales să colaboreze cu noi.",
  },
  {
    title: "Expertiză diversă",
    text: "Fiecare membru al echipei aduce know-how în domenii precum web design, dezvoltare software, marketing digital, SEO și project management.",
  },
];

const services = [
  {
    name: "Web Design & Site-uri de Prezentare",
    text: "creăm platforme moderne, responsive, rapide și adaptate nevoilor fiecărui client.",
  },
  {
    name: "Magazine Online & E-commerce",
    text: "dezvoltăm soluții complete de vânzare online cu plăți integrate, sisteme de livrare și panouri de administrare intuitive.",
  },
  {
    name: "SEO & Optimizare Conținut",
    text: "strategiile noastre SEO cresc vizibilitatea afacerilor și aduc trafic organic constant.",
  },
  {
    name: "Promovare în Social Media",
    text: "administrăm pagini de Facebook și Instagram, creăm campanii targetate și gestionăm conținut care atrage.",
  },
  {
    name: "Advertoriale & Promovare în Presă",
    text: "publicăm articole în rețeaua noastră de peste 50 de ziare online, cu linkuri dofollow și distribuție pe pagini de Facebook.",
  },
  {
    name: "Email Marketing & Automatizări",
    text: "dezvoltăm campanii eficiente, personalizate, care mențin relația cu clienții.",
  },
  {
    name: "Administrare & Mentenanță Website-uri",
    text: "asigurăm backup-uri, actualizări și suport tehnic permanent.",
  },
];

const stats = [
  "Peste 10 ani de experiență continuă în domeniul digital.",
  "240+ clienți mulțumiți din România și din străinătate.",
  "Echipă multidisciplinară — web designeri, dezvoltatori, specialiști SEO și marketing, project manageri.",
  "Soluții personalizate pentru fiecare afacere, indiferent de industrie.",
  "Parteneriat pe termen lung și consultanță constantă pentru clienții noștri.",
];

export function AboutWhy() {
  return (
    <section className="section relative overflow-hidden bg-bg-soft/30">
      <div className="container-app relative z-10">
        <div>
          <span className="chip">What We Provide</span>
          <h2 className="section-title mt-4">
            De ce să alegi{" "}
            <span className="text-shimmer">Imperial Media</span>
          </h2>
          <p className="section-subtitle">
            Cu o experiență de peste un deceniu în domeniul digital,{" "}
            <strong className="text-text">Imperial Media</strong> este mai mult
            decât o agenție de web design și marketing — este partenerul de
            încredere al afacerilor care doresc să se dezvolte și să se impună
            în mediul online.
          </p>
          <p className="mt-4 max-w-3xl text-base text-text-muted">
            De peste 10 ani, am contribuit la succesul a sute de companii
            locale și internaționale, oferind servicii complete și
            personalizate de la ideea până la implementare și promovare.
          </p>
          <p className="mt-4 max-w-3xl text-base text-text-muted">
            Într-o lume unde tehnologia și mediul digital se schimbă rapid,
            experiența noastră acumulată în timp ne-a ajutat să anticipăm
            tendințele, să inovăm constant și să livrăm rezultate măsurabile
            pentru fiecare client.
          </p>
        </div>

        {/* Ce înseamnă peste 10 ani de experiență */}
        <div className="mt-14">
          <h3 className="font-display text-xl font-bold text-text">
            Ce înseamnă peste 10 ani de experiență?
          </h3>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {reasons.map((r, idx) => (
              <motion.li
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group flex gap-4 rounded-2xl border border-bg-border bg-bg-card p-5 transition hover:border-brand-orange/50"
              >
                <span className="mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-orange-gradient text-white shadow-glow-orange">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <div>
                  <p className="font-display text-base font-bold text-text">
                    {r.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-text-muted">
                    {r.text}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Serviciile noastre */}
        <div className="mt-14">
          <h3 className="font-display text-xl font-bold text-text">
            Serviciile noastre
          </h3>
          <ul className="mt-6 grid gap-3">
            {services.map((s, idx) => (
              <motion.li
                key={s.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="flex items-start gap-3 text-sm text-text-muted"
              >
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-orange-gradient shadow-[0_0_8px_rgba(255,107,26,0.6)]" />
                <span>
                  <strong className="text-text">{s.name}</strong> — {s.text}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* De ce alegem Imperial Media? */}
        <div className="mt-14">
          <h3 className="font-display text-xl font-bold text-text">
            De ce alegem Imperial Media?
          </h3>
          <ul className="mt-6 grid gap-3">
            {stats.map((s, idx) => (
              <motion.li
                key={s}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="flex items-start gap-3 text-sm text-text-muted"
              >
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" strokeWidth={2.5} />
                <span>{s}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <p className="mt-10 max-w-3xl text-base text-text-muted">
          La <strong className="text-text">Imperial Media</strong>, nu livrăm
          doar servicii, ci construim povești de succes. Fiecare site realizat,
          fiecare campanie lansată și fiecare strategie implementată reprezintă
          un pas înainte pentru clientul nostru și o dovadă a
          profesionalismului nostru.
        </p>
      </div>
    </section>
  );
}
