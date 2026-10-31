// Datele panoului pentru o lună: tranzacțiile cu facturile lor, facturile nepotrivite, totaluri.
import { getPool, ensureSchema } from "@/lib/db";
import { lunaRange } from "./luna";

export type TxRow = {
  id: number;
  booking_date: string;
  amount: number;
  currency: string;
  counterparty: string | null;
  description: string | null;
  note: string | null;
  fara_factura: boolean;
  invoices: { id: number; number: string | null; partner: string | null; file_name: string | null; has_file: boolean; link: string | null; match_kind: string | null }[];
};
export type InvRow = { id: number; kind: string; source: string; partner: string | null; number: string | null; issue_date: string | null; amount: number | null; currency: string | null; has_file: boolean; link: string | null };

export async function monthData(luna?: string | null) {
  const r = lunaRange(luna);
  const pool = getPool();
  if (!pool) return { ...r, tx: [] as TxRow[], unmatched: [] as InvRow[], totals: { in: 0, out: 0, missing: 0, count: 0 } };
  await ensureSchema();
  const tx = await pool.query(
    `SELECT t.id, to_char(t.booking_date, 'YYYY-MM-DD') AS booking_date, t.amount::float AS amount, t.currency, t.counterparty, t.description, t.note, t.fara_factura,
       COALESCE((SELECT json_agg(json_build_object('id', i.id, 'number', i.number, 'partner', i.partner, 'file_name', i.file_name, 'has_file', i.file_data IS NOT NULL, 'link', i.link, 'match_kind', i.match_kind) ORDER BY i.id)
                 FROM fin_invoices i WHERE i.transaction_id = t.id), '[]') AS invoices
     FROM bank_transactions t WHERE t.booking_date BETWEEN $1 AND $2 ORDER BY t.booking_date DESC, t.id DESC`,
    [r.from, r.to]
  );
  const un = await pool.query(
    `SELECT id, kind, source, partner, number, to_char(issue_date, 'YYYY-MM-DD') AS issue_date, amount::float AS amount, currency, file_data IS NOT NULL AS has_file, link
     FROM fin_invoices WHERE transaction_id IS NULL AND (issue_date IS NULL OR issue_date BETWEEN ($1::date - 45) AND ($2::date + 10))
     ORDER BY issue_date DESC NULLS LAST, id DESC LIMIT 300`,
    [r.from, r.to]
  );
  const rows = tx.rows as TxRow[];
  const totals = {
    in: rows.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0),
    out: rows.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0),
    missing: rows.filter((t) => !t.invoices.length && !t.fara_factura).length,
    count: rows.length,
  };
  return { ...r, tx: rows, unmatched: un.rows as InvRow[], totals };
}
