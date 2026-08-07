// Configurare centrală pentru date de contact + brand.
// Modifică aici și se schimbă peste tot în app.

export const siteConfig = {
  name: "Imperial Media",
  tagline: "Soluții web personalizate",
  url: "https://imperial-media.ro",
  phone: "0758 169 388",
  phoneRaw: "0758169388",
  whatsapp: "40758169388", // format internațional fără +
  email: "office@imperial-media.ro",
  mainSite: "https://www.imperial-media.ro",
  social: {
    facebook: "https://facebook.com/imperialmedia",
    instagram: "https://instagram.com/imperialmedia",
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
