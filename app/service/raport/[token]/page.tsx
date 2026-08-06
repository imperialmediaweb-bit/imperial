// Pagina permanentă a raportului deblocat — linkul din emailul de după plată.
// Server component: citește raportul din DB după token; nedeblocat → înapoi la /service.

import { notFound, redirect } from "next/navigation";
import { getServiceReport } from "@/lib/service-reports";
import { hasDb } from "@/lib/db";
import { ServiceReportView } from "@/components/ServiceReportView";
import type { ServiceReport } from "@/app/api/service-report/route";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Raportul tău de consultanță — Imperial Media",
  robots: { index: false, follow: false },
};

export default async function ReportPage({ params }: { params: { token: string } }) {
  const token = params.token;
  if (!hasDb() || !/^[0-9a-f-]{36}$/i.test(token)) notFound();

  const row = await getServiceReport(token).catch(() => null);
  if (!row) notFound();
  if (!row.paid) redirect("/service");

  const report = row.report as ServiceReport;

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-hero-gradient" />
      <section className="container-app pb-20 pt-14 sm:pt-20">
        <ServiceReportView report={report} initialEmail={row.email ?? ""} />
      </section>
    </main>
  );
}
