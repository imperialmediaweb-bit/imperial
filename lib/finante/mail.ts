// Facturile primite pe email — din toate căsuțele adăugate în panou (Gmail sau domeniu, prin IMAP).
// Căutăm emailurile cu PDF atașat și cuvinte de factură din luna aleasă, salvăm PDF-ul și
// citim din el furnizorul, numărul, data și suma (Claude, doar pe PDF-urile noi).

import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { getPool, ensureSchema } from "@/lib/db";
import { decrypt } from "./auth";
import { CLAUDE_MODEL, getAnthropic } from "@/lib/ai";
import { storeFile } from "./storage";
import { detectCompany, listCompanies, looksLikePerson, type Company } from "./companies";

const WORDS = ["factura", "factură", "invoice", "receipt", "chitanta", "chitanță", "bon fiscal", "billing", "plată", "payment"];

type Extract = { partner: string | null; number: string | null; issue_date: string | null; amount: number | null; currency: string | null; buyer_name: string | null; buyer_cui: string | null };

// Claude citește PDF-ul facturii și întoarce câmpurile — fără să inventeze
async function readInvoice(pdf: Buffer, hint: string): Promise<Extract> {
  const empty = { partner: null, number: null, issue_date: null, amount: null, currency: null, buyer_name: null, buyer_cui: null };
  if (!process.env.ANTHROPIC_API_KEY || pdf.length > 8_000_000) return empty;
  try {
    const r = await getAnthropic().messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: [
            { type: "document", source: { type: "base64", media_type: "application/pdf", data: pdf.toString("base64") } } as any,
            {
              type: "text",
              text: `Este o factură primită (${hint}). Răspunde DOAR cu JSON: {"partner": "emitentul facturii (furnizorul)", "number": "seria și numărul", "issue_date": "AAAA-LL-ZZ", "amount": total de plată ca număr, "currency": "RON/EUR/USD", "buyer_name": "cumpărătorul / clientul facturat (firmă sau persoană)", "buyer_cui": "CUI/CIF/VAT-ul cumpărătorului, doar cifrele, dacă apare"}. Pune null unde nu e clar. Nu inventa.`,
            },
          ],
        },
      ],
    });
    const text = r.content.filter((c) => c.type === "text").map((c: any) => c.text).join("");
    const j = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
    return {
      partner: typeof j.partner === "string" ? j.partner.slice(0, 120) : null,
      number: typeof j.number === "string" ? j.number.slice(0, 60) : null,
      issue_date: /^\d{4}-\d{2}-\d{2}$/.test(j.issue_date ?? "") ? j.issue_date : null,
      amount: Number.isFinite(Number(j.amount)) ? Number(j.amount) : null,
      currency: typeof j.currency === "string" ? j.currency.slice(0, 3).toUpperCase() : null,
      buyer_name: typeof j.buyer_name === "string" ? j.buyer_name.slice(0, 160) : null,
      buyer_cui: typeof j.buyer_cui === "string" || typeof j.buyer_cui === "number" ? String(j.buyer_cui).replace(/\D/g, "").slice(0, 15) || null : null,
    };
  } catch {
    return empty;
  }
}

