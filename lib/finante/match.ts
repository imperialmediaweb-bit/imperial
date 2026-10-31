// Potrivirea automată tranzacție ↔ factură, cu scor:
//  · suma: aceeași sumă (la 1 leu), sau convertită la cursul BNR dacă factura e în EUR/USD (toleranță 3%)
//  · data: factura cu cel mult 45 de zile înainte de plată sau 10 zile după
//  · furnizorul: cuvinte din descrierea plății (RAILWAY, ANTHROPIC, FACEBK…) regăsite în numele furnizorului
// Plățile (negative) ↔ facturi primite; încasările ↔ facturi emise. Doar potrivirile clare se leagă singure.

import { getPool } from "@/lib/db";
import { rateRon } from "./fx";

// alias-uri: ce scrie banca în descriere → cum apare furnizorul pe factură
const ALIAS: [RegExp, RegExp][] = [
  [/facebk|facebook|meta|fb\.me/i, /meta|facebook/i],
  [/google|gsuite|workspace/i, /google/i],
  [/railway/i, /railway/i],
  [/anthropic|claude/i, /anthropic/i],
  [/openai|chatgpt/i, /openai/i],
  [/supermetrics/i, /supermetrics/i],
  [/splm|siteq/i, /splm|siteq/i],
  [/vercel/i, /vercel/i],
  [/cloudinary/i, /cloudinary/i],
  [/hostinger/i, /hostinger/i],
  [/rotld/i, /rotld/i],
  [/mailerlite/i, /mailerlite/i],
];

const words = (s: string) => (s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").match(/[a-z]{4,}/g) ?? []).filter((w) => !["plata", "card", "incasare", "from", "factura", "pentru", "transfer", "comision"].includes(w));

function partnerScore(txText: string, partner: string | null): number {
  if (!partner) return 0;
  for (const [tx, inv] of ALIAS) if (tx.test(txText) && inv.test(partner)) return 2;
  const p = new Set(words(partner));
  return words(txText).some((w) => p.has(w)) ? 1 : 0;
}

export async function autoMatch(from: string, to: string, companyId: number | null = null): Promise<number> {
  const pool = getPool();
  if (!pool) return 0;
  const tx = (
    await pool.query(
      `SELECT t.id, t.company_id, to_char(t.booking_date, 'YYYY-MM-DD') AS d, t.amount::float AS amount, t.currency, COALESCE(t.counterparty, '') || ' ' || COALESCE(t.description, '') AS text
       FROM bank_transactions t
       WHERE t.booking_date BETWEEN $1::date AND $2::date AND NOT t.fara_factura
         AND ($3::int IS NULL OR t.company_id = $3)
         AND NOT EXISTS (SELECT 1 FROM fin_invoices x WHERE x.transaction_id = t.id)`,
      [from, to, companyId]
    )
  ).rows;
  const inv = (
    await pool.query(
      `SELECT id, kind, company_id, partner, to_char(issue_date, 'YYYY-MM-DD') AS d, amount::float AS amount, COALESCE(currency, 'RON') AS currency
       FROM fin_invoices WHERE transaction_id IS NULL AND amount IS NOT NULL
         AND (issue_date IS NULL OR issue_date BETWEEN ($1::date - 45) AND ($2::date + 10))`,
      [from, to]
    )
  ).rows;

  type Cand = { tx: number; inv: number; score: number };
  const cands: Cand[] = [];
  for (const t of tx) {
    const abs = Math.abs(t.amount);
    for (const i of inv) {
      if (i.kind !== (t.amount < 0 ? "primita" : "emisa")) continue;
      // factura altei firme nu se leagă niciodată; factura nealocată poate fi legată doar dacă plata are firmă
      if (i.company_id != null && t.company_id != null && i.company_id !== t.company_id) continue;
      if (i.d) {
        const diff = (Date.parse(t.d) - Date.parse(i.d)) / 864e5;
        if (diff > 45 || diff < -10) continue;
      }
      let sumOk = false;
      if (i.currency === t.currency) sumOk = Math.abs(abs - i.amount) <= 1;
      else if (t.currency === "RON") {
        const r = await rateRon(i.currency, t.d);
        if (r) sumOk = Math.abs(abs - i.amount * r) <= Math.max(1, abs * 0.03);
      }
      if (!sumOk) continue;
      const ps = partnerScore(t.text, i.partner);
      const days = i.d ? Math.abs(Date.parse(t.d) - Date.parse(i.d)) / 864e5 : 30;
      cands.push({ tx: t.id, inv: i.id, score: 10 + ps * 5 - days / 10 });
    }
  }
  // legăm doar unde e clar: fiecare tranzacție și fiecare factură o singură dată, cel mai mare scor primul;
  // dacă două facturi au același scor pentru o plată (ambiguu), nu legăm automat
  cands.sort((a, b) => b.score - a.score);
  const usedTx = new Set<number>();
  const usedInv = new Set<number>();
  let n = 0;
  for (const c of cands) {
    if (usedTx.has(c.tx) || usedInv.has(c.inv)) continue;
    const rivals = cands.filter((x) => x.tx === c.tx && !usedInv.has(x.inv) && x.inv !== c.inv && Math.abs(x.score - c.score) < 0.5);
    if (rivals.length) continue;
    await pool.query(
      `UPDATE fin_invoices SET transaction_id = $1, match_kind = 'auto', company_id = COALESCE(company_id, (SELECT company_id FROM bank_transactions WHERE id = $1)) WHERE id = $2 AND transaction_id IS NULL`,
      [c.tx, c.inv]
    );
    usedTx.add(c.tx);
    usedInv.add(c.inv);
    n++;
  }
  return n;
}
