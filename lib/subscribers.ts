// Abonații la monitorizarea lunară — activați self-service prin Stripe,
// dezactivați automat la anularea abonamentului (webhook). Zero intervenție umană.

import { getPool, ensureSchema } from "./db";

export async function upsertSubscriber(opts: {
  email: string;
  plan: string;
  stripeSubscriptionId?: string;
}): Promise<void> {
  const pool = getPool();
  if (!pool) return;
  await ensureSchema();
  await pool.query(
    `INSERT INTO subscribers (email, active, plan, stripe_subscription_id, updated_at)
     VALUES (LOWER($1), TRUE, $2, $3, NOW())
     ON CONFLICT (email) DO UPDATE
       SET active = TRUE, plan = $2, stripe_subscription_id = COALESCE($3, subscribers.stripe_subscription_id), updated_at = NOW()`,
    [opts.email, opts.plan, opts.stripeSubscriptionId ?? null]
  );
}

export async function deactivateBySubscriptionId(stripeSubscriptionId: string): Promise<void> {
  const pool = getPool();
  if (!pool) return;
  await ensureSchema();
  await pool.query(
    `UPDATE subscribers SET active = FALSE, updated_at = NOW() WHERE stripe_subscription_id = $1`,
    [stripeSubscriptionId]
  );
}

export async function getSubscription(
  email: string
): Promise<{ active: boolean; plan: string | null; stripe_subscription_id: string | null } | null> {
  const pool = getPool();
  if (!pool) return null;
  await ensureSchema();
  const res = await pool.query(
    `SELECT active, plan, stripe_subscription_id FROM subscribers WHERE email = LOWER($1) LIMIT 1`,
    [email]
  );
  return res.rows[0] ?? null;
}
