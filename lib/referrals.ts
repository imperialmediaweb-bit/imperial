// Program de recomandare: fiecare client are un cod scurt (derivat din email),
// linkul lui e /service?ref=COD. Fiecare firmă care PLĂTEȘTE venind prin link
// = 1 lună de monitorizare gratis pentru cel care a recomandat.

import { createHmac } from "crypto";
import { getPool, ensureSchema } from "./db";

function getSecret(): string {
  return process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || "imperial-ref";
}

// Cod determinist, scurt, fără tabel separat.
export function refCodeForEmail(email: string): string {
  return createHmac("sha256", getSecret())
    .update(`ref:${email.toLowerCase().trim()}`)
    .digest("base64url")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 8)
    .toLowerCase();
}

// Câte firme plătite au venit prin codul ăsta (fără rapoartele proprii —
// nu te poți recomanda pe tine însuți).
export async function countPaidReferrals(code: string, excludeEmail?: string): Promise<number> {
  const pool = getPool();
  if (!pool) return 0;
  await ensureSchema();
  const res = await pool.query(
    `SELECT COUNT(*)::int AS n FROM service_reports
     WHERE paid = TRUE AND form_data->>'ref' = $1
       AND ($2::text IS NULL OR LOWER(COALESCE(email, '')) <> LOWER($2))`,
    [code, excludeEmail ?? null]
  );
  return res.rows[0]?.n ?? 0;
}
