// Monitorizare lunară: snapshot-uri de scanare per firmă + notificări per client.
// Snapshot = poza lunii (rating, recenzii, competitori, site) — comparând două
// snapshot-uri consecutive generăm notificările („ai 3 recenzii noi", „site picat").

import { getPool, ensureSchema } from "./db";

export type MonitorSnapshot = {
  rating: number | null;
  reviewCount: number;
  siteUp: boolean | null;
  siteMs: number | null;
  competitors: Array<{ name: string; rating: number | null; reviewCount: number }>;
};

export async function insertSnapshot(reportToken: string, email: string | null, data: MonitorSnapshot) {
  const pool = getPool();
  if (!pool) return;
  await ensureSchema();
  await pool.query(
    `INSERT INTO monitor_snapshots (report_token, email, data) VALUES ($1, $2, $3)`,
    [reportToken, email, JSON.stringify(data)]
  );
}

export async function getLatestSnapshot(
  reportToken: string
): Promise<{ data: MonitorSnapshot; createdAt: Date } | null> {
  const pool = getPool();
  if (!pool) return null;
  await ensureSchema();
  const res = await pool.query(
    `SELECT data, created_at FROM monitor_snapshots WHERE report_token = $1 ORDER BY created_at DESC LIMIT 1`,
    [reportToken]
  );
  if (!res.rows[0]) return null;
  return { data: res.rows[0].data as MonitorSnapshot, createdAt: new Date(res.rows[0].created_at) };
}

export type ClientNotification = {
  id: number;
  created_at: string;
  kind: string;
  title: string;
  body: string | null;
  seen: boolean;
};

export async function insertNotification(email: string, kind: string, title: string, body?: string) {
  const pool = getPool();
  if (!pool) return;
  await ensureSchema();
  await pool.query(
    `INSERT INTO client_notifications (email, kind, title, body) VALUES ($1, $2, $3, $4)`,
    [email.toLowerCase(), kind, title, body ?? null]
  );
}

export async function getNotifications(email: string, limit = 30): Promise<ClientNotification[]> {
  const pool = getPool();
  if (!pool) return [];
  await ensureSchema();
  const res = await pool.query(
    `SELECT id, created_at, kind, title, body, seen FROM client_notifications
     WHERE LOWER(email) = LOWER($1) ORDER BY created_at DESC LIMIT $2`,
    [email, limit]
  );
  return res.rows as ClientNotification[];
}

export async function markNotificationsSeen(email: string) {
  const pool = getPool();
  if (!pool) return;
  await ensureSchema();
  await pool.query(
    `UPDATE client_notifications SET seen = TRUE WHERE LOWER(email) = LOWER($1) AND seen = FALSE`,
    [email]
  );
}
