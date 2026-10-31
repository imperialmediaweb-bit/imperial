// Firmele din panou (Imperial = Legio Web Development Tools SRL, Botoșani Expres = Media Lux …).
// Fiecare extras, factură și potrivire aparține unei firme; contabilii pot fi limitați la anumite firme.

import { getPool, ensureSchema } from "@/lib/db";
import type { FinUser } from "./auth";

export type Company = { id: number; name: string; cui: string | null; aliases: string | null };

const SEED: { name: string; cui: string | null; aliases: string }[] = [
  { name: "Legio Web Development Tools SRL", cui: "46466484", aliases: "imperial media, imperial-media, legio" },
  { name: "Media Lux", cui: null, aliases: "botosani expres, botoșani expres, media expres, medialux" },
];

export async function listCompanies(): Promise<Company[]> {
  const pool = getPool();
  if (!pool) return [];
  await ensureSchema();
  const { rows } = await pool.query(`SELECT id, name, cui, aliases FROM fin_companies ORDER BY id`);
  if (rows.length) return rows;
  for (const c of SEED) await pool.query(`INSERT INTO fin_companies (name, cui, aliases) VALUES ($1, $2, $3)`, [c.name, c.cui, c.aliases]);
  return (await pool.query(`SELECT id, name, cui, aliases FROM fin_companies ORDER BY id`)).rows;
}

// firmele pe care le vede utilizatorul (admin sau contabil fără limită = toate)
export async function companiesFor(u: FinUser & { company_ids?: number[] | null }): Promise<Company[]> {
  const all = await listCompanies();
  if (u.role === "admin" || !u.company_ids?.length) return all;
  return all.filter((c) => u.company_ids!.includes(c.id));
}

export async function canSee(u: FinUser & { company_ids?: number[] | null }, companyId: number | null): Promise<boolean> {
  if (u.role === "admin" || !u.company_ids?.length) return true;
  return companyId != null && u.company_ids.includes(companyId);
}

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
const digits = (s: string | null | undefined) => (s ?? "").replace(/\D/g, "");

// Firma cumpărătoare de pe factură → id; null dacă nu se recunoaște (factura rămâne „Nealocată”)
export function detectCompany(companies: Company[], buyerName: string | null, buyerCui: string | null): number | null {
  const cui = digits(buyerCui);
  if (cui) {
    const c = companies.find((x) => digits(x.cui) === cui);
    if (c) return c.id;
  }
  if (buyerName) {
    const b = norm(buyerName);
    for (const c of companies) {
      const keys = [c.name, ...(c.aliases ?? "").split(",")].map((k) => norm(k.replace(/\b(srl|sa|pfa|ii)\b/gi, ""))).filter((k) => k.length >= 4);
      if (keys.some((k) => b.includes(k))) return c.id;
    }
  }
  return null;
}

// Pare persoană fizică (nu firmă)? — pentru avertismentul „nedeductibilă”
export function looksLikePerson(buyerName: string | null, buyerCui: string | null): boolean {
  if (!buyerName) return false;
  if (digits(buyerCui).length === 13) return true; // CNP
  return !/\b(srl|s\.r\.l|sa|s\.a|pfa|ii|ong|asociatia|fundatia|ltd|gmbh|inc)\b/i.test(buyerName) && buyerName.trim().split(/\s+/).length <= 4 && !digits(buyerCui);
}
