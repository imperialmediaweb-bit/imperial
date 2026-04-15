"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useState } from "react";

type Testimonial = {
  name: string;
  role: string;
  initials: string;
  grad: string;
  text: string;
  photo?: string; // ex: "/testimonials/ionela.jpg"
};

// Pentru a adăuga pozele reale: urcă fișierele în public/testimonials/<nume>.jpg
// și setează câmpul `photo` de mai jos. Fallback automat la inițiale colorate.
// Poze + nume + roluri + texte REALE, extrase din HTML-ul homepage WP.
const items: Testimonial[] = [
  {
    name: "Ionela Ivan Tudose",
    role: "Fondator Asociația H.A.P.P.Y",
    initials: "IT",
    grad: "from-brand-orange to-pink-500",
    text: "Mulțumim Imperial Media pentru toate lucrurile grozave pe care le-ați făcut pe partea de IT a Asociației Happy și Casa Nicolae! Programul de rezervare și plata online a meselor calde, website, harta online!",
    photo: "https://www.imperial-media.ro/wp-content/uploads/2024/10/Screenshot_32.webp",
  },
  {
    name: "Ionuț-Bogdan Cărăușu",
    role: "Fondator Scut Botoșănean",
    initials: "IC",
    grad: "from-brand-purple to-indigo-600",
    text: "Constructor de site-uri profesionist, caracterizat prin seriozitate și profesionalism. Răspunde cu promptitudine la solicitări și efectuează lucrări de calitate. Recomand!",
    photo: "https://www.imperial-media.ro/wp-content/uploads/2024/10/b.webp",
  },
  {
    name: "Botosaneanul.ro",
    role: "Fondator",
    initials: "BO",
    grad: "from-pink-500 to-brand-purple",
    text: "Pentru ziarul Botosaneanul și pentru postul Botoșăneanul TV, Imperial Media a rezolvat în timp record o problemă cu care ne confruntam de multă vreme. Astfel ne-a ajutat să creștem consistent eficiența întregii noastre activități. Calde și sincere mulțumiri.",
    photo: "https://www.imperial-media.ro/wp-content/uploads/2024/10/Screenshot_6-150x150-1.webp",
  },
  {
    name: "Hascu Liviu",
    role: "Administrator Dream Cleaning Botoșani",
    initials: "HL",
    grad: "from-brand-orange to-amber-500",
    text: "Îi recomand. Cei de la Imperial Media au înțeles ce vreau și mi-au creat un site foarte frumos. M-au ajutat cu marketingul, Google Business, pagină Facebook. Acum datorită metodelor de promovare am foarte mulți clienți.",
    photo: "https://www.imperial-media.ro/wp-content/uploads/2024/10/Screenshot_31.webp",
  },
];

function TestimonialAvatar({ t }: { t: Testimonial }) {
  const [failed, setFailed] = useState(false);
  const showPhoto = t.photo && !failed;
  return (
    <span
      className={`relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br ${t.grad} ring-2 ring-brand-orange/30`}
    >
      {/* Inițiale fallback — vizibile dacă poza nu s-a încărcat */}
      <span className="absolute inset-0 grid place-items-center font-display text-sm font-bold text-white">
        {t.initials}
      </span>
      {/* Poză reală — plain <img> pentru a ocoli optimizer-ul server-side */}
      {showPhoto && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={t.photo!}
          alt={t.name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      )}
    </span>
  );
}

export function Testimonials() {
  return (
    <section className="section relative">
      <div className="container-app">
        <div className="text-center">
          <span className="chip">Testimoniale</span>
          <h2 className="section-title mt-4 mx-auto">
            Ce spun <span className="text-gradient">clienții noștri</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative flex h-full flex-col rounded-2xl border border-bg-border bg-bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/50"
            >
              <Quote className="absolute right-5 top-5 h-8 w-8 text-brand-orange/15" />

              <div className="flex items-center gap-1 text-brand-orange">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-text-muted">
                {t.text}
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-bg-border/60 pt-4">
                <TestimonialAvatar t={t} />
                <div>
                  <p className="text-sm font-semibold text-text">{t.name}</p>
                  <p className="text-xs text-text-subtle">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
