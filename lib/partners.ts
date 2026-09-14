// Parteneri cu link de reducere la Radiografia Afacerii.
// Linkul public: imperial-media.ro/{cod} → /service?partener={cod} → preț redus.
// Adaugi un partener nou = o linie aici (+ opțional un redirect frumos).

export type Partner = {
  code: string;
  label: string;
  priceRon: number;
  // Cadourile au termen: după data asta codul moare singur (linkul revine la preț întreg)
  validUntil?: string; // ISO, ex: "2026-10-15"
};

const PARTNERS: Record<string, Partner> = {
  // CADOU DE LANSARE pentru membrii Bizz Club: Radiografia GRATUITĂ, O DATĂ per
  // firmă, până la 15 octombrie. După expirare linkul rămâne valid dar la preț întreg.
  bizzclub: {
    code: "bizzclub",
    label: "Bizz Club Botoșani",
    priceRon: 0,
    validUntil: "2026-10-15",
  },
  // Invitație VIP — acces gratuit, link discret pentru persoane-cheie
  // (președinți de club, presă, parteneri). Nu-l publica nicăieri.
  "vip-imperial": {
    code: "vip-imperial",
    label: "Invitație VIP",
    priceRon: 0,
  },
};

export function getPartner(code: string | null | undefined): Partner | null {
  if (!code) return null;
  const p = PARTNERS[String(code).toLowerCase().trim()] ?? null;
  if (!p) return null;
  if (p.validUntil && new Date() > new Date(p.validUntil + "T23:59:59")) return null;
  return p;
}
