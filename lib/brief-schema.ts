// Schema briefing-ului — partajată între client și server.
// AI-ul (Claude) umple aceste câmpuri prin tool use pe măsură ce discută cu clientul.

import type { PackageKey } from "./packages";

export type BriefState = {
  // Contact (email obligatoriu; telefon opțional)
  name: string;
  email: string;
  phone: string;

  // Proiect
  selectedPackage: PackageKey | "personalizat" | "";
  industry: string;
  currentSite: string;
  pages: string;
  deadline: string;

  // Design & features
  hasLogo: "da" | "nu" | "";
  colorsPreference: string;
  features: string[];
  inspiration: string;
  message: string;

  // Estimare generată de AI la final
  estimate: {
    min: number | null;
    max: number | null;
    currency: "EUR";
    reasoning: string;
  };

  // Control flow
  recommendedPackage: PackageKey | "personalizat" | "";
  recommendedReason: string;
  readyToSubmit: boolean;
};

export const emptyBrief: BriefState = {
  name: "",
  email: "",
  phone: "",
  selectedPackage: "",
  industry: "",
  currentSite: "",
  pages: "",
  deadline: "",
  hasLogo: "",
  colorsPreference: "",
  features: [],
  inspiration: "",
  message: "",
  estimate: { min: null, max: null, currency: "EUR", reasoning: "" },
  recommendedPackage: "",
  recommendedReason: "",
  readyToSubmit: false,
};

// Progres 0-100 în funcție de câmpurile umplute.
// Câmpurile "grele" (contact + pachet + industrie) cântăresc mai mult.
export function computeBriefProgress(b: BriefState): number {
  let score = 0;
  const w = {
    name: 12,
    email: 15,
    selectedPackage: 15,
    industry: 12,
    pages: 8,
    deadline: 6,
    hasLogo: 6,
    colorsPreference: 6,
    features: 10,
    inspiration: 5,
    message: 5,
  };
  if (b.name.trim().length >= 2) score += w.name;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) score += w.email;
  if (b.selectedPackage) score += w.selectedPackage;
  if (b.industry.trim().length >= 2) score += w.industry;
  if (b.pages) score += w.pages;
  if (b.deadline) score += w.deadline;
  if (b.hasLogo) score += w.hasLogo;
  if (b.colorsPreference.trim()) score += w.colorsPreference;
  if (b.features.length > 0) score += w.features;
  if (b.inspiration.trim()) score += w.inspiration;
  if (b.message.trim()) score += w.message;
  return Math.min(100, score);
}

// ────────────────────────────────────────────────────────────
// MOOD BOARDS — 6 preseturi vizuale pentru alegerea esteticii.
// ────────────────────────────────────────────────────────────

export type MoodBoard = {
  key: string;
  name: string;
  emoji: string;
  description: string;
  colors: string[]; // hex
  vibe: string;
};

export const MOODBOARDS: MoodBoard[] = [
  {
    key: "dark-premium",
    name: "Dark Premium",
    emoji: "🌙",
    description: "Negru + auriu, elegant, lux",
    colors: ["#0A0A0A", "#1F1F1F", "#D4AF37", "#FFFFFF"],
    vibe: "premium, elegant, sofisticat",
  },
  {
    key: "minimalist-alb",
    name: "Minimalist Alb",
    emoji: "☀️",
    description: "Alb curat, spațiu, tipografie elegantă",
    colors: ["#FFFFFF", "#F5F5F5", "#111111", "#FF6B1A"],
    vibe: "minimalist, aerisit, modern",
  },
  {
    key: "fun-playful",
    name: "Fun & Playful",
    emoji: "🌈",
    description: "Colorat, vesel, energic",
    colors: ["#FF6B9D", "#FFDD59", "#4ECDC4", "#A855F7"],
    vibe: "vesel, creativ, tinerese",
  },
  {
    key: "corporate",
    name: "Corporate Profesional",
    emoji: "💼",
    description: "Albastru + gri, încredere, serios",
    colors: ["#1E3A8A", "#3B82F6", "#6B7280", "#F3F4F6"],
    vibe: "corporate, serios, încredere",
  },
  {
    key: "natural",
    name: "Natural Organic",
    emoji: "🌿",
    description: "Verde + crem, natural, calm",
    colors: ["#4A7C59", "#8FBC8F", "#F5F0E1", "#3C2F2F"],
    vibe: "natural, eco, calm, organic",
  },
  {
    key: "bold-agresiv",
    name: "Bold & Agresiv",
    emoji: "🔥",
    description: "Portocaliu + negru, impact, energie",
    colors: ["#FF6B1A", "#111111", "#FFB020", "#FFFFFF"],
    vibe: "energic, bold, impact, dinamic",
  },
];

// ────────────────────────────────────────────────────────────
// ESTIMARE LIVE — calcul client-side pe măsură ce brief-ul se umple.
// AI-ul poate seta un `estimate` oficial la sfârșit (set_estimate),
// dar aceasta e estimarea "running" vizibilă în permanență.
// ────────────────────────────────────────────────────────────

