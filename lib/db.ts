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
    CREATE INDEX IF NOT EXISTS idx_service_reports_email ON service_reports(email);
    ALTER TABLE service_reports ADD COLUMN IF NOT EXISTS followup_stage INT NOT NULL DEFAULT 0;
    ALTER TABLE service_reports ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'done';

    -- Monitorizare lunară: snapshot-uri de scanare per raport (firmă) + notificări per client
    CREATE TABLE IF NOT EXISTS monitor_snapshots (
      id SERIAL PRIMARY KEY,
      report_token TEXT NOT NULL,
      email TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      data JSONB NOT NULL DEFAULT '{}'::jsonb
    );
    CREATE INDEX IF NOT EXISTS idx_monitor_snapshots_token ON monitor_snapshots(report_token, created_at DESC);

    CREATE TABLE IF NOT EXISTS subscribers (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      active BOOLEAN NOT NULL DEFAULT FALSE,
      plan TEXT,
      stripe_subscription_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);

    CREATE TABLE IF NOT EXISTS client_notifications (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      kind TEXT NOT NULL DEFAULT 'info',
      title TEXT NOT NULL,
      body TEXT,
      seen BOOLEAN NOT NULL DEFAULT FALSE
    );
    CREATE INDEX IF NOT EXISTS idx_client_notifications_email ON client_notifications(email, created_at DESC);

    -- Coada de articole de presă pentru rețeaua Media Expres (feed-ul /api/presa-feed)
    -- draft (așteaptă aprobarea ta) → ready (în feed, rețeaua îl publică) → published
    CREATE TABLE IF NOT EXISTS press_articles (
      id SERIAL PRIMARY KEY,
      token TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      title TEXT NOT NULL,
      content_html TEXT NOT NULL,
      image_url TEXT,
      judet TEXT,
      distributie TEXT NOT NULL DEFAULT 'local',
      publica_dupa DATE,
      client_email TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      published_urls JSONB NOT NULL DEFAULT '[]'::jsonb
    );
    CREATE INDEX IF NOT EXISTS idx_press_articles_status ON press_articles(status, created_at DESC);

    -- ───── Finanțe (finante.imperial-media.ro) ─────
    CREATE TABLE IF NOT EXISTS finance_users (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      role TEXT NOT NULL DEFAULT 'contabil',
      password_hash TEXT NOT NULL,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      last_login TIMESTAMPTZ
    );
    CREATE TABLE IF NOT EXISTS finance_audit (
      id SERIAL PRIMARY KEY,
      at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      user_email TEXT,
      action TEXT NOT NULL,
      detail TEXT,
      ip TEXT
    );
    CREATE TABLE IF NOT EXISTS bank_connections (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      bank TEXT NOT NULL,
      session_id TEXT NOT NULL,
      accounts JSONB NOT NULL DEFAULT '[]'::jsonb,
      valid_until TIMESTAMPTZ,
      last_sync TIMESTAMPTZ,
      active BOOLEAN NOT NULL DEFAULT TRUE
    );
    CREATE TABLE IF NOT EXISTS bank_transactions (
      id SERIAL PRIMARY KEY,
      ext_id TEXT NOT NULL UNIQUE,
      account_uid TEXT,
      account_iban TEXT,
      booking_date DATE NOT NULL,
      amount NUMERIC(14,2) NOT NULL,
      currency TEXT NOT NULL DEFAULT 'RON',
      counterparty TEXT,
      description TEXT,
      raw JSONB,
      note TEXT,
      fara_factura BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_bank_tx_date ON bank_transactions(booking_date DESC);
    CREATE TABLE IF NOT EXISTS fin_invoices (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      kind TEXT NOT NULL,
      source TEXT NOT NULL,
      ext_id TEXT UNIQUE,
      partner TEXT,
      number TEXT,
      issue_date DATE,
      amount NUMERIC(14,2),
      currency TEXT DEFAULT 'RON',
      file_name TEXT,
      file_mime TEXT,
      file_data BYTEA,
      link TEXT,
      transaction_id INTEGER REFERENCES bank_transactions(id) ON DELETE SET NULL,
      match_kind TEXT,
      uploaded_by TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_fin_inv_date ON fin_invoices(issue_date DESC);
    CREATE INDEX IF NOT EXISTS idx_fin_inv_tx ON fin_invoices(transaction_id);
    CREATE TABLE IF NOT EXISTS fin_mailboxes (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      email TEXT NOT NULL UNIQUE,
      host TEXT NOT NULL DEFAULT 'imap.gmail.com',
      port INTEGER NOT NULL DEFAULT 993,
      password_enc TEXT NOT NULL,
      last_sync TIMESTAMPTZ,
      last_error TEXT
    );
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
