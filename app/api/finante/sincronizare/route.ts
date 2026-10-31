// Sincronizează luna aleasă: tranzacții BT, facturi din toate căsuțele de email, facturi StartCo, apoi potrivire automată.
import { NextResponse } from "next/server";
import { audit, requireUser } from "@/lib/finante/auth";
import { lunaRange } from "@/lib/finante/luna";
import { activeConnection, syncTransactions } from "@/lib/finante/enablebanking";
import { syncAllMailboxes } from "@/lib/finante/mail";
import { syncStartco } from "@/lib/finante/startco";
import { autoMatch } from "@/lib/finante/match";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request) {
  const u = await requireUser();
  if (!u) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const r = lunaRange(b?.luna);
  const out: Record<string, unknown> = { luna: r.luna };

  // banca: luna + 7 zile după, ca să prindem plățile întârziate
  try {
    out.banca = (await activeConnection())
      ? await syncTransactions(r.from, new Date(Math.min(Date.now(), r.toDate.getTime() + 7 * 864e5)).toISOString().slice(0, 10))
      : { note: "Banca nu e conectată" };
  } catch (e: any) {
    out.banca = { error: String(e?.message ?? e).slice(0, 300) };
  }
  // emailuri: cu 10 zile înainte (facturi emise la sfârșit de lună anterioară) până la +10 zile
  out.email = await syncAllMailboxes(new Date(r.fromDate.getTime() - 10 * 864e5), new Date(r.toDate.getTime() + 10 * 864e5));
  try {
    out.startco = await syncStartco(r.from, r.to);
  } catch (e: any) {
    out.startco = { error: String(e?.message ?? e).slice(0, 300) };
  }
  out.potrivite = await autoMatch(r.from, r.to);
  await audit(u.email, "sincronizare", r.luna);
  return NextResponse.json(out);
}
