// Persistența rapoartelor /service (audit plătit).
// Raportul se generează complet, se salvează cu un token unic, iar vizitatorul
// vede doar preview-ul până plătește. Fără DATABASE_URL → degradare grațioasă.

import { getPool, ensureSchema } from "./db";

export type ServiceReportRow = {
  id: number;
  token: string;
  created_at: string;
  form_data: any;
  report: any;
  email: string | null;
  paid: boolean;
  paid_at: string | null;
};

export async function insertServiceReport(opts: {
  token: string;
  formData: any;
  report: any;
}): Promise<boolean> {
  const pool = getPool();
  if (!pool) return false;
  await ensureSchema();
  await pool.query(
    `INSERT INTO service_reports (token, form_data, report) VALUES ($1, $2, $3)`,
    [opts.token, JSON.stringify(opts.formData), JSON.stringify(opts.report)]
  );
  return true;
}

export async function getServiceReport(token: string): Promise<ServiceReportRow | null> {
  const pool = getPool();
  if (!pool) return null;
  await ensureSchema();
  const res = await pool.query(`SELECT * FROM service_reports WHERE token = $1 LIMIT 1`, [token]);
  return (res.rows[0] as ServiceReportRow) ?? null;
}

export async function getServiceReportsByEmail(email: string): Promise<ServiceReportRow[]> {
  const pool = getPool();
  if (!pool) return [];
  await ensureSchema();
  const res = await pool.query(
    `SELECT * FROM service_reports WHERE LOWER(email) = LOWER($1) ORDER BY created_at ASC`,
    [email]
  );
  return res.rows as ServiceReportRow[];
}

// Leagă emailul de raport (ex: userul lasă emailul în raport, în modul de lansare fără Stripe).
export async function setServiceReportEmail(token: string, email: string): Promise<boolean> {
  const pool = getPool();
  if (!pool) return false;
  await ensureSchema();
  const res = await pool.query(
    `UPDATE service_reports SET email = $2 WHERE token = $1 AND (email IS NULL OR email = '')`,
    [token, email]
  );
  return (res.rowCount ?? 0) > 0;
}

export async function markServiceReportPaid(token: string, email?: string): Promise<boolean> {
  const pool = getPool();
  if (!pool) return false;
  await ensureSchema();
  const res = await pool.query(
    `UPDATE service_reports SET paid = TRUE, paid_at = NOW(), email = COALESCE($2, email) WHERE token = $1`,
    [token, email ?? null]
  );
  return (res.rowCount ?? 0) > 0;
}
