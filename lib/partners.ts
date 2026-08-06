// Parteneri cu link de reducere la Radiografia Afacerii.
// Linkul public: imperial-media.ro/{cod} → /service?partener={cod} → preț redus.
// Adaugi un partener nou = o linie aici (+ opțional un redirect frumos).

export type Partner = {
  code: string;
  label: string;
  priceRon: number;
};

const PARTNERS: Record<string, Partner> = {
  bizzclub: {
    code: "bizzclub",
    label: "Bizz Club Botoșani",
    priceRon: 199,
  },
};

export function getPartner(code: string | null | undefined): Partner | null {
  if (!code) return null;
  return PARTNERS[String(code).toLowerCase().trim()] ?? null;
}