export type EstimateLine = {
  label: string;
  priceMin: number;
  priceMax: number;
};

export type LiveEstimate = {
  lines: EstimateLine[];
  totalMin: number;
  totalMax: number;
};

const FEATURE_COMPLEX = new Set([
  "Rezervări online",
  "Plăți online",
  "Multilimbă",
  "CRM / Newsletter",
  "CRM/Newsletter",
  "Zonă de membri",
  "Zonă membri",
  "Formular contact avansat",
  "Formular avansat",
]);

const FEATURE_SIMPLE = new Set([
  "Blog",
  "Galerie / Portofoliu",
  "Galerie foto",
  "Galerie",
  "Hartă Google Maps",
  "Hartă",
  "Integrare social media",
  "Social media",
]);

export function computeLiveEstimate(b: BriefState): LiveEstimate | null {
  if (!b.selectedPackage) return null;

  const lines: EstimateLine[] = [];
  const pkg = b.selectedPackage;

  // ─── Detectăm nivelul de complexitate ───
  const complexFeatures = b.features.filter((f) =>
    FEATURE_COMPLEX.has(f)
  ).length;
  const isComplex = complexFeatures >= 2 || b.features.length >= 4;

  // ─── Bază per pachet (ajustată pe complexitate) ───
  if (pkg === "website") {
    if (isComplex) {
      lines.push({ label: "Website cu funcționalități (bază)", priceMin: 1500, priceMax: 1500 });
    } else {
      lines.push({ label: "Website Prezentare (bază)", priceMin: 699, priceMax: 699 });
    }
  } else if (pkg === "shop") {
    lines.push({ label: "Magazin Online (bază)", priceMin: 1200, priceMax: 1200 });
  } else if (pkg === "promo") {
    lines.push({ label: "Campanie Promovare", priceMin: 180, priceMax: 220 });
  } else if (pkg === "admin") {
    lines.push({ label: "Mentenanță lunară", priceMin: 50, priceMax: 100 });
  } else if (pkg === "personalizat") {
    // Personalizat nu are estimare automată
    return null;
  }

  // ─── Pagini extra (doar pentru website) ───
  if (pkg === "website" && b.pages) {
    if (b.pages.includes("5-15")) {
      lines.push({ label: "Pagini extra (5-15)", priceMin: 100, priceMax: 200 });
    } else if (b.pages.includes("15+")) {
      lines.push({ label: "Pagini extra (15+)", priceMin: 300, priceMax: 500 });
    }
  }

  // ─── Logo nou ───
  if (b.hasLogo === "nu" && (pkg === "website" || pkg === "shop")) {
    lines.push({
      label: "Logo nou (draft inclus — extra dacă vrei variante)",
      priceMin: pkg === "website" ? 150 : 100,
      priceMax: pkg === "website" ? 250 : 200,
    });
  }

  // ─── Features ───
  if ((pkg === "website" || pkg === "shop") && b.features.length > 0) {
    for (const f of b.features) {
      if (FEATURE_COMPLEX.has(f)) {
        lines.push({ label: f, priceMin: isComplex ? 300 : 150, priceMax: isComplex ? 500 : 250 });
      } else if (FEATURE_SIMPLE.has(f)) {
        lines.push({ label: f, priceMin: 100, priceMax: 200 });
      } else {
        lines.push({ label: f, priceMin: 150, priceMax: 300 });
      }
    }
  }

  // ─── Urgență ───
  if (pkg === "website" && b.deadline === "Cât mai repede") {
    lines.push({ label: "Urgență (prioritate)", priceMin: 100, priceMax: 100 });
  }

  // ─── Plăți card pentru shop ───
  if (pkg === "shop" && b.features.some((f) => f.toLowerCase().includes("plăți") || f.toLowerCase().includes("card"))) {
    // Deja contat la features — dar asigură minim
  }

  const totalMin = lines.reduce((s, l) => s + l.priceMin, 0);
  const totalMax = lines.reduce((s, l) => s + l.priceMax, 0);

  // Rotunjește la 10€
  return {
    lines,
    totalMin: Math.round(totalMin / 10) * 10,
    totalMax: Math.round(totalMax / 10) * 10,
  };
}

// Validare minimă pentru a trimite brief-ul (nu blocăm pe estimate)
export function canSubmitBrief(b: BriefState): boolean {
  const nameOk = b.name.trim().length >= 2;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email);
  const pkgOk = !!b.selectedPackage;
  const industryOk = b.industry.trim().length >= 2;
  return nameOk && emailOk && pkgOk && industryOk;
}

