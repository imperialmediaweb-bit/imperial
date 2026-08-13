// COMPLETAREA PLANULUI din admin — pentru rapoartele deja generate cărora le
// lipsește planul pe 12 luni (răspuns tăiat la generare). NU regenerează raportul
// (scorul, diagnosticele, tot restul rămân neatinse) — scrie DOAR planul lipsă,
// pe baza diagnosticelor existente, și îl salvează în același rând.
// Folosire: /api/admin/complete-plan?token=TOKENUL (sau linkul raportului întreg).
// Fără ?token= → automat cel mai recent raport gata căruia îi lipsește planul.

import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { getPool, ensureSchema, hasDb } from "@/lib/db";
import { REPORT_MODEL, CLAUDE_MODEL, getAnthropic } from "@/lib/ai";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Loghează-te întâi în /admin." }, { status: 401 });
  }
  if (!hasDb()) {
    return NextResponse.json({ error: "Fără bază de date." }, { status: 503 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Lipsește cheia Anthropic." }, { status: 503 });
  }

  const pool = getPool()!;
  await ensureSchema();

  const { searchParams } = new URL(req.url);
  const raw = String(searchParams.get("token") ?? "");
  let token = raw.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)?.[0] ?? "";

  if (!token) {
    const latest = await pool.query(
      `SELECT token FROM service_reports
       WHERE report IS NOT NULL AND jsonb_array_length(COALESCE(report->'actionPlan', '[]'::jsonb)) = 0
       ORDER BY created_at DESC LIMIT 1`
    );
    token = latest.rows[0]?.token ?? "";
    if (!token) {
      return NextResponse.json({ mesaj: "Niciun raport fără plan de completat. Totul e verde." });
    }
  }

  const res = await pool.query(`SELECT token, report, form_data FROM service_reports WHERE token = $1`, [token]);
  const row = res.rows[0];
  if (!row?.report) {
    return NextResponse.json({ error: "Rândul nu există sau nu are raport generat (⏳/❌ → folosește 🔄 regen)." }, { status: 404 });
  }

  const report = row.report;
  const f = row.form_data ?? {};
  if (Array.isArray(report.actionPlan) && report.actionPlan.length >= 3) {
    return NextResponse.json({ mesaj: `Raportul „${report.companyName}" ARE deja planul pe 12 luni (${report.actionPlan.length} faze). Nimic de făcut.` });
  }

  const bazaPlan = {
    summary: report.summary,
    diagnostics: (report.diagnostics ?? []).map((d: any) => ({ area: d.area, finding: d.finding, fix: d.fix })),
    projection: report.projection,
  };
  const prompt = `Ești consultantul senior care a scris raportul de mai jos pentru firma "${report.companyName}" (${f.industry ?? "?"}, ${report.city ?? f.city ?? "?"}). Raportului îi lipsește planul de acțiune pe 12 luni. Scrie-l ACUM, în 4 faze (0-3 luni, 3-6 luni, 6-9 luni, 9-12 luni), fiecare cu 3-5 acțiuni concrete derivate direct din diagnosticele raportului, investiție estimată și impact așteptat.

RAPORTUL: ${JSON.stringify(bazaPlan)}

REGULĂ ABSOLUTĂ DE FORMAT: răspunde DOAR cu JSON valid, fără text în jur. Primul caracter: { Ultimul: }
Format exact:
{"actionPlan":[{"phase":"Luna 1-3","title":"...","actions":["..."],"investment":"...","impact":"..."}]}`;

  try {
    const client = getAnthropic();
    const call = async (model: string) => {
      const resp = await client.messages.create({ model, max_tokens: 3000, messages: [{ role: "user", content: prompt }] });
      const tb = resp.content.find((b) => b.type === "text");
      return tb && tb.type === "text" ? tb.text : "";
    };
    let text = "";
    try {
      text = await call(REPORT_MODEL);
    } catch {
      text = await call(CLAUDE_MODEL);
    }
    const match = text.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0].replace(/,\s*([}\]])/g, "$1")) : null;
    const plan = Array.isArray(parsed?.actionPlan) ? parsed.actionPlan.slice(0, 4).map((p: any) => ({
      phase: String(p.phase ?? ""),
      title: String(p.title ?? ""),
      actions: Array.isArray(p.actions) ? p.actions.map(String).slice(0, 6) : [],
      investment: String(p.investment ?? ""),
      impact: String(p.impact ?? ""),
    })).filter((p: any) => p.actions.length > 0) : [];

    if (plan.length < 3) {
      return NextResponse.json({ error: "Modelul nu a livrat un plan valid — mai încearcă o dată." }, { status: 502 });
    }

    report.actionPlan = plan;
    await pool.query(`UPDATE service_reports SET report = $2 WHERE token = $1`, [token, JSON.stringify(report)]);

    return NextResponse.json({
      ok: true,
      firma: report.companyName,
      mesaj: `✅ Planul pe 12 luni a fost COMPLETAT (${plan.length} faze) în raportul existent — scorul și restul secțiunilor neatinse.`,
      linkRaport: `${siteConfig.url}/service/raport/${token}`,
    });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 500 });
  }
}
