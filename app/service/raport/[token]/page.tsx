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

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams?: { platit?: string };
}) {
  const token = params.token;
  if (!hasDb() || !/^[0-9a-f-]{36}$/i.test(token)) notFound();

  const row = await getServiceReport(token).catch(() => null);
  if (!row) notFound();

  // Cursa cu webhook-ul: userul se întoarce de la Stripe înaintea confirmării.
  // Cu ?platit=1 afișăm ecranul de așteptare care se reîncarcă singur, nu formularul.
  if (!row.paid && searchParams?.platit === "1") {
    return (
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-hero-gradient" />
        <section className="container-app flex min-h-[70vh] items-center justify-center py-16">
          {/* Reîncarcă pagina la 3s până sosește confirmarea plății */}
          <meta httpEquiv="refresh" content="3" />
          <div className="w-full max-w-md rounded-3xl border border-green-500/30 bg-bg-card bg-card-gradient p-8 text-center shadow-card">
            <span className="relative mx-auto grid h-14 w-14 place-items-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-green-500/25" />
              <span className="relative grid h-11 w-11 place-items-center rounded-full bg-green-500/20 text-2xl">✅</span>
            </span>
            <h1 className="mt-4 font-display text-xl font-extrabold text-text">Plata a reușit!</h1>
            <p className="mt-2 text-sm text-text-muted">
              Confirmăm tranzacția și îți deblocăm raportul — durează câteva secunde.
              Pagina se reîncarcă singură.
            </p>
            <p className="mt-4 text-[11px] text-text-subtle">
              Dacă vezi mesajul ăsta mai mult de un minut, verifică-ți emailul — linkul raportului sosește acolo oricum.
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (!row.paid) redirect("/service");

  const report = row.report as ServiceReport;

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-hero-gradient" />
      <section className="container-app pb-20 pt-14 sm:pt-20">
        <ServiceReportView report={report} initialEmail={row.email ?? ""} token={token} />
      </section>
    </main>
  );
}
