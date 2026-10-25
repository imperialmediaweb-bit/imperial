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
      "Domeniu și hosting gratuit 1 an",
      "Logo design (1 draft)",
      "Email personalizat",
      "Asistent AI pe site inclus",
      "Promovare 1 lună × 50 de ziare",
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
      "Pagini nelimitate",
      "Panou de administrare propriu",
      "SEO tehnic din construcție",
      "Viteză sub o secundă",
      "Domeniu și hosting gratuit 1 an",
    ],
  },
  {
    key: "shop",
    name: "Magazin Online",
    price: "6.000 lei",
    priceNote: "de la (≈ 1.200 €)",
    features: [
      "20 produse listate",
      "Design responsive",
      "Domeniu + hosting inclus 1 an",
      "Certificat SSL inclus",
      "Panou administrare produse",
    ],
    excluded: [
      "Plăți cu cardul (doar ramburs / transfer bancar)",
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
      "GRATUIT la orice site nou",
    ],
  },
  {
    key: "admin",
    name: "Administrare",
    price: "200 lei",
    priceUnit: "/lună",
    priceNote: "de la",
    features: [
      "Credite AI incluse (asistentul de pe site)",
      "Găzduire + domeniu incluse (din anul 2)",
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
