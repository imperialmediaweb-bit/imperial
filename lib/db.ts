// Postgres pool + auto-migration pentru schema brief-urilor.
// Folosește DATABASE_URL (Railway îl populează automat când adaugi Postgres add-on).
// Dacă DATABASE_URL lipsește, exportăm `db = null` și callerii pot degrada grațios.

import { Pool } from "pg";
import type { PoolConfig } from "pg";

let _pool: Pool | null = null;
let _migrated = false;

function getConfig(): PoolConfig | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;

  // Railway/Neon/Supabase — SSL e obligatoriu pe conexiuni externe.
  const needsSsl = /sslmode=require|\.railway\.|\.neon\.|\.supabase\./.test(url);
  return {
    connectionString: url,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  };
}

export function hasDb(): boolean {
  return !!process.env.DATABASE_URL;
}

export function getPool(): Pool | null {
  if (_pool) return _pool;
  const cfg = getConfig();
  if (!cfg) return null;
  _pool = new Pool(cfg);
  _pool.on("error", (err) => {
    console.error("[db] pool error:", err);
  });
  return _pool;
}

// Rulează migrarea idempotentă la prima cerere (CREATE TABLE IF NOT EXISTS).
export async function ensureSchema(): Promise<void> {
  if (_migrated) return;
  const pool = getPool();
  if (!pool) return;

  const sql = `
    CREATE TABLE IF NOT EXISTS briefs (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      status TEXT NOT NULL DEFAULT 'nou',

      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,

      selected_package TEXT,
      industry TEXT,
      current_site TEXT,
      pages TEXT,
      deadline TEXT,
      has_logo TEXT,
      colors_preference TEXT,
      features JSONB DEFAULT '[]'::jsonb,
      inspiration TEXT,
      message TEXT,

      ai_estimate_min INT,
      ai_estimate_max INT,
      ai_estimate_reason TEXT,
      ai_recommended_package TEXT,
      ai_recommended_reason TEXT,

      source TEXT,
      ip_hash TEXT,
      user_agent TEXT,

      admin_notes TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_briefs_created ON briefs(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_briefs_status ON briefs(status);

    CREATE TABLE IF NOT EXISTS service_reports (
      id SERIAL PRIMARY KEY,
      token TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
      report JSONB NOT NULL DEFAULT '{}'::jsonb,
      email TEXT,
      paid BOOLEAN NOT NULL DEFAULT FALSE,
      paid_at TIMESTAMPTZ
    );

    CREATE INDEX IF NOT EXISTS idx_service_reports_token ON service_reports(token);
    CREATE INDEX IF NOT EXISTS idx_service_reports_created ON service_reports(created_at DESC);
  `;

  try {
    await pool.query(sql);
    _migrated = true;
    console.log("[db] schema ready");
  } catch (e) {
    console.error("[db] migration failed:", e);
    throw e;
  }
}
