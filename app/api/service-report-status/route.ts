// „E gata raportul?" — frontend-ul întreabă la câteva secunde cât timp
// pipeline-ul rulează pe fundal. Răspunsuri scurte, fără conexiuni lungi.

import { NextResponse } from "next/server";
import { getServiceReport } from "@/lib/service-reports";
import { hasDb } from "@/lib/db";
import type { ServiceReport, ServiceReportPreview } from "@/app/api/service-report/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STALE_MS = 15 * 60_000; // pending mai vechi de 15 min = ceva a murit pe fundal (raport + retry ≈ max 10 min)

export async function GET(req: Request) {
  if (!hasDb()) {
    return NextResponse.json({ error: "Serviciul e temporar indisponibil." }, { status: 503 });
  }
  const { searchParams } = new URL(req.url);
  const token = String(searchParams.get("token") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(token)) {
    return NextResponse.json({ error: "Token invalid." }, { status: 400 });
  }

  const row = await getServiceReport(token).catch(() => null);
  if (!row) {
    return NextResponse.json({ error: "Raportul nu există." }, { status: 404 });
  }

  if (row.status === "pending") {
    if (Date.now() - new Date(row.created_at).getTime() > STALE_MS) {
      return NextResponse.json({ error: "Generarea a durat neobișnuit de mult — te rugăm să încerci din nou." });
    }
    return NextResponse.json({ pending: true });
  }
  if (row.status === "error") {
    return NextResponse.json({ error: "Nu am putut genera raportul. Încearcă din nou." });
  }

  const report = row.report as ServiceReport;
  const preview: ServiceReportPreview = {
    companyName: report.companyName,
    city: report.city,
    overallScore: report.overallScore,
    lostClientsPerMonth: report.lostClientsPerMonth,
    lostRevenuePerMonth: report.lostRevenuePerMonth,
    googleData: report.googleData,
    anafData: report.anafData,
    summary: report.summary,
  };
  return NextResponse.json({ locked: true, token, preview });
}
