"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

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
// Poze preluate direct de pe imperial-media.ro (WP uploads).
const items: Testimonial[] = [
  {
    name: "Ionela Ivan",
    role: "TudoSa.ro",
    initials: "II",
    grad: "from-brand-orange to-pink-500",
    text: "Mulțumim Imperial Media, toate funcțiile dorite au fost implementate. Suntem foarte mulțumiți de site-ul realizat.",
    photo: "https://www.imperial-media.ro/wp-content/uploads/2023/12/testimonial-img1.jpg",
  },
  {
    name: "Ionuț-Bogdan Cărăuș",
    role: "Affari business solutions",
    initials: "IB",
    grad: "from-brand-purple to-indigo-600",
    text: "Constructiv în lucru, profesionist, raportare bună, ascultător și înțelegere. Răspunzător la o comunicare bună. Recomand!",
    photo: "https://www.imperial-media.ro/wp-content/uploads/2023/12/testimonial-img2.jpg",
  },
  {
    name: "Botoșeneanul.ro",
    role: "Publicație online",
    initials: "BO",
    grad: "from-pink-500 to-brand-purple",
    text: "Pentru clienții Botoșeneanul.ro, Imperial Media a realizat în timp record o pagină nouă de știri ce a contribuit la creșterea audienței.",
    photo: "https://www.imperial-media.ro/wp-content/uploads/2023/12/testimonial-img3.jpg",
  },
  {
    name: "Marcu Liviu",
    role: "Counting Botosani",
    initials: "ML",
    grad: "from-brand-orange to-amber-500",
    text: "Îi recomand. Oameni serioși, mereu la curent cu ultima tehnologie. Recomand cu drag echipa Imperial Media!",
    photo: "https://www.imperial-media.ro/wp-content/uploads/2023/12/testimonial-img4.jpg",
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
      {/* Poză reală — object-cover center, nu deformează */}
      {showPhoto && (
        <Image
          src={t.photo!}
          alt={t.name}
          fill
          sizes="48px"
          className="object-cover object-center"
          onError={() => setFailed(true)}
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
