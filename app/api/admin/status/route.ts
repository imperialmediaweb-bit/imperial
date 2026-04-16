import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { updateStatus, type BriefStatus } from "@/lib/briefs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID: BriefStatus[] = ["nou", "ofertat", "client", "refuzat"];

export async function POST(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body invalid." }, { status: 400 });
  }

  const id = Number(body?.id);
  const status = String(body?.status ?? "") as BriefStatus;

  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "ID invalid." }, { status: 400 });
  }
  if (!VALID.includes(status)) {
    return NextResponse.json({ error: "Status invalid." }, { status: 400 });
  }

  try {
    await updateStatus(id, status);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[/api/admin/status] error:", e);
    return NextResponse.json({ error: "Eroare DB." }, { status: 500 });
  }
}