export async function syncMailbox(mb: { id: number; email: string; host: string; port: number; password_enc: string; company_id?: number | null }, from: Date, to: Date, companies: Company[] = []): Promise<{ found: number; added: number }> {
  const pool = getPool()!;
  const client = new ImapFlow({ host: mb.host, port: mb.port, secure: true, auth: { user: mb.email, pass: decrypt(mb.password_enc) }, logger: false });
  let found = 0;
  let added = 0;
  await client.connect();
  try {
    const gmail = /gmail\.com$/i.test(mb.host);
    const lock = await client.getMailboxLock(gmail ? "[Gmail]/All Mail" : "INBOX").catch(() => client.getMailboxLock("INBOX"));
    try {
      const fmt = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, "/");
      const uids: number[] = gmail
        ? ((await client.search({ gmraw: `has:attachment filename:pdf (${WORDS.map((w) => `"${w}"`).join(" OR ")}) after:${fmt(from)} before:${fmt(to)}` } as any, { uid: true })) || [])
        : ((await client.search({ since: from, before: to, or: WORDS.map((w) => ({ subject: w })) } as any, { uid: true })) || []);
      for (const uid of uids.slice(0, 300)) {
        const msg = await client.fetchOne(String(uid), { source: true, envelope: true }, { uid: true });
        if (!msg || !msg.source) continue;
        const parsed = await simpleParser(msg.source);
        const pdfs = parsed.attachments.filter((a) => a.contentType === "application/pdf" || /\.pdf$/i.test(a.filename ?? ""));
        for (const a of pdfs) {
          found++;
          const extId = `mail:${mb.email}:${parsed.messageId ?? uid}:${a.filename ?? a.checksum}`;
          const exists = await pool.query(`SELECT 1 FROM fin_invoices WHERE ext_id = $1`, [extId]);
          if (exists.rowCount) continue;
          const fromAddr = parsed.from?.value?.[0]?.address ?? "";
          // Meta trimite „Meta Invoice …” de pe facebookmail.com; numele real al emitentului e Meta Platforms Ireland
          const fromName = /facebookmail\.com$/i.test(fromAddr) ? "Meta Platforms Ireland" : parsed.from?.value?.[0]?.name || fromAddr || null;
          const x = await readInvoice(a.content, `trimisă de ${fromName ?? "?"}, subiect „${parsed.subject ?? ""}”`);
          const issue = x.issue_date ?? (parsed.date ? parsed.date.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
          // firma cumpărătoare din factură; altfel firma implicită a căsuței; altfel „Nealocată”
          const companyId = detectCompany(companies, x.buyer_name, x.buyer_cui) ?? (looksLikePerson(x.buyer_name, x.buyer_cui) ? null : mb.company_id ?? null);
          const cloudId = await storeFile(a.content, a.filename ?? "factura.pdf", "application/pdf", `imperial-finante/${companyId ?? "nealocate"}/${issue.slice(0, 7)}/primite`).catch(() => null);
          await pool.query(
            `INSERT INTO fin_invoices (kind, source, ext_id, partner, number, issue_date, amount, currency, file_name, file_mime, file_data, cloud_public_id, link, company_id, buyer_name, buyer_cui)
             VALUES ('primita', 'email', $1, $2, $3, $4, $5, $6, $7, 'application/pdf', $8, $9, $10, $11, $12, $13) ON CONFLICT (ext_id) DO NOTHING`,
            [extId, /facebookmail/i.test(fromAddr) ? "Meta Platforms Ireland" : x.partner ?? fromName, x.number, issue, x.amount, x.currency ?? "RON", a.filename ?? "factura.pdf", cloudId ? null : a.content, cloudId, `${mb.email} · ${parsed.subject ?? ""}`.slice(0, 300), companyId, x.buyer_name, x.buyer_cui]
          );
          added++;
        }
      }
    } finally {
      lock.release();
    }
  } finally {
    await client.logout().catch(() => {});
  }
  return { found, added };
}

export async function syncAllMailboxes(from: Date, to: Date): Promise<{ email: string; found: number; added: number; error?: string }[]> {
  const pool = getPool();
  if (!pool) return [];
  await ensureSchema();
  const { rows } = await pool.query(`SELECT id, email, host, port, password_enc, company_id FROM fin_mailboxes ORDER BY id`);
  const companies = await listCompanies();
  const out = [];
  for (const mb of rows) {
    try {
      const r = await syncMailbox(mb, from, to, companies);
      await pool.query(`UPDATE fin_mailboxes SET last_sync = NOW(), last_error = NULL WHERE id = $1`, [mb.id]);
      out.push({ email: mb.email, ...r });
    } catch (e: any) {
      const msg = String(e?.message ?? e).slice(0, 300);
      await pool.query(`UPDATE fin_mailboxes SET last_error = $2 WHERE id = $1`, [mb.id, msg]);
      out.push({ email: mb.email, found: 0, added: 0, error: msg });
    }
  }
  return out;
}
