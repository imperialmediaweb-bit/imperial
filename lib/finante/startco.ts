// Facturile emise din StartCo, pentru potrivirea cu încasările.
// Cheia STARTCO_TOKEN stă doar pe server. API-ul StartCo nu are documentația publică,
// așa că citim specificația lor (openapi) cu cheia și încercăm căile uzuale de listare.

import { getPool, ensureSchema } from "@/lib/db";

const BASE = "https://api.cloud.startco.ro";

export function startcoConfigured(): boolean {
  return !!process.env.STARTCO_TOKEN;
}

async function get(path: string): Promise<{ ok: boolean; status: number; data: any }> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: process.env.STARTCO_TOKEN!, Accept: "application/json" },
    signal: AbortSignal.timeout(20_000),
  });
  const data = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, data };
}

// Pentru setări (doar admin): ce căi oferă API-ul StartCo pentru contul nostru
export async function startcoPaths(): Promise<string[]> {
  if (!startcoConfigured()) return [];
  const r = await get("/developer/openapi.json");
  if (!r.ok || !r.data?.paths) return [];
  return Object.entries(r.data.paths).flatMap(([p, ops]: [string, any]) => Object.keys(ops).map((m) => `${m.toUpperCase()} ${p}`));
}

function pick(o: any, keys: string[]): any {
  for (const k of keys) {
    const v = k.split(".").reduce((x, kk) => (x == null ? x : x[kk]), o);
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return null;
}

// Încearcă listarea facturilor emise pe interval; întoarce câte a salvat
export async function syncStartco(from: string, to: string): Promise<{ added: number; total: number; note?: string }> {
  if (!startcoConfigured()) return { added: 0, total: 0, note: "StartCo nu e configurat" };
  const pool = getPool();
  if (!pool) return { added: 0, total: 0, note: "Fără bază de date" };
  await ensureSchema();
  const q = `date_from=${from}&date_to=${to}&start_date=${from}&end_date=${to}&per_page=200&limit=200`;
  const tries = [`/developer/invoices?${q}`, `/developer/invoice?${q}`, `/developer/invoices/list?${q}`, `/developer/documents?type=invoice&${q}`];
  let list: any[] | null = null;
  for (const p of tries) {
    const r = await get(p).catch(() => null);
    if (!r?.ok) continue;
    const arr = Array.isArray(r.data) ? r.data : pick(r.data, ["data", "invoices", "items", "results", "data.data"]);
    if (Array.isArray(arr)) {
      list = arr;
      break;
    }
  }
  if (!list) return { added: 0, total: 0, note: "API-ul StartCo nu a răspuns la listarea facturilor — vezi Setări → StartCo pentru căile disponibile" };
  let added = 0;
  for (const inv of list) {
    const id = pick(inv, ["id", "uuid", "invoice_id"]);
    const date = String(pick(inv, ["date", "issue_date", "issued_at", "data", "created_at"]) ?? "").slice(0, 10);
    if (date && (date < from || date > to)) continue;
    const series = pick(inv, ["series", "serie"]);
    const num = pick(inv, ["number", "numar", "no"]);
    const res = await pool.query(
      `INSERT INTO fin_invoices (kind, source, ext_id, partner, number, issue_date, amount, currency, link)
       VALUES ('emisa', 'startco', $1, $2, $3, $4, $5, $6, $7) ON CONFLICT (ext_id) DO NOTHING`,
      [
        `startco:${id ?? `${series}${num}`}`,
        pick(inv, ["client.name", "partner.name", "client_name", "partner_name", "customer.name"]),
        [series, num].filter(Boolean).join(" ") || null,
        /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null,
        Number(pick(inv, ["total", "total_amount", "amount", "value", "grand_total"])) || null,
        pick(inv, ["currency", "moneda"]) ?? "RON",
        pick(inv, ["pdf_url", "link", "url", "public_url", "download_url"]),
      ]
    );
    added += res.rowCount ?? 0;
  }
  return { added, total: list.length };
}
