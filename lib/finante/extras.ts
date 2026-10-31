// Importul extrasului BT din fișier (CSV din BT24 / BT Pay, sau PDF) — alternativă la Enable Banking.
// CSV: găsim singuri rândul de antet (Data / Descriere / Debit / Credit sau Sumă) și citim rândurile.
// PDF: Claude citește extrasul și întoarce tranzacțiile; le salvăm cu același format.

import { createHash } from "crypto";
import { getPool, ensureSchema } from "@/lib/db";
import { getAnthropic } from "@/lib/ai";

export type ParsedTx = { date: string; amount: number; currency: string; counterparty: string | null; description: string; ref: string | null };

function num(s: string): number | null {
  let t = (s ?? "").replace(/[^\d,.\-+]/g, "");
  if (!t) return null;
  // 1.234,56 → 1234.56 ; 1,234.56 → 1234.56
  if (t.lastIndexOf(",") > t.lastIndexOf(".")) t = t.replace(/\./g, "").replace(",", ".");
  else t = t.replace(/,/g, "");
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function date(s: string): string | null {
  const t = (s ?? "").trim();
  let m = t.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = t.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})/);
  if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  return null;
}

function splitCsv(line: string, sep: string): string[] {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (q && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else q = !q;
    } else if (c === sep && !q) {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out.map((x) => x.trim());
}

export function parseCsv(text: string, currency = "RON"): ParsedTx[] {
  const lines = text.replace(/^﻿/, "").split(/\r?\n/).filter((l) => l.trim());
  const sep = [";", ",", "\t"].sort((a, b) => (lines.slice(0, 30).join("").split(b).length - lines.slice(0, 30).join("").split(a).length))[0];
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const hi = lines.findIndex((l) => {
    const h = norm(l);
    return h.includes("data") && (h.includes("debit") || h.includes("suma") || h.includes("amount") || h.includes("credit"));
  });
  if (hi < 0) return [];
  const head = splitCsv(lines[hi], sep).map(norm);
  const col = (...keys: string[]) => head.findIndex((h) => keys.some((k) => h.includes(k)));
  const cDate = col("data tranzactie", "data operatiunii", "data inregistrarii", "booking", "data");
  const cDesc = col("descriere", "detalii", "description", "explicatie");
  const cDeb = col("debit");
  const cCred = col("credit");
  const cSum = col("suma", "amount", "valoare");
  const cRef = col("referinta", "reference", "id tranzactie");
  const cCp = col("beneficiar", "platitor", "contrapartida", "partener", "counterparty", "nume");
  const cCur = col("moneda", "valuta", "currency");
  const out: ParsedTx[] = [];
  for (const l of lines.slice(hi + 1)) {
    const c = splitCsv(l, sep);
    const d = date(c[cDate] ?? "");
    if (!d) continue;
    let amount: number | null = null;
    if (cDeb >= 0 || cCred >= 0) {
      const deb = num(c[cDeb] ?? "");
      const cred = num(c[cCred] ?? "");
      if (deb) amount = -Math.abs(deb);
      else if (cred) amount = Math.abs(cred);
    }
    if (amount == null && cSum >= 0) amount = num(c[cSum] ?? "");
    if (amount == null || amount === 0) continue;
    const description = (c[cDesc] ?? "").replace(/\s+/g, " ").trim();
    out.push({
      date: d,
      amount,
      currency: (cCur >= 0 && /^[A-Z]{3}$/.test(c[cCur] ?? "") ? c[cCur] : currency) as string,
      counterparty: cCp >= 0 ? c[cCp] || null : null,
      description,
      ref: cRef >= 0 ? c[cRef] || null : null,
    });
  }
  return out;
}

export async function parsePdf(pdf: Buffer): Promise<ParsedTx[]> {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("Pentru extrasul PDF e nevoie de ANTHROPIC_API_KEY");
  const r = await getAnthropic().messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 16000,
    messages: [
      {
        role: "user",
        content: [
          { type: "document", source: { type: "base64", media_type: "application/pdf", data: pdf.toString("base64") } } as any,
          {
            type: "text",
            text: `Este un extras de cont Banca Transilvania. Extrage TOATE tranzacțiile, fără să inventezi și fără să sari peste vreuna. Răspunde DOAR cu un JSON array: [{"date":"AAAA-LL-ZZ","amount": număr (NEGATIV la plăți/debit, POZITIV la încasări/credit),"currency":"RON","counterparty":"beneficiar sau plătitor","description":"detaliile tranzacției","ref":"referința dacă există"}]. Nu include soldurile, doar tranzacțiile.`,
          },
        ],
      },
    ],
  });
  const text = r.content.filter((c) => c.type === "text").map((c: any) => c.text).join("");
  const arr = JSON.parse(text.slice(text.indexOf("["), text.lastIndexOf("]") + 1));
  return (Array.isArray(arr) ? arr : [])
    .map((t: any) => ({
      date: date(String(t.date ?? "")) ?? "",
      amount: Number(t.amount),
      currency: /^[A-Z]{3}$/.test(t.currency ?? "") ? t.currency : "RON",
      counterparty: t.counterparty ? String(t.counterparty).slice(0, 200) : null,
      description: String(t.description ?? "").slice(0, 500),
      ref: t.ref ? String(t.ref).slice(0, 100) : null,
    }))
    .filter((t: ParsedTx) => t.date && Number.isFinite(t.amount) && t.amount !== 0);
}

export async function saveParsed(list: ParsedTx[], iban: string | null): Promise<{ added: number; total: number }> {
  const pool = getPool();
  if (!pool) throw new Error("Baza de date lipsește");
  await ensureSchema();
  let added = 0;
  for (const t of list) {
    // id stabil: referința băncii sau amprenta rândului, ca reimportul să nu dubleze
    const fp = t.ref ? `ref:${t.ref}` : createHash("sha1").update(`${t.date}|${t.amount}|${t.description}|${t.counterparty ?? ""}`).digest("hex");
    const res = await pool.query(
      `INSERT INTO bank_transactions (ext_id, account_iban, booking_date, amount, currency, counterparty, description, raw)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (ext_id) DO NOTHING`,
      [`extras:${fp}`, iban, t.date, t.amount, t.currency, t.counterparty, t.description, JSON.stringify({ sursa: "extras" })]
    );
    added += res.rowCount ?? 0;
  }
  return { added, total: list.length };
}
