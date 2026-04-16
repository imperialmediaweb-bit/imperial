// Operații pe brief-uri: insert, list (cu filtre), get, update status.
// Toate funcțiile fac ensureSchema() ca prima execuție să inițializeze tabela.

import { ensureSchema, getPool } from "./db";
import type { BriefStatus } from "./brief-types";
export type { BriefStatus } from "./brief-types";
export { STATUS_LABELS, STATUS_COLORS } from "./brief-types";

export type BriefRecord = {
  id: number;
  created_at: Date;
  status: BriefStatus;
  name: string;
  email: string;
  phone: string | null;
  selected_package: string | null;
  industry: string | null;
  current_site: string | null;
  pages: string | null;
  deadline: string | null;
  has_logo: string | null;
  colors_preference: string | null;
  features: string[];
  inspiration: string | null;
  message: string | null;
  ai_estimate_min: number | null;
  ai_estimate_max: number | null;
  ai_estimate_reason: string | null;
  ai_recommended_package: string | null;
  ai_recommended_reason: string | null;
  source: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  admin_notes: string | null;
};

export type NewBrief = {
  name: string;
  email: string;
  phone?: string;
  selected_package?: string;
  industry?: string;
  current_site?: string;
  pages?: string;
  deadline?: string;
  has_logo?: string;
  colors_preference?: string;
  features?: string[];
  inspiration?: string;
  message?: string;
  ai_estimate_min?: number | null;
  ai_estimate_max?: number | null;
  ai_estimate_reason?: string;
  ai_recommended_package?: string;
  ai_recommended_reason?: string;
  source?: string;
  ip_hash?: string;
  user_agent?: string;
};

function rowToBrief(r: any): BriefRecord {
  return {
    id: r.id,
    created_at: new Date(r.created_at),
    status: (r.status ?? "nou") as BriefStatus,
    name: r.name,
    email: r.email,
    phone: r.phone ?? null,
    selected_package: r.selected_package ?? null,
    industry: r.industry ?? null,
    current_site: r.current_site ?? null,
    pages: r.pages ?? null,
    deadline: r.deadline ?? null,
    has_logo: r.has_logo ?? null,
    colors_preference: r.colors_preference ?? null,
    features: Array.isArray(r.features) ? r.features : [],
    inspiration: r.inspiration ?? null,
    message: r.message ?? null,
    ai_estimate_min: r.ai_estimate_min ?? null,
    ai_estimate_max: r.ai_estimate_max ?? null,
    ai_estimate_reason: r.ai_estimate_reason ?? null,
    ai_recommended_package: r.ai_recommended_package ?? null,
    ai_recommended_reason: r.ai_recommended_reason ?? null,
    source: r.source ?? null,
    ip_hash: r.ip_hash ?? null,
    user_agent: r.user_agent ?? null,
    admin_notes: r.admin_notes ?? null,
  };
}

export async function insertBrief(b: NewBrief): Promise<number | null> {
  const pool = getPool();
  if (!pool) return null;
  await ensureSchema();

  const { rows } = await pool.query(
    `INSERT INTO briefs (
      name, email, phone, selected_package, industry, current_site,
      pages, deadline, has_logo, colors_preference, features,
      inspiration, message, ai_estimate_min, ai_estimate_max,
      ai_estimate_reason, ai_recommended_package, ai_recommended_reason,
      source, ip_hash, user_agent
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21
    ) RETURNING id`,
    [
      b.name,
      b.email,
      b.phone ?? null,
      b.selected_package ?? null,
      b.industry ?? null,
      b.current_site ?? null,
      b.pages ?? null,
      b.deadline ?? null,
      b.has_logo ?? null,
      b.colors_preference ?? null,
      JSON.stringify(b.features ?? []),
      b.inspiration ?? null,
      b.message ?? null,
      b.ai_estimate_min ?? null,
      b.ai_estimate_max ?? null,
      b.ai_estimate_reason ?? null,
      b.ai_recommended_package ?? null,
      b.ai_recommended_reason ?? null,
      b.source ?? null,
      b.ip_hash ?? null,
      b.user_agent ?? null,
    ]
  );
  return rows[0]?.id ?? null;
}

export type ListFilters = {
  status?: BriefStatus;
  search?: string;
  limit?: number;
  offset?: number;
};

export async function listBriefs(
  f: ListFilters = {}
): Promise<{ rows: BriefRecord[]; total: number; counts: Record<BriefStatus, number> }> {
  const pool = getPool();
  if (!pool) {
    return {
      rows: [],
      total: 0,
      counts: { nou: 0, ofertat: 0, client: 0, refuzat: 0 },
    };
  }
  await ensureSchema();

  const where: string[] = [];
  const params: any[] = [];
  if (f.status) {
    where.push(`status = $${params.length + 1}`);
    params.push(f.status);
  }
  if (f.search) {
    const i = params.length + 1;
    where.push(
      `(name ILIKE $${i} OR email ILIKE $${i} OR industry ILIKE $${i} OR message ILIKE $${i})`
    );
    params.push(`%${f.search}%`);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const limit = f.limit ?? 50;
  const offset = f.offset ?? 0;

  const [rowsRes, totalRes, countsRes] = await Promise.all([
    pool.query(
      `SELECT * FROM briefs ${whereSql} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
      params
    ),
    pool.query(`SELECT COUNT(*)::int AS c FROM briefs ${whereSql}`, params),
    pool.query(
      `SELECT status, COUNT(*)::int AS c FROM briefs GROUP BY status`
    ),
  ]);

  const counts: Record<BriefStatus, number> = {
    nou: 0,
    ofertat: 0,
    client: 0,
    refuzat: 0,
  };
  for (const r of countsRes.rows) {
    if (r.status in counts) {
      (counts as any)[r.status] = r.c;
    }
  }

  return {
    rows: rowsRes.rows.map(rowToBrief),
    total: totalRes.rows[0]?.c ?? 0,
    counts,
  };
}

export async function getBrief(id: number): Promise<BriefRecord | null> {
  const pool = getPool();
  if (!pool) return null;
  await ensureSchema();
  const { rows } = await pool.query(`SELECT * FROM briefs WHERE id = $1`, [id]);
  return rows[0] ? rowToBrief(rows[0]) : null;
}

export async function updateStatus(
  id: number,
  status: BriefStatus
): Promise<void> {
  const pool = getPool();
  if (!pool) return;
  await pool.query(`UPDATE briefs SET status = $1 WHERE id = $2`, [status, id]);
}

export async function updateNotes(id: number, notes: string): Promise<void> {
  const pool = getPool();
  if (!pool) return;
  await pool.query(`UPDATE briefs SET admin_notes = $1 WHERE id = $2`, [
    notes,
    id,
  ]);
}
