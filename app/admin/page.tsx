import { redirect } from "next/navigation";
import Link from "next/link";
import { Mail, Phone, Clock, Database, AlertCircle, Search as SearchIcon } from "lucide-react";
import { isAdminConfigured, isAuthed } from "@/lib/admin-auth";
import { hasDb } from "@/lib/db";
import { listBriefs, STATUS_LABELS, type BriefStatus } from "@/lib/briefs";
import { StatusPill } from "@/components/admin/StatusPill";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

type SearchParams = {
  status?: string;
  q?: string;
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  if (!isAdminConfigured()) {
    return <NotConfigured />;
  }
  if (!isAuthed()) {
    redirect("/admin/login");
  }
  if (!hasDb()) {
    return <NoDatabaseMessage />;
  }

  const status = (searchParams.status ?? "") as BriefStatus | "";
  const search = searchParams.q ?? "";

  let data;
  try {
    data = await listBriefs({
      status: status || undefined,
      search: search || undefined,
      limit: 100,
    });
  } catch (e: any) {
    return <DbError message={e?.message ?? "Eroare DB."} />;
  }

  const { rows, total, counts } = data;

  return (
    <main className="container-app py-10">
      <AdminNav active="leads" />
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-text">
            Brief-uri primite
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Total: <span className="font-semibold text-text">{total}</span>
            {status ? ` · filtrate (${STATUS_LABELS[status as BriefStatus]})` : ""}
          </p>
        </div>
        <LogoutButton />
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(Object.keys(STATUS_LABELS) as BriefStatus[]).map((s) => (
          <Link
            key={s}
            href={`/admin${s === status ? "" : `?status=${s}`}`}
            className={`rounded-xl border px-4 py-3 transition ${
              s === status
                ? "border-brand-orange bg-brand-orange/10"
                : "border-bg-border bg-bg-card/60 hover:border-brand-orange/50"
            }`}
          >
            <p className="text-[10px] uppercase tracking-wider text-text-subtle">
              {STATUS_LABELS[s]}
            </p>
            <p className="mt-1 font-display text-2xl font-extrabold text-text">
              {counts[s]}
            </p>
          </Link>
        ))}
      </div>

      {/* Search */}
      <form method="get" className="mb-4 flex gap-2">
        {status && <input type="hidden" name="status" value={status} />}
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
          <input
            type="search"
            name="q"
            defaultValue={search}
            placeholder="Caută după nume, email, domeniu..."
            className="input pl-10"
          />
        </div>
        <button type="submit" className="btn-ghost">
          Caută
        </button>
        {search && (
          <Link
            href={status ? `/admin?status=${status}` : "/admin"}
            className="inline-flex items-center rounded-full border border-bg-border bg-white/5 px-4 py-3 text-xs text-text-muted hover:text-text"
          >
            Resetează
          </Link>
        )}
      </form>

      {/* Table */}
      {rows.length === 0 ? (
        <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-12 text-center">
          <p className="text-text-muted">
            {search || status ? "Niciun brief potrivit filtrelor." : "Niciun brief încă."}
          </p>
        </div>
      ) : (
        <>
        {/* Carduri pe mobil (tabelul nu încape) */}
        <div className="space-y-3 md:hidden">
          {rows.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl border border-bg-border bg-bg-card/60 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <Link href={`/admin/${b.id}`} className="min-w-0 flex-1">
                  <p className="font-semibold text-text">{b.name}</p>
                  <p className="mt-0.5 truncate text-xs text-text-muted">{b.email}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="chip">{packageLabel(b.selected_package)}</span>
                    {b.source === "ai-chat" && (
                      <span className="text-[10px] text-brand-orange">✨ AI</span>
                    )}
                    {b.ai_estimate_min && b.ai_estimate_max && (
                      <span className="font-mono text-[11px] text-text">
                        {b.ai_estimate_min}–{b.ai_estimate_max}€
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[10px] text-text-subtle">
                    {formatDate(b.created_at)}
                  </p>
                </Link>
                <StatusPill id={b.id} status={b.status} compact />
              </div>
            </div>
          ))}
        </div>

        {/* Tabel pe desktop */}
        <div className="hidden overflow-hidden rounded-2xl border border-bg-border bg-bg-card/60 md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-bg-border bg-bg-soft/40 text-[10px] uppercase tracking-wider text-text-subtle">
                <tr>
                  <th className="px-4 py-3 text-left">Data</th>
                  <th className="px-4 py-3 text-left">Client</th>
                  <th className="px-4 py-3 text-left">Contact</th>
                  <th className="px-4 py-3 text-left">Proiect</th>
                  <th className="px-4 py-3 text-left">Estimare</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-border">
                {rows.map((b) => (
                  <tr
                    key={b.id}
                    className="transition hover:bg-white/3"
                  >
                    <td className="px-4 py-3 align-top">
                      <Link href={`/admin/${b.id}`} className="block">
                        <div className="flex items-start gap-1.5 text-xs text-text-muted">
                          <Clock className="mt-0.5 h-3 w-3 flex-shrink-0" />
                          <span>
                            {formatDate(b.created_at)}
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <Link href={`/admin/${b.id}`} className="block">
                        <p className="font-semibold text-text">{b.name}</p>
                        {b.industry && (
                          <p className="mt-0.5 text-xs text-text-subtle">
                            {b.industry}
                          </p>
                        )}
                      </Link>
                    </td>
                    <td className="px-4 py-3 align-top text-xs">
                      <Link href={`/admin/${b.id}`} className="block">
                        <p className="flex items-center gap-1 text-text-muted">
                          <Mail className="h-3 w-3 text-brand-orange" />
                          <span className="break-all">{b.email}</span>
                        </p>
                        {b.phone && (
                          <p className="mt-0.5 flex items-center gap-1 text-text-muted">
                            <Phone className="h-3 w-3 text-brand-orange" />
                            {b.phone}
                          </p>
                        )}
                      </Link>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <Link href={`/admin/${b.id}`} className="block">
                        <span className="chip">
                          {packageLabel(b.selected_package)}
                        </span>
                        {b.source === "ai-chat" && (
                          <span className="ml-1 text-[10px] text-brand-orange">
                            ✨ AI
                          </span>
                        )}
                      </Link>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <Link href={`/admin/${b.id}`} className="block">
                        {b.ai_estimate_min && b.ai_estimate_max ? (
                          <p className="font-mono text-xs text-text">
                            {b.ai_estimate_min}–{b.ai_estimate_max} €
                          </p>
                        ) : (
                          <p className="text-xs text-text-subtle">—</p>
                        )}
                      </Link>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <StatusPill id={b.id} status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </>
      )}

      <p className="mt-4 text-center text-[11px] text-text-subtle">
        Afișez maxim 100 de intrări. Pentru mai multe filtrează după status sau caută.
      </p>
    </main>
  );
}

function formatDate(d: Date): string {
  return d.toLocaleString("ro-RO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function packageLabel(key: string | null): string {
  switch (key) {
    case "website":
      return "Website";
    case "shop":
      return "Magazin";
    case "promo":
      return "Promovare";
    case "admin":
      return "Mentenanță";
    case "personalizat":
      return "Personalizat";
    default:
      return key ?? "—";
  }
}

function NotConfigured() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-5 py-20">
      <div className="max-w-md rounded-2xl border border-yellow-500/40 bg-yellow-500/5 p-6 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-yellow-400" />
        <h1 className="mt-3 font-display text-xl font-bold text-text">
          Admin nu e configurat
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Setează <code className="rounded bg-bg-soft px-1.5 py-0.5 text-brand-orange">ADMIN_PASSWORD</code> în Railway → Variables.
        </p>
      </div>
    </main>
  );
}

function NoDatabaseMessage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-5 py-20">
      <div className="max-w-lg rounded-2xl border border-brand-purple/40 bg-brand-purple/10 p-6 text-center">
        <Database className="mx-auto h-8 w-8 text-brand-purple" />
        <h1 className="mt-3 font-display text-xl font-bold text-text">
          Baza de date nu e conectată
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Pentru a salva și vedea brief-urile, adaugă Postgres pe Railway:
        </p>
        <ol className="mx-auto mt-4 max-w-sm text-left text-sm text-text-muted">
          <li className="mb-2">
            1. Intră pe Railway → proiectul tău
          </li>
          <li className="mb-2">
            2. Click <strong className="text-text">+ New</strong> → <strong className="text-text">Database</strong> → <strong className="text-text">PostgreSQL</strong>
          </li>
          <li className="mb-2">
            3. Railway creează automat <code className="rounded bg-bg-soft px-1 text-brand-orange">DATABASE_URL</code>
          </li>
          <li>4. Redeploy proiectul — briefs vor începe să se salveze</li>
        </ol>
        <p className="mt-4 text-[11px] text-text-subtle">
          Până atunci, briefs merg doar pe email (ok pentru operare).
        </p>
      </div>
    </main>
  );
}

function DbError({ message }: { message: string }) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-5 py-20">
      <div className="max-w-md rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-red-400" />
        <h1 className="mt-3 font-display text-xl font-bold text-text">
          Eroare la baza de date
        </h1>
        <p className="mt-2 text-xs text-text-muted">{message}</p>
      </div>
    </main>
  );
}
