// Întoarcerea din aplicația BT după autentificare: salvăm sesiunea cu conturile firmei.
import { NextResponse } from "next/server";
import { audit, requireUser, signState } from "@/lib/finante/auth";
import { createSession } from "@/lib/finante/enablebanking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const u = await requireUser("admin");
  const url = new URL(req.url);
  const back = (msg: string) => NextResponse.redirect(new URL(`/setari?banca=${encodeURIComponent(msg)}`, url.origin.replace("http://", "https://")));
  if (!u) return back("Autentifică-te întâi în panou, apoi reconectează banca.");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state") ?? "";
  const nonce = state.split(".")[0];
  const age = Date.now() - Number(nonce.split("-")[0]);
  if (!code || state !== signState(nonce) || !(age >= 0 && age < 30 * 60_000)) {
    return back(url.searchParams.get("error_description") ?? "Conectarea a fost anulată sau a expirat.");
  }
  try {
    await createSession(code);
    await audit(u.email, "banca-conectata");
    return back("ok");
  } catch (e: any) {
    return back(String(e?.message ?? e).slice(0, 200));
  }
}
