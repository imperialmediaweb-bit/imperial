// Pachetul lunii pentru contabilitate: ZIP cu extrasul (CSV pentru Excel), lista facturilor și toate PDF-urile.
import { NextResponse } from "next/server";
import JSZip from "jszip";
import { getPool } from "@/lib/db";
import { audit, requireUser } from "@/lib/finante/auth";
import { lunaRange } from "@/lib/finante/luna";
import { fetchFile } from "@/lib/finante/storage";
import { canSee, listCompanies } from "@/lib/finante/companies";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const csv = (rows: (string | number | null)[][]) =>
  "﻿" + rows.map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(";")).join("\r\n");
const safe = (s: string) => s.replace(/[^\p{L}\p{N}._ -]+/gu, "_").slice(0, 80);

export async function GET(req: Request) {
  const u = await requireUser();
  if (!u) return new NextResponse("Neautorizat", { status: 401 });
  const sp = new URL(req.url).searchParams;
  const r = lunaRange(sp.get("luna"));
  const firma = (await listCompanies()).find((c) => c.id === Number(sp.get("firma")));
  if (!firma || !(await canSee(u, firma.id))) return new NextResponse("Firmă inexistentă sau fără acces", { status: 403 });
  const pool = getPool()!;
  const tx = await pool.query(
    `SELECT t.id, t.booking_date, t.amount, t.currency, t.counterparty, t.description, t.account_iban, t.note, t.fara_factura,
            (SELECT string_agg(COALESCE(i.number, i.file_name, '#' || i.id), ', ') FROM fin_invoices i WHERE i.transaction_id = t.id) AS facturi
     FROM bank_transactions t WHERE t.booking_date BETWEEN $1 AND $2 AND t.company_id = $3 ORDER BY t.booking_date, t.id`,
    [r.from, r.to, firma.id]
  );
  const inv = await pool.query(
    `SELECT i.id, i.kind, i.source, i.partner, i.number, i.issue_date, i.amount, i.currency, i.file_name, i.file_data, i.cloud_public_id, i.link, t.booking_date AS plata
     FROM fin_invoices i LEFT JOIN bank_transactions t ON t.id = i.transaction_id
     WHERE i.company_id = $3 AND ((i.issue_date BETWEEN $1 AND $2) OR (t.booking_date BETWEEN $1 AND $2))
     ORDER BY i.kind, i.issue_date, i.id`,
    [r.from, r.to, firma.id]
  );

  const zip = new JSZip();
  zip.file(
    `extras-${r.luna}.csv`,
    csv([
      ["Data", "Suma", "Moneda", "Partener", "Detalii", "Cont", "Factura", "Fara factura", "Nota"],
      ...tx.rows.map((t) => [new Date(t.booking_date).toISOString().slice(0, 10), Number(t.amount).toFixed(2).replace(".", ","), t.currency, t.counterparty, t.description, t.account_iban, t.facturi ?? "LIPSESTE", t.fara_factura ? "da" : "", t.note]),
    ])
  );
  zip.file(
    `facturi-${r.luna}.csv`,
    csv([
      ["Tip", "Partener", "Numar", "Data", "Suma", "Moneda", "Sursa", "Platita la", "Fisier"],
      ...inv.rows.map((i) => [i.kind === "emisa" ? "emisa" : "primita", i.partner, i.number, i.issue_date ? new Date(i.issue_date).toISOString().slice(0, 10) : "", i.amount != null ? Number(i.amount).toFixed(2).replace(".", ",") : "", i.currency, i.source, i.plata ? new Date(i.plata).toISOString().slice(0, 10) : "NEPLATITA", i.file_name ?? i.link ?? ""]),
    ])
  );
  for (const i of inv.rows) {
    const data: Buffer | null = i.file_data ?? (i.cloud_public_id ? await fetchFile(i.cloud_public_id) : null);
    if (!data) continue;
    const folder = i.kind === "emisa" ? "facturi-emise" : "facturi-primite";
    const date = i.issue_date ? new Date(i.issue_date).toISOString().slice(0, 10) : "fara-data";
    zip.file(`${folder}/${date}_${safe(i.partner ?? "partener")}_${i.id}_${safe(i.file_name ?? "factura.pdf")}`, data);
  }
  const buf = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  await audit(u.email, "export", `${firma.name} ${r.luna}`);
  const slug = firma.name.normalize("NFD").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "").toLowerCase().slice(0, 40);
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="contabilitate-${slug}-${r.luna}.zip"`,
      "Cache-Control": "private, no-store",
    },
  });
}
