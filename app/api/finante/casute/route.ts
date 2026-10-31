// Căsuțele de email cu facturi (doar admin). Parola de aplicație se salvează criptat (AES-256-GCM).
import { NextResponse } from "next/server";
import { ImapFlow } from "imapflow";
import { getPool, ensureSchema } from "@/lib/db";
import { audit, encrypt, requireUser } from "@/lib/finante/auth";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const u = await requireUser("admin");
  if (!u) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const email = String(b?.email ?? "").trim().toLowerCase();
  const password = String(b?.password ?? "").replace(/\s+/g, "");
  const host = String(b?.host ?? "").trim() || (email.endsWith("@gmail.com") ? "imap.gmail.com" : "");
  const port = Number(b?.port) || 993;
  if (!email || !password || !host) return NextResponse.json({ error: "Completează emailul, parola de aplicație și serverul IMAP." }, { status: 400 });
  // verificăm conectarea înainte să salvăm
  try {
    const c = new ImapFlow({ host, port, secure: true, auth: { user: email, pass: password }, logger: false });
    await c.connect();
    await c.logout();
  } catch (e: any) {
    return NextResponse.json({ error: `Nu m-am putut conecta: ${String(e?.responseText ?? e?.message ?? e).slice(0, 200)}` }, { status: 400 });
  }
  await ensureSchema();
  await getPool()!.query(
    `INSERT INTO fin_mailboxes (email, host, port, password_enc) VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO UPDATE SET host = EXCLUDED.host, port = EXCLUDED.port, password_enc = EXCLUDED.password_enc, last_error = NULL`,
    [email, host, port, encrypt(password)]
  );
  await audit(u.email, "casuta-adaugata", email);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const u = await requireUser("admin");
  if (!u) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  const id = Number(new URL(req.url).searchParams.get("id"));
  await getPool()!.query(`DELETE FROM fin_mailboxes WHERE id = $1`, [id]);
  await audit(u.email, "casuta-stearsa", String(id));
  return NextResponse.json({ ok: true });
}
