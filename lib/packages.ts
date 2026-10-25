export type PackageKey =
  | "website"
  | "custom"
  | "shop"
  | "promo"
  | "admin"
  | "personalizat";

export type Package = {
  key: PackageKey;
  name: string;
  price: string;
  priceUnit?: string;
  priceNote: string;
  popular?: boolean;
  highlight?: string;
  features: string[];
  excluded?: string[];
};

export const packages: Package[] = [
  {
    key: "website",
    name: "Site Start",
    price: "1.500 lei",
    priceNote: "plată unică",
    popular: true,
    highlight: "Cel mai popular",
    features: [
      "5 pagini + blog",
      "Design unic, pe brandul tău",
      "Găzduire + domeniu în administrare (de la 100 lei/lună)",
      "Buton WhatsApp inclus",
      "Email personalizat",
      "Articol gratuit în Botoșani Expres",
      "Campanie de 5 zile pe Facebook",
    ],
  },
  {
    key: "custom",
    name: "Site Custom",
    price: "3.500 lei",
    priceNote: "de la (≈ 699 €)",
    highlight: "Design unic, de la zero",
    features: [
      "Design unic premium, creat de la zero",
      "Până la 10 pagini (pagină în plus +200 lei)",
      "Panou de administrare propriu",
      "SEO tehnic din construcție",
      "Viteză sub o secundă",
      "Găzduire + domeniu în administrare (de la 100 lei/lună)",
    ],
  },
  {
    key: "shop",
    name: "Magazin Online",
    price: "3.000 lei",
    priceNote: "de la — Magazin Start",
    features: [
      "Design unic, creat de la zero",
      "Până la 30 de produse, încărcate de noi",
      "Coș, comenzi și plată ramburs",
      "Panou pentru produse și comenzi",
      "Găzduire + domeniu în administrare (de la 100 lei/lună)",
      "Opțional: plăți cu cardul, AWB automat, facturare automată",
    ],
  },
  {
    key: "promo",
    name: "Promovare",
    price: "1.500 lei",
    priceNote: "campanie (≈ 300 €)",
    highlight: "Rețeaua Media Expres",
    features: [
      "Articol publicat în 50+ ziare online",
      "41 ziare locale (1 per județ)",
      "9 ziare naționale",
      "Linkuri dofollow (boost SEO)",
      "Raport complet în 24h",
      "Distribuire Facebook pe fiecare publicație",
      "Text inclus sau vii cu textul tău",
      "GRATUIT la Site Custom și magazine online",
    ],
  },
  {
    key: "admin",
    name: "Administrare",
    price: "100 lei",
    priceUnit: "/lună",
    priceNote: "de la",
    features: [
      "Găzduire + domeniu incluse, de la lansare",
      "Cu asistent AI: 200 lei/lună (credite AI incluse)",
      "Backup lunar + update-uri",
      "1 articol SEO pe site",
      "2 postări Facebook",
      "Securizare + raport lunar trafic",
    ],
  },
];

export function getPackageByKey(key: string | null): Package | undefined {
  return packages.find((p) => p.key === key);
}
