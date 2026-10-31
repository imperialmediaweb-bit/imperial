// Descarcă PDF-ul unei facturi (admin și contabil) sau o șterge (doar admin).
import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { audit, requireUser } from "@/lib/finante/auth";
import { signedUrl } from "@/lib/finante/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const u = await requireUser();
  if (!u) return new NextResponse("Neautorizat", { status: 401 });
  const id = Number((await ctx.params).id);
  const { rows } = await getPool()!.query(`SELECT file_name, file_mime, file_data, cloud_public_id, link FROM fin_invoices WHERE id = $1`, [id]);
  const f = rows[0];
  if (!f) return new NextResponse("Nu există", { status: 404 });
  if (f.cloud_public_id) {
    await audit(u.email, "factura-descarcata", String(id));
    return NextResponse.redirect(signedUrl(f.cloud_public_id));
  }
  if (!f.file_data) return f.link && /^https:\/\//.test(f.link) ? NextResponse.redirect(f.link) : new NextResponse("Fără fișier", { status: 404 });
  await audit(u.email, "factura-descarcata", String(id));
  return new NextResponse(f.file_data, {
    headers: {
      "Content-Type": f.file_mime ?? "application/pdf",
      "Content-Disposition": `inline; filename="${encodeURIComponent(f.file_name ?? `factura-${id}.pdf`)}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const u = await requireUser("admin");
  if (!u) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  const id = Number((await ctx.params).id);
  await getPool()!.query(`DELETE FROM fin_invoices WHERE id = $1`, [id]);
  await audit(u.email, "factura-stearsa", String(id));
  return NextResponse.json({ ok: true });
}
