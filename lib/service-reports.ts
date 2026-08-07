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
  status: "pending" | "done" | "error";
};

// Generarea rulează pe FUNDAL (proxy-urile taie conexiunile lungi — Cloudflare la 100s):
// rândul se creează întâi "pending", apoi trece în "done" cu raportul, sau "error".
export async function insertPendingServiceReport(opts: { token: string; formData: any }): Promise<boolean> {
  const pool = getPool();
  if (!pool) return false;
  await ensureSchema();
  await pool.query(
    `INSERT INTO service_reports (token, form_data, status) VALUES ($1, $2, 'pending')`,
    [opts.token, JSON.stringify(opts.formData)]
  );
  return true;
}

export async function completeServiceReport(token: string, report: any): Promise<void> {
  const pool = getPool();
  if (!pool) return;
  await pool.query(`UPDATE service_reports SET report = $2, status = 'done' WHERE token = $1`, [
    token,
    JSON.stringify(report),
  ]);
}

export async function failServiceReport(token: string): Promise<void> {
  const pool = getPool();
  if (!pool) return;
  await pool.query(`UPDATE service_reports SET status = 'error' WHERE token = $1`, [token]);
}

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
