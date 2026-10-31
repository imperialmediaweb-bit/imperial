// Potrivirea automată tranzacție ↔ factură: aceeași sumă (la 1 leu), aceeași monedă,
// factura emisă cu cel mult 45 de zile înainte de plată sau 7 zile după.
// Plățile (sume negative) se potrivesc cu facturi primite, încasările cu facturi emise.

import { getPool } from "@/lib/db";

export async function autoMatch(from: string, to: string): Promise<number> {
  const pool = getPool();
  if (!pool) return 0;
  const { rowCount } = await pool.query(
    `WITH cand AS (
       SELECT DISTINCT ON (t.id) t.id AS tx, i.id AS inv
       FROM bank_transactions t
       JOIN fin_invoices i
         ON i.transaction_id IS NULL
        AND i.amount IS NOT NULL
        AND ABS(ABS(t.amount) - i.amount) <= 1
        AND COALESCE(i.currency, 'RON') = t.currency
        AND i.kind = CASE WHEN t.amount < 0 THEN 'primita' ELSE 'emisa' END
        AND (i.issue_date IS NULL OR i.issue_date BETWEEN t.booking_date - 45 AND t.booking_date + 7)
       WHERE t.booking_date BETWEEN $1::date AND $2::date
         AND NOT EXISTS (SELECT 1 FROM fin_invoices x WHERE x.transaction_id = t.id)
       ORDER BY t.id, ABS(COALESCE(i.issue_date, t.booking_date) - t.booking_date)
     ), uniq AS (
       SELECT DISTINCT ON (inv) tx, inv FROM cand ORDER BY inv, tx
     )
     UPDATE fin_invoices f SET transaction_id = u.tx, match_kind = 'auto'
     FROM uniq u WHERE f.id = u.inv AND f.transaction_id IS NULL`,
    [from, to]
  );
  return rowCount ?? 0;
}
