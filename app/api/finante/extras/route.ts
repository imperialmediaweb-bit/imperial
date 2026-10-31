// Încarcă extrasul BT (CSV sau PDF): importă tranzacțiile, caută facturile în emailuri și potrivește automat.
import { NextResponse } from "next/server";
import { audit, requireUser } from "@/lib/finante/auth";
import { parseCsv, parsePdf, saveParsed } from "@/lib/finante/extras";
import { syncAllMailboxes } from "@/lib/finante/mail";
import { autoMatch } from "@/lib/finante/match";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request) {
  const u = await requireUser("admin");
  if (!u) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Alege fișierul extrasului." }, { status: 400 });
  if (file.size > 15 * 1024 * 1024) return NextResponse.json({ error: "Fișier prea mare (maximum 15 MB)." }, { status: 400 });
  const buf = Buffer.from(await file.arrayBuffer());
  const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
  let list;
  try {
    list = isPdf ? await parsePdf(buf) : parseCsv(buf.toString("utf8"));
  } catch (e: any) {
    return NextResponse.json({ error: `Nu am putut citi extrasul: ${String(e?.message ?? e).slice(0, 200)}` }, { status: 400 });
  }
  if (!list.length) return NextResponse.json({ error: "Nu am găsit tranzacții în fișier. Încearcă exportul CSV din BT24." }, { status: 400 });
  const companyId = Number(form?.get("firma")) || null;
  if (!companyId) return NextResponse.json({ error: "Alege firma pentru extras." }, { status: 400 });
  const saved = await saveParsed(list, null, companyId);
  const dates = list.map((t) => t.date).sort();
  const from = dates[0];
  const to = dates[dates.length - 1];
  // caută facturile din aceeași perioadă (±10 zile) și potrivește
  const email = await syncAllMailboxes(new Date(Date.parse(from) - 10 * 864e5), new Date(Date.parse(to) + 11 * 864e5));
  const potrivite = await autoMatch(from, to, companyId);
  await audit(u.email, "extras-importat", `${file.name}: ${saved.added}/${saved.total} (${from} → ${to})`);
  return NextResponse.json({ ...saved, from, to, email, potrivite });
}
