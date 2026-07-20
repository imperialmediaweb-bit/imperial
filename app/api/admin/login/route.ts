import { NextResponse } from "next/server";
import { checkPassword, isAdminConfigured, setAuthCookie } from "@/lib/admin-auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Admin nu e configurat (ADMIN_PASSWORD lipsește)." },
      { status: 503 }
    );
  }

  // Lockout brute-force: max 5 încercări per IP per 15 minute
  const ip = getClientIp(req);
  if (!rateLimit(`login:${ip}`, 5, 15 * 60_000)) {
    return NextResponse.json(
      { error: "Prea multe încercări. Așteaptă 15 minute și încearcă din nou." },
      { status: 429 }
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
    // Delay constant să descurajăm timing attacks
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json({ error: "Parolă greșită." }, { status: 401 });
  }

  setAuthCookie();
  return NextResponse.json({ ok: true });
}
