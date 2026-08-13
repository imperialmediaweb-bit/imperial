// REGENERARE din admin — salvarea situației când generarea unui vizitator a picat:
// re-rulăm raportul pe datele LUI salvate (form_data), fără să mai depindem de el.
// Deschizi /api/admin/regenerate?token=TOKENUL-RÂNDULUI → primești linkul noului raport.

import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { getServiceReport, setServiceReportEmail } from "@/lib/service-reports";
import { hasDb } from "@/lib/db";
import { publicOrigin, siteConfig } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Loghează-te întâi în /admin." }, { status: 401 });
  }
  if (!hasDb()) {
    return NextResponse.json({ error: "Fără bază de date." }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  // Cu ?token= (sau linkul „deschide” întreg) → rândul ăla. FĂRĂ token → automat
  // cel mai recent raport eșuat/blocat. Zero copiat de coduri.
  const rawToken = String(searchParams.get("token") ?? "");
  let token = rawToken.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)?.[0] ?? "";

  if (!token) {
    const { getPool } = await import("@/lib/db");
    const latest = await getPool()!.query(
      `SELECT token FROM service_reports WHERE status IN ('error','pending') ORDER BY created_at DESC LIMIT 1`
    );
    token = latest.rows[0]?.token ?? "";
    if (!token) {
      return NextResponse.json({ mesaj: "Niciun raport eșuat sau blocat de regenerat. Totul e verde." });
    }
  }

  const row = await getServiceReport(token).catch(() => null);
  if (!row?.form_data?.companyName) {
    return NextResponse.json({ error: "Rândul nu există sau nu are datele formularului." }, { status: 404 });
  }

  // Repornim generarea cu EXACT datele lui salvate (fără poze — alea nu se stochează)
  const f = row.form_data;
  const body = {
    companyName: f.companyName, city: f.city, zone: f.zone, industry: f.industry,
    businessType: f.businessType, cui: f.cui, placeId: f.placeId, website: f.website,
    facebook: f.facebook, monthlyClients: f.monthlyClients, avgValue: f.avgValue,
    employees: f.employees, mainProblem: f.mainProblem, ref: f.ref, partner: f.partner,
  };

  try {
    const res = await fetch(`${publicOrigin(req)}/api/service-report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20000),
    });
    const data = await res.json();
    if (!res.ok || (!data?.pending && !data?.token)) {
      return NextResponse.json({ error: data?.error ?? `Repornirea a eșuat (${res.status}).` }, { status: 500 });
    }
    const newToken = data.token;

    // Cu ?email= : emailul se leagă de raport ACUM, iar la finalul generării
    // clientul primește AUTOMAT linkul raportului pe acea adresă (notifyReady).
    // Fără ?email=, moștenim emailul rândului vechi (dacă avea).
    const email = String(searchParams.get("email") ?? row.email ?? "").trim().toLowerCase();
    let emailNote = "Fără ?email= — trimiți tu linkul manual când apare scorul.";
    if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      await setServiceReportEmail(newToken, email).catch(() => {});
      emailNote = `📩 La final, ${email} primește AUTOMAT emailul cu linkul raportului — nu mai faci nimic.`;
    }

    return NextResponse.json({
      ok: true,
      firma: f.companyName,
      mesaj: `🔄 Generarea a REPORNIT pe datele salvate ale firmei „${f.companyName}". Durează 3-10 minute.`,
      email: emailNote,
      urmareste: `${siteConfig.url}/admin/rapoarte — rândul nou apare cu ⏳, apoi cu scor`,
      linkRaport: `${siteConfig.url}/service/raport/${newToken}`,
    });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 500 });
  }
}
