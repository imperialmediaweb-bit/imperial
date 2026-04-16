// Tipuri și constante client-safe pentru admin — FĂRĂ dependințe de Node/pg.
// Tot ce folosesc client components ("use client") vine de aici.

export type BriefStatus = "nou" | "ofertat" | "client" | "refuzat";

export const STATUS_LABELS: Record<BriefStatus, string> = {
  nou: "Nou",
  ofertat: "Ofertă trimisă",
  client: "Client",
  refuzat: "Refuzat",
};

export const STATUS_COLORS: Record<BriefStatus, string> = {
  nou: "bg-blue-500/15 text-blue-300 border-blue-500/40",
  ofertat: "bg-yellow-500/15 text-yellow-300 border-yellow-500/40",
  client: "bg-green-500/15 text-green-300 border-green-500/40",
  refuzat: "bg-red-500/15 text-red-300 border-red-500/40",
};
