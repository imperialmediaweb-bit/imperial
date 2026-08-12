// Alerta de credit Anthropic epuizat — motorul platformei s-a oprit, proprietarul
// află IMEDIAT, cu subiect explicit. Rate-limit 6h ca să nu umple inboxul la avalanșă.

import { sendSimpleEmail, ownerEmail } from "./email";

let lastAlertAt = 0;
const COOLDOWN_MS = 6 * 60 * 60 * 1000;

const CREDIT_RE = /credit balance|insufficient credit|billing|purchase credits|balance is too low/i;

export function isCreditError(e: unknown): boolean {
  const msg = String((e as any)?.message ?? (e as any)?.error?.message ?? e ?? "");
  return CREDIT_RE.test(msg);
}

export async function maybeAlertCreditIssue(e: unknown, context: string): Promise<void> {
  if (!isCreditError(e)) return;
  const now = Date.now();
  if (now - lastAlertAt < COOLDOWN_MS) return;
  lastAlertAt = now;
  try {
    await sendSimpleEmail({
      to: ownerEmail(),
      subject: "🔴 CREDIT ANTHROPIC EPUIZAT — platforma NU mai generează",
      html: `<div style="font-family:Inter,Arial,sans-serif;font-size:15px;color:#111;line-height:1.6;">
        <h2 style="margin:0 0 12px;color:#c0392b;">🔴 Creditul Anthropic s-a terminat</h2>
        <p><b>Unde a picat:</b> ${context}</p>
        <p>Rapoartele, consultantul și generatorul de postări NU mai funcționează până reîncarci.</p>
        <p><b>Fix (2 minute):</b> <a href="https://console.anthropic.com/settings/billing">console.anthropic.com → Billing</a> → adaugă credit.
        Recomandat: activează și <b>auto-reload</b> ca să nu se mai repete.</p>
        <p style="color:#666;font-size:13px;">Eroarea brută: ${String((e as any)?.message ?? e).slice(0, 250)}<br/>
        Primești maxim o alertă la 6 ore.</p>
      </div>`,
    });
  } catch (mailErr) {
    console.error("[credit-alert] email failed:", mailErr);
  }
}
