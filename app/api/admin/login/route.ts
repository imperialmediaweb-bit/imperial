import { NextResponse } from "next/server";
import { checkPassword, isAdminConfigured, setAuthCookie } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Admin nu e configurat (ADMIN_PASSWORD lipsește)." },
      { status: 503 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body invalid." }, { status: 400 });
  }

  const password = String(body?.password ?? "");
  if (!checkPassword(password)) {
    // Mic delay să descurajăm brute-force
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json({ error: "Parolă greșită." }, { status: 401 });
  }

  setAuthCookie();
  return NextResponse.json({ ok: true });
}
