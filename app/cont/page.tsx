// Contul clientului: rapoartele lui, evoluția scorului, notificările de monitorizare.
// Login fără parolă — link magic pe email (vezi /api/cont/login + /api/cont/session).

import { getClientEmail } from "@/lib/client-auth";
import { getServiceReportsByEmail } from "@/lib/service-reports";
import { getNotifications, markNotificationsSeen } from "@/lib/monitoring";
import { refCodeForEmail, countPaidReferrals } from "@/lib/referrals";
import { hasDb } from "@/lib/db";
import { ContLogin } from "@/components/ContLogin";
import { ContDashboard } from "@/components/ContDashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contul tău — Imperial Media",
  robots: { index: false, follow: false },
};

export default async function ContPage({
  searchParams,
}: {
  searchParams: { expirat?: string };
}) {
  let email: string | null = null;
  try {
    email = getClientEmail();
  } catch {
    email = null;
  }

  if (!email || !hasDb()) {
    return (
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-hero-gradient" />
        <ContLogin expired={searchParams?.expirat === "1"} />
      </main>
    );
  }

  const refCode = refCodeForEmail(email);
  const [reports, notifications, referralCount] = await Promise.all([
    getServiceReportsByEmail(email).catch(() => []),
    getNotifications(email).catch(() => []),
    countPaidReferrals(refCode).catch(() => 0),
  ]);
  // Notificările devin „văzute" după ce le-a deschis pagina.
  markNotificationsSeen(email).catch(() => {});

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-hero-gradient" />
      <ContDashboard
        email={email}
        refCode={refCode}
        referralCount={referralCount}
        reports={reports.map((r) => ({
          token: r.token,
          createdAt: new Date(r.created_at).toISOString(),
          companyName: String(r.report?.companyName ?? r.form_data?.companyName ?? ""),
          city: String(r.report?.city ?? r.form_data?.city ?? ""),
          score: Number(r.report?.overallScore ?? 0),
          paid: r.paid,
        }))}
        notifications={notifications.map((n) => ({
          id: n.id,
          createdAt: new Date(n.created_at).toISOString(),
          kind: n.kind,
          title: n.title,
          body: n.body ?? "",
          seen: n.seen,
        }))}
      />
    </main>
  );
}
