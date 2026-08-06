// Bordul /service pentru proprietar: rapoartele generate, plățile, abonații.

import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Users, TrendingUp, ArrowLeft } from "lucide-react";
import { isAdminConfigured, isAuthed } from "@/lib/admin-auth";
import { getPool, ensureSchema, hasDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminRapoartePage() {
  if (!isAdminConfigured()) redirect("/admin");
  if (!isAuthed()) redirect("/admin/login");
  if (!hasDb()) redirect("/admin");

  const pool = getPool()!;
  await ensureSchema();

  const [reportsRes, subsRes, statsRes] = await Promise.all([
    pool.query(`
      SELECT token, created_at, email, paid, paid_at, followup_stage,
             form_data->>'companyName' AS company, form_data->>'city' AS city,
             form_data->>'industry' AS industry, form_data->>'ref' AS ref,
             form_data->>'partner' AS partner,
             report->>'overallScore' AS score
      FROM service_reports ORDER BY created_at DESC LIMIT 100
    `),
    pool.query(`SELECT email, plan, active, created_at FROM subscribers ORDER BY created_at DESC LIMIT 100`),
    pool.query(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE paid)::int AS paid,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')::int AS last7,
        COUNT(*) FILTER (WHERE paid AND paid_at > NOW() - INTERVAL '7 days')::int AS paid7
      FROM service_reports
    `),
  ]);

  const stats = statsRes.rows[0] ?? { total: 0, paid: 0, last7: 0, paid7: 0 };
  const activeSubs = subsRes.rows.filter((s: any) => s.active).length;

  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("ro-RO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";

  return (
    <main className="container-app py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-2xl font-extrabold text-text">📊 Rapoarte & abonați</h1>
          <Link href="/admin" className="btn-ghost text-xs"><ArrowLeft className="h-3.5 w-3.5" /> Înapoi la lead-uri</Link>
        </div>

        {/* Cifrele */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">Rapoarte generate</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-text">{stats.total}</p>
            <p className="text-[11px] text-text-subtle">+{stats.last7} în ultimele 7 zile</p>
          </div>
          <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">Plătite</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-green-400">{stats.paid}</p>
            <p className="text-[11px] text-text-subtle">+{stats.paid7} în ultimele 7 zile</p>
          </div>
          <div className="rounded-2xl border border-brand-orange/30 bg-brand-orange/5 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">Conversie</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-brand-orange">
              {stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0}%
            </p>
            <p className="text-[11px] text-text-subtle">din rapoarte → plată</p>
          </div>
          <div className="rounded-2xl border border-brand-purple/30 bg-brand-purple/5 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">Abonați activi</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-brand-purple">{activeSubs}</p>
            <p className="text-[11px] text-text-subtle">din {subsRes.rows.length} totali</p>
          </div>
        </div>

        {/* Rapoartele */}
        <div className="mt-8 rounded-3xl border border-bg-border bg-bg-card/60 p-5">
          <h2 className="inline-flex items-center gap-2 font-display text-lg font-bold text-text">
            <FileText className="h-5 w-5 text-brand-orange" /> Ultimele rapoarte
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-bg-border text-left text-[10px] uppercase tracking-wider text-text-subtle">
                  <th className="pb-2 pr-3">Data</th>
                  <th className="pb-2 pr-3">Firma</th>
                  <th className="pb-2 pr-3">Scor</th>
                  <th className="pb-2 pr-3">Email</th>
                  <th className="pb-2 pr-3">Plătit</th>
                  <th className="pb-2 pr-3">Sursă</th>
                  <th className="pb-2">Raport</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-border/60">
                {reportsRes.rows.map((r: any) => (
                  <tr key={r.token}>
                    <td className="py-2 pr-3 text-text-subtle whitespace-nowrap">{fmt(r.created_at)}</td>
                    <td className="py-2 pr-3 font-semibold text-text">{r.company}{r.city ? <span className="text-text-subtle"> · {r.city}</span> : ""}</td>
                    <td className="py-2 pr-3 text-text-muted">{r.score ?? "—"}</td>
                    <td className="py-2 pr-3 text-text-muted">{r.email ?? "—"}</td>
                    <td className="py-2 pr-3">{r.paid ? <span className="font-bold text-green-400">DA{r.paid_at ? ` · ${fmt(r.paid_at)}` : ""}</span> : <span className="text-text-subtle">nu</span>}</td>
                    <td className="py-2 pr-3 text-text-subtle">{r.partner ? `partener:${r.partner}` : r.ref ? `ref:${r.ref}` : "direct"}</td>
                    <td className="py-2"><Link href={`/service/raport/${r.token}`} className="text-brand-orange hover:underline">deschide</Link></td>
                  </tr>
                ))}
                {reportsRes.rows.length === 0 && (
                  <tr><td colSpan={7} className="py-6 text-center text-text-subtle">Niciun raport încă.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Abonații */}
        <div className="mt-6 rounded-3xl border border-bg-border bg-bg-card/60 p-5">
          <h2 className="inline-flex items-center gap-2 font-display text-lg font-bold text-text">
            <Users className="h-5 w-5 text-brand-purple" /> Abonați monitorizare
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-bg-border text-left text-[10px] uppercase tracking-wider text-text-subtle">
                  <th className="pb-2 pr-3">Email</th>
                  <th className="pb-2 pr-3">Plan</th>
                  <th className="pb-2 pr-3">Status</th>
                  <th className="pb-2">Din</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-border/60">
                {subsRes.rows.map((s: any) => (
                  <tr key={s.email}>
                    <td className="py-2 pr-3 text-text">{s.email}</td>
                    <td className="py-2 pr-3 text-text-muted">{s.plan ?? "—"}</td>
                    <td className="py-2 pr-3">{s.active ? <span className="font-bold text-green-400">activ</span> : <span className="text-red-400">anulat</span>}</td>
                    <td className="py-2 text-text-subtle">{fmt(s.created_at)}</td>
                  </tr>
                ))}
                {subsRes.rows.length === 0 && (
                  <tr><td colSpan={4} className="py-6 text-center text-text-subtle">Niciun abonat încă.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
