// Încarcă o factură (PDF sau poză) — direct pe cheltuiala/încasarea din extras, dintr-un singur pas.
import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { audit, requireUser } from "@/lib/finante/auth";
import { storeFile } from "@/lib/finante/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OK_MIME = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/heic"];

export async function POST(req: Request) {
  const u = await requireUser("admin");
  if (!u) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!form || !(file instanceof File)) return NextResponse.json({ error: "Alege fișierul facturii." }, { status: 400 });
  if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: "Fișierul e prea mare (maximum 10 MB)." }, { status: 400 });
  if (!OK_MIME.includes(file.type)) return NextResponse.json({ error: "Doar PDF sau poză (JPG, PNG)." }, { status: 400 });

  const pool = getPool()!;
  const txId = Number(form.get("transactionId")) || null;
  let kind = String(form.get("kind") ?? "");
  let amount: number | null = Number(form.get("amount")) || null;
  let date = String(form.get("date") ?? "") || null;
  let partner = String(form.get("partner") ?? "") || null;
  let companyId: number | null = Number(form.get("firma")) || null;
  if (txId) {
    // pe o tranzacție: completăm din extras ce nu s-a scris
    const { rows } = await pool.query(`SELECT amount, booking_date, counterparty, description, company_id FROM bank_transactions WHERE id = $1`, [txId]);
    if (!rows[0]) return NextResponse.json({ error: "Tranzacția nu există." }, { status: 404 });
    kind = kind || (Number(rows[0].amount) < 0 ? "primita" : "emisa");
    companyId = rows[0].company_id ?? companyId;
    amount = amount ?? Math.abs(Number(rows[0].amount));
    date = date ?? new Date(rows[0].booking_date).toISOString().slice(0, 10);
    partner = partner ?? rows[0].counterparty ?? (rows[0].description ? String(rows[0].description).replace(/^(plata card|plata|incasare( op)?( de la)?)\s+/i, "").slice(0, 60) : null);
  }
  if (!["primita", "emisa"].includes(kind)) kind = "primita";
  const buf = Buffer.from(await file.arrayBuffer());
  const day = date ?? new Date().toISOString().slice(0, 10);
  const cloudId = await storeFile(buf, file.name, file.type, `imperial-finante/${companyId ?? "nealocate"}/${day.slice(0, 7)}/${kind === "emisa" ? "emise" : "primite"}`).catch(() => null);
  const { rows } = await pool.query(
    `INSERT INTO fin_invoices (kind, source, partner, number, issue_date, amount, currency, file_name, file_mime, file_data, cloud_public_id, transaction_id, match_kind, uploaded_by, company_id)
     VALUES ($1, 'manual', $2, $3, $4, $5, 'RON', $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
    [kind, partner, String(form.get("number") ?? "") || null, date, amount, file.name.slice(0, 200), file.type, cloudId ? null : buf, cloudId, txId, txId ? "manual" : null, u.email, companyId]
  );
  await audit(u.email, "factura-incarcata", `${file.name}${txId ? ` → tranzacția ${txId}` : ""}`);
  return NextResponse.json({ ok: true, id: rows[0].id });
}
