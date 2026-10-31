// Citirea conturilor Banca Transilvania prin Enable Banking (open banking, PSD2).
// Docs: https://enablebanking.com/docs/api/reference/
// Env (Railway): ENABLEBANKING_APP_ID, ENABLEBANKING_PRIVATE_KEY (PEM, poate avea \n escapate).
// Flux: startAuth → Ionuț se autentifică în aplicația BT → callback cu ?code → createSession → syncTransactions.

import { createSign } from "crypto";
import { getPool, ensureSchema } from "@/lib/db";

const BASE = "https://api.enablebanking.com";
export const BANK_NAME = "Banca Transilvania";

export function bankingConfigured(): boolean {
  return !!(process.env.ENABLEBANKING_APP_ID && process.env.ENABLEBANKING_PRIVATE_KEY);
}

const b64url = (b: Buffer | string) => Buffer.from(b).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

function jwt(): string {
  const now = Math.floor(Date.now() / 1000);
  const header = { typ: "JWT", alg: "RS256", kid: process.env.ENABLEBANKING_APP_ID };
  const payload = { iss: "enablebanking.com", aud: "api.enablebanking.com", iat: now, exp: now + 3600 };
  const data = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
  const key = process.env.ENABLEBANKING_PRIVATE_KEY!.replace(/\\n/g, "\n");
  const sig = createSign("RSA-SHA256").update(data).sign(key);
  return `${data}.${b64url(sig)}`;
}

async function eb(path: string, init: RequestInit = {}): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${jwt()}`, "Content-Type": "application/json", ...(init.headers ?? {}) },
    signal: AbortSignal.timeout(30_000),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`Enable Banking ${path} → ${res.status}: ${JSON.stringify(data).slice(0, 300)}`);
  return data;
}

// Pasul 1: link spre autentificarea în BT (valabil 180 de zile, cât permite banca)
export async function startAuth(redirectUrl: string, state: string): Promise<string> {
  const validUntil = new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString();
  const r = await eb("/auth", {
    method: "POST",
    body: JSON.stringify({
      access: { valid_until: validUntil },
      aspsp: { name: BANK_NAME, country: "RO" },
      state,
      redirect_url: redirectUrl,
      psu_type: "business",
    }),
  });
  if (!r?.url) throw new Error("Enable Banking nu a întors linkul de autentificare");
  return r.url;
}

// Pasul 2: după autentificare, sesiunea cu conturile firmei
export async function createSession(code: string, companyId: number | null = null): Promise<void> {
  const s = await eb("/sessions", { method: "POST", body: JSON.stringify({ code }) });
  const pool = getPool();
  if (!pool) throw new Error("Baza de date lipsește");
  await ensureSchema();
  const accounts = (s.accounts ?? []).map((a: any) => ({
    uid: a.uid,
    iban: a.account_id?.iban ?? null,
    currency: a.currency ?? null,
    name: a.name ?? a.product ?? null,
  }));
  await pool.query(`UPDATE bank_connections SET active = FALSE WHERE bank = $1 AND company_id IS NOT DISTINCT FROM $2`, [BANK_NAME, companyId]);
  await pool.query(
    `INSERT INTO bank_connections (bank, session_id, accounts, valid_until, company_id) VALUES ($1, $2, $3, $4, $5)`,
    [BANK_NAME, s.session_id, JSON.stringify(accounts), s.access?.valid_until ?? null, companyId]
  );
}

export async function activeConnection(companyId: number | null = null): Promise<{ id: number; session_id: string; accounts: any[]; valid_until: string | null; last_sync: string | null; company_id: number | null } | null> {
  const pool = getPool();
  if (!pool) return null;
  await ensureSchema();
  const { rows } = await pool.query(`SELECT id, session_id, accounts, valid_until, last_sync, company_id FROM bank_connections WHERE active = TRUE AND ($1::int IS NULL OR company_id = $1) ORDER BY created_at DESC LIMIT 1`, [companyId]);
  return rows[0] ?? null;
}

// Pasul 3: tranzacțiile din intervalul ales, pentru toate conturile; plăți = sume negative
export async function syncTransactions(dateFrom: string, dateTo: string, companyId: number | null = null): Promise<{ added: number; total: number }> {
  const conn = await activeConnection(companyId);
  if (!conn) throw new Error("Banca nu e conectată");
  const pool = getPool()!;
  let added = 0;
  let total = 0;
  for (const acc of conn.accounts) {
    let cont: string | undefined;
    for (let page = 0; page < 50; page++) {
      const q = new URLSearchParams({ date_from: dateFrom, date_to: dateTo, ...(cont ? { continuation_key: cont } : {}) });
      const r = await eb(`/accounts/${acc.uid}/transactions?${q}`);
      for (const t of r.transactions ?? []) {
        total++;
        const amount = Number(t.transaction_amount?.amount ?? 0) * (t.credit_debit_indicator === "DBIT" ? -1 : 1);
        const counterparty = t.credit_debit_indicator === "DBIT" ? t.creditor?.name : t.debtor?.name;
        const description = [].concat(t.remittance_information ?? []).join(" ").trim() || t.note || "";
        const extId = `${acc.uid}:${t.entry_reference ?? t.transaction_id ?? `${t.booking_date}:${amount}:${description}`}`;
        const res = await pool.query(
          `INSERT INTO bank_transactions (ext_id, account_uid, account_iban, booking_date, amount, currency, counterparty, description, raw, company_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (ext_id) DO NOTHING`,
          [extId, acc.uid, acc.iban, t.booking_date ?? t.value_date, amount, t.transaction_amount?.currency ?? "RON", counterparty ?? null, description, JSON.stringify(t), conn.company_id]
        );
        added += res.rowCount ?? 0;
      }
      cont = r.continuation_key;
      if (!cont) break;
    }
  }
  await pool.query(`UPDATE bank_connections SET last_sync = NOW() WHERE id = $1`, [conn.id]);
  return { added, total };
}