// Schema JSON pentru tool_use-ul Claude. Trebuie să rămână sincronizată cu BriefState.
export const briefToolsJsonSchema = {
  update_brief: {
    name: "update_brief",
    description:
      "Actualizează briefing-ul clientului cu informațiile colectate. Apelează DE FIECARE DATĂ când afli ceva nou (nume, email, pachet, features, etc.). Trimite doar câmpurile care s-au schimbat.",
    input_schema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Numele complet al clientului" },
        email: { type: "string", description: "Email valid" },
        phone: { type: "string", description: "Telefon (opțional)" },
        selectedPackage: {
          type: "string",
          enum: ["website", "shop", "promo", "admin", "personalizat"],
          description:
            "Pachetul potrivit: website=site prezentare (699€), shop=magazin online (1200€), promo=promovare (200€), admin=mentenanță (50€/lună), personalizat=altceva",
        },
        industry: { type: "string", description: "Domeniul de activitate" },
        currentSite: { type: "string", description: "URL-ul site-ului actual (dacă există)" },
        pages: {
          type: "string",
          enum: ["1-5 pagini", "5-15 pagini", "15+ pagini", "Nu știu încă"],
          description: "Număr estimat de pagini",
        },
        deadline: {
          type: "string",
          enum: ["Cât mai repede", "În 2-4 săptămâni", "În 1-2 luni", "Flexibil"],
          description: "Termen dorit",
        },
        hasLogo: { type: "string", enum: ["da", "nu"], description: "Are logo/identitate vizuală" },
        colorsPreference: { type: "string", description: "Preferințe de culori" },
        features: {
          type: "array",
          items: { type: "string" },
          description:
            "Funcționalități cerute (ex: Blog, Rezervări online, Plăți online, Multilimbă, CRM/Newsletter, Zonă de membri, Formular avansat, Galerie/Portofoliu, Hartă, Social media)",
        },
        inspiration: { type: "string", description: "Site-uri sau brand-uri de inspirație" },
        message: { type: "string", description: "Alte detalii importante" },
      },
    },
  },
  set_recommendation: {
    name: "set_recommendation",
    description:
      "Setează pachetul recomandat pentru client, pe baza conversației. Apelează doar când ești sigur (după ce ai aflat tipul de proiect).",
    input_schema: {
      type: "object" as const,
      properties: {
        package: {
          type: "string",
          enum: ["website", "shop", "promo", "admin", "personalizat"],
        },
        reason: {
          type: "string",
          description: "Un rând explicând de ce e potrivit (ex: 'Perfect pentru cabinet medical cu programări online')",
        },
      },
      required: ["package", "reason"],
    },
  },
  set_estimate: {
    name: "set_estimate",
    description:
      "Afișează o estimare ORIENTATIVĂ de buget (nu prețul final). Apelează doar la sfârșit, după ce ai aflat: pachet, număr pagini aproximativ, features, logo. Dă un range rezonabil (min-max). Calculul: website 699€ bază + 100€/feature complex + 150€ dacă nu are logo. Shop: 1200€ bază + 80€/feature + 150€ logo.",
    input_schema: {
      type: "object" as const,
      properties: {
        min: { type: "number", description: "Minim estimat în EUR" },
        max: { type: "number", description: "Maxim estimat în EUR" },
        reasoning: { type: "string", description: "O frază scurtă cu ce include estimarea" },
      },
      required: ["min", "max", "reasoning"],
    },
  },
  request_submit: {
    name: "request_submit",
    description:
      "Marchează brief-ul ca gata de trimis. Apelează doar după ce ai: nume + email + pachet + industrie + ai făcut rezumat în ultimul mesaj și ai întrebat clientul dacă e ok să trimitem.",
    input_schema: {
      type: "object" as const,
      properties: {},
    },
  },
  present_moodboards: {
    name: "present_moodboards",
    description:
      "Arată user-ului 6 mood board-uri vizuale (culori + vibe) ca să aleagă estetica. FOLOSEȘTE în loc de a întreba 'ce culori vrei?'. Este mult mai ușor pentru user să aleagă vizual decât să descrie. Nu ia parametri — mood board-urile sunt predefinite.",
    input_schema: {
      type: "object" as const,
      properties: {},
    },
  },
  present_options: {
    name: "present_options",
    description:
      "Prezintă user-ului chips CLICKABILE sub mesajul tău, ca să aleagă rapid fără să tasteze. FOLOSEȘTE MEREU când întrebi lucruri cu opțiuni predefinite: features dorite, număr pagini, are logo?, termen, tip proiect, culori frecvente. NU pune user-ul să tasteze dacă poți oferi opțiuni. Textul tău din mesaj trebuie să fie întrebarea, iar chips-urile sunt răspunsurile posibile.",
    input_schema: {
      type: "object" as const,
      properties: {
        options: {
          type: "array",
          items: { type: "string" },
          description: "Lista opțiunilor. Max 10. Folosește formulare scurte (1-3 cuvinte).",
        },
        multi_select: {
          type: "boolean",
          description:
            "true dacă user-ul poate alege MAI MULTE (ex: features). false pentru alegere unică (ex: da/nu, pachet, termen).",
        },
      },
      required: ["options"],
    },
  },
  scan_business: {
    name: "scan_business",
    description:
      "Caută o firmă pe Google Maps și returnează date REALE: rating, nr review-uri, website, adresă. Folosește IMEDIAT când ai numele firmei + orașul. Rezultatul e REAL din Google, nu inventat. Dacă nu găsește → firma nu are Google Business Profile.",
    input_schema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Numele firmei" },
        city: { type: "string", description: "Orașul" },
      },
      required: ["name", "city"],
    },
  },
};
