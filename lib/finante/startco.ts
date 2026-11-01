// Facturile emise din StartCo, pentru potrivirea cu încasările.
// Cheia STARTCO_TOKEN stă doar pe server. API-ul StartCo nu are documentația publică,
// așa că încercăm căile uzuale de listare și citim câmpurile defensiv.

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

async function listInvoices(from: string, to: string): Promise<{ path: string; list: any[] } | null> {
  const q = `date_from=${from}&date_to=${to}&start_date=${from}&end_date=${to}&per_page=200&limit=200`;
  const tries = [`/developer/invoices?${q}`, `/developer/invoice?${q}`, `/developer/invoices/list?${q}`, `/developer/documents?type=invoice&${q}`];
  for (const p of tries) {
    const r = await get(p).catch(() => null);
    if (!r?.ok) continue;
    const arr = Array.isArray(r.data) ? r.data : pick(r.data, ["data", "invoices", "items", "results", "data.data"]);
    if (Array.isArray(arr)) return { path: p.split("?")[0], list: arr };
  }
  return null;
}

// Pentru verificare (doar admin): cum arată o factură în răspunsul StartCo
export async function startcoSample(from: string, to: string): Promise<any> {
  if (!startcoConfigured()) return { configured: false };
  const r = await listInvoices(from, to);
  if (!r) return { configured: true, list: null };
  return { configured: true, path: r.path, count: r.list.length, sample: r.list.slice(0, 2) };
}

// Data emiterii: nume uzuale, apoi orice câmp care arată a dată (AAAA-LL-ZZ, ZZ.LL.AAAA sau timestamp)
function normDate(v: any): string | null {
  if (typeof v === "number" && v > 1e9) return new Date(v > 1e12 ? v : v * 1000).toISOString().slice(0, 10);
  const t = String(v ?? "").trim();
  let m = t.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = t.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})/);
  if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  return null;
}

export function invDate(inv: any): string | null {
  for (const k of ["dateEmitted", "date_emitted", "issueDate", "issue_date", "date", "data", "invoiceDate", "invoice_date", "emitted_at", "issued_at", "createdAt", "created_at"]) {
    const d = normDate(pick(inv, [k]));
    if (d) return d;
  }
  for (const [k, v] of Object.entries(inv ?? {})) {
    if (/due|scaden|paid|plat|updat/i.test(k)) continue;
    if (/dat|emit|issu|creat/i.test(k)) {
      const d = normDate(v);
      if (d) return d;
    }
  }
  return null;
}

// Listează facturile emise pe interval și le salvează; cele existente își completează data/suma lipsă
export async function syncStartco(from: string, to: string): Promise<{ added: number; total: number; note?: string }> {
  if (!startcoConfigured()) return { added: 0, total: 0, note: "StartCo nu e configurat" };
  const pool = getPool();
  if (!pool) return { added: 0, total: 0, note: "Fără bază de date" };
  await ensureSchema();
  const r = await listInvoices(from, to);
  if (!r) return { added: 0, total: 0, note: "API-ul StartCo nu a răspuns la listarea facturilor" };
  let added = 0;
  let inRange = 0;
  for (const inv of r.list) {
    const id = pick(inv, ["id", "uuid", "invoice_id"]);
    const series = pick(inv, ["series", "serie"]);
    const num = pick(inv, ["number", "numar", "no"]);
    const extId = `startco:${id ?? `${series}${num}`}`;
    const date = invDate(inv);
    const values = [
      pick(inv, ["client.name", "partner.name", "client_name", "clientName", "partner_name", "customer.name", "buyer.name"]),
      [series, num].filter(Boolean).join(" ") || null,
      date,
      Number(pick(inv, ["total", "totalAmount", "total_amount", "totalValue", "amount", "value", "grand_total", "totals.total"])) || null,
      pick(inv, ["currency", "moneda"]) ?? "RON",
      pick(inv, ["pdf", "pdf_url", "pdfUrl", "link", "url", "public_url", "download_url"]),
    ];
    // fără dată sau din altă lună: doar completăm o factură deja salvată, nu adăugăm una nouă
    if (!date || date < from || date > to) {
      if (date) await pool.query(`UPDATE fin_invoices SET issue_date = $2 WHERE ext_id = $1 AND issue_date IS NULL`, [extId, date]);
      continue;
    }
    inRange++;
    const res = await pool.query(
      `INSERT INTO fin_invoices (kind, source, ext_id, partner, number, issue_date, amount, currency, link, company_id)
       VALUES ('emisa', 'startco', $1, $2, $3, $4, $5, $6, $7, (SELECT id FROM fin_companies WHERE cui = '46466484' LIMIT 1))
       ON CONFLICT (ext_id) DO UPDATE SET issue_date = COALESCE(fin_invoices.issue_date, EXCLUDED.issue_date),
         amount = COALESCE(fin_invoices.amount, EXCLUDED.amount), partner = COALESCE(fin_invoices.partner, EXCLUDED.partner)
       RETURNING (xmax = 0) AS nou`,
      [extId, ...values]
    );
    if (res.rows[0]?.nou) added++;
  }
  return { added, total: inRange };
}
