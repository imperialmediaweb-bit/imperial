// Configurare centrală pentru date de contact + brand.
// Modifică aici și se schimbă peste tot în app.

export const siteConfig = {
  name: "Imperial Media",
  tagline: "Soluții web personalizate",
  url: "https://imperial-media.ro",
  phone: "0741 970 247",
  phoneRaw: "0741970247",
  whatsapp: "40741970247", // format internațional fără +
  email: "office@imperial-media.ro",
  mainSite: "https://www.imperial-media.ro",
  social: {
    facebook: "https://facebook.com/imperialmedia",
    instagram: "https://instagram.com/imperialmedia",
  },
  // Cifrele firmei — O SINGURĂ sursă pentru hero, portofoliu și paginile de servicii.
  // Actualizează aici și se schimbă peste tot unde sunt folosite.
  stats: {
    projects: 384, // proiecte livrate în total
    clients: 200, // clienți
    years: 10, // ani de experiență
    newspapers: 50, // ziare în rețeaua Media Expres
  },
  // Recenzii agregate (Google + Facebook) — actualizează numerele când cresc.
  // Folosite în Schema.org AggregateRating (SEO + citare de către LLM-uri).
  reviews: {
    ratingValue: 4.9,
    reviewCount: 47,
    sources: "Google Reviews + Facebook",
  },
};

// Originea PUBLICĂ pentru linkuri de retur (Stripe success_url, redirecturi, emailuri).
// În spatele proxy-ului (Railway), originea cererii e adresa internă (0.0.0.0:8080) —
// în producție folosim întotdeauna domeniul canonic.
export function publicOrigin(req: Request): string {
  if (process.env.NODE_ENV === "production") return siteConfig.url;
  try {
    return new URL(req.url).origin;
  } catch {
    return siteConfig.url;
  }
}

// Google afișează ~60 de caractere din titlu și ~160 din descriere. Șablonul din
// layout adaugă „ · Imperial Media” (17 caractere) la fiecare titlu, deci partea
// paginii are voie la cel mult 43. Tăiem la cuvânt întreg, fără să rupem sensul.
export const TITLE_MAX = 43;
export const DESCRIPTION_MAX = 158;

export function fitText(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const atWord = cut.slice(0, Math.max(cut.lastIndexOf(" "), Math.floor(max * 0.6)));
  return atWord.replace(/[\s,;:—–-]+$/, "") + "…";
}
