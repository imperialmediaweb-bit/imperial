// Consultantul dedicat al clientului — chat de consultanță care ȘTIE firma lui:
// rapoartele, scorul, datele ANAF, notificările. Totul într-un singur loc, în cont.

import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getClientEmail } from "@/lib/client-auth";
import { getServiceReportsByEmail } from "@/lib/service-reports";
import { getNotifications } from "@/lib/monitoring";
import { getSubscription } from "@/lib/subscribers";
import { hasDb } from "@/lib/db";
import { BriefChat } from "@/components/BriefChat";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Consultantul tău — Imperial Media",
  robots: { index: false, follow: false },
};

export default async function ContConsultantPage() {
  let email: string | null = null;
  try {
    email = getClientEmail();
  } catch {
    email = null;
  }
  if (!email || !hasDb()) redirect("/cont");

  const [reports, notifications, subscription] = await Promise.all([
    getServiceReportsByEmail(email).catch(() => []),
    getNotifications(email, 5).catch(() => []),
    getSubscription(email).catch(() => null),
  ]);

  const latest = reports[reports.length - 1];
  const r = latest?.report ?? {};
  const f = latest?.form_data ?? {};

  const contextLines = [
    `Firma: ${r.companyName ?? f.companyName ?? "?"} (${r.city ?? f.city ?? "?"}${f.zone ? `, zona: ${f.zone}` : ""}), domeniu: ${f.industry ?? "?"}, tip: ${f.businessType ?? "local"}`,
    f.placeId ? `Are QR de recenzii Google gata generat în cont (cardul galben ⭐) — când vrea mai multe recenzii, trimite-l acolo: descarcă, printează, pune pe tejghea.` : null,
    `Emailul lui de cont (folosește-l direct la comenzi/brief, nu i-l mai cere): ${email}`,
    `Site: ${f.website ? f.website : "NU ARE SITE"}`,
    `Facebook: ${f.facebook ? f.facebook : "NU ARE PAGINĂ DE FACEBOOK (sau nu a declarat-o)"}`,
    `Profil Google Business: ${f.googleProfileUrl ? `există — creat/livrat de noi (${f.googleProfileUrl})` : r.googleData?.found ? "există, găsit la scanare" : "NU a fost găsit la scanare"}`,
    `Scor la ultimul raport: ${r.overallScore ?? "?"}/100; pierderi estimate: ~${r.lostClientsPerMonth ?? "?"} clienți/lună (~${r.lostRevenuePerMonth ?? "?"}€/lună)`,
    r.anafData?.found
      ? `ANAF: ${r.anafData.legalName}, ${r.anafData.active ? "activă" : "INACTIVĂ"}${r.anafData.turnover != null ? `, cifră de afaceri ${r.anafData.turnover} lei (${r.anafData.balanceYear})` : ""}`
      : null,
    r.topRecommendation?.title ? `Recomandarea #1 din raport: ${r.topRecommendation.title}` : null,
    r.socialPlan
      ? `Planul lui de social media din raport: ${r.socialPlan.reelsPerWeek ?? 0} reels + ${r.socialPlan.postsPerWeek ?? 0} postări + ${r.socialPlan.storiesPerWeek ?? 0} story-uri/săpt.${Array.isArray(r.socialPlan.ideas) && r.socialPlan.ideas.length ? ` Idei din raport: ${r.socialPlan.ideas.slice(0, 2).join("; ")}` : ""}`
      : null,
    f.mainProblem ? `Problema declarată de el: ${f.mainProblem}` : null,
    notifications.length > 0
      ? `Ultimele notificări de monitorizare: ${notifications.map((n) => n.title).join(" | ")}`
      : null,
    `Are ${reports.length} ${reports.length === 1 ? "raport" : "rapoarte"} în cont.`,
    subscription?.active
      ? `Abonament monitorizare: ACTIV (${subscription.plan ?? "lunar"}) — e client premium, răsfață-l.`
      : `Abonament monitorizare: NU ARE — dacă se potrivește natural în discuție (vrea urmărire, întreabă des de evoluție), recomandă-i abonamentul de 99 lei/lună: se activează singur din /cont, butonul „Activează”.`,
    `Partener local: dacă e din zona Botoșani și i-ar folosi networking/mentorat între antreprenori, recomandă Bizz Club Botoșani — botosani.bizz.club (comunitatea locală de antreprenori, partenerul nostru) — noi rămânem pe date și implementare.`,
  ].filter(Boolean);

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-hero-gradient" />
      <section className="container-app py-8 sm:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-text sm:text-3xl">
                Consultantul tău
              </h1>
              <p className="mt-1 text-sm text-text-muted">
                Îți știe firma, rapoartele și cifrele — întreabă-l orice despre afacerea ta.
              </p>
            </div>
            <Link href="/cont" className="btn-ghost text-xs">
              <ArrowLeft className="h-3.5 w-3.5" /> Înapoi la cont
            </Link>
          </div>
          <BriefChat mode="consultanta" clientContext={contextLines.join("\n")} />
        </div>
      </section>
    </main>
  );
}
