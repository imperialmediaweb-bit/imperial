// Opțiunile Site Start — sursă unică pentru pagina /site-start, calculator și consultantul AI.
// Baza de 1.500 lei include: 5 pagini + blog, design unic, domeniu + găzduire 1 an,
// email personalizat, buton WhatsApp și un articol gratuit în Botoșani Expres.

export type Addon = { key: string; name: string; price: number; unit?: string; desc: string; onlyOnPage?: boolean };

export const SITE_START_ADDONS: Addon[] = [
  { key: "logo", name: "Logo", price: 300, desc: "dacă nu ai deja unul — creat pe brandul tău" },
  { key: "social", name: "Configurare Facebook + Google Business", price: 500, desc: "pagină de Facebook și profil Google Maps complete, cu poze optimizate" },
  { key: "fb-only", name: "Doar pagina de Facebook", price: 350, desc: "creare completă: copertă, descriere, buton de contact", onlyOnPage: true },
  { key: "gb-only", name: "Doar profilul Google Business", price: 200, desc: "firma pe Google Maps, cu program, poze și date de contact", onlyOnPage: true },
  { key: "fb-opt", name: "Optimizare pagină existentă", price: 200, desc: "ai deja pagina? îi facem copertă nouă, descriere și poze optimizate", onlyOnPage: true },
  { key: "pagina", name: "Pagină în plus", price: 200, unit: "pagină", desc: "orice pagină extra, cu conținutul dorit" },
  { key: "galerie", name: "Galerie foto / portofoliu", price: 400, desc: "lucrările tale, prezentate profesionist" },
  { key: "programari", name: "Programări / rezervări online", price: 500, desc: "clienții se programează singuri, tu primești notificare" },
  { key: "limba", name: "A doua limbă", price: 700, desc: "pentru turism, pensiuni sau clienți străini" , onlyOnPage: true },
  { key: "ai", name: "Asistent AI pe site", price: 600, desc: "știe tot site-ul și răspunde clienților 24/7" },
  { key: "presa", name: "Promovare în 50 de ziare", price: 1500, desc: "articol în toată rețeaua Media Expres, cu linkuri dofollow" , onlyOnPage: true },
];

export function addonPriceLabel(a: Addon) {
  return `+${a.price.toLocaleString("ro-RO")} lei${a.unit ? ` / ${a.unit}` : ""}`;
}

export function addonsSummary() {
  return SITE_START_ADDONS.map((a) => `${a.name.toLowerCase()} ${addonPriceLabel(a)}`).join(" · ");
}
