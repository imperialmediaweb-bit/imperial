// Analizele gratuite („Ai nevoie de un site?”) — toate într-un loc: cine a făcut analiza,
// ce domeniu, verdictul pentru site-ul lui și dacă și-a lăsat emailul.

import { redirect } from "next/navigation";
import Link from "next/link";
import { Mail } from "lucide-react";
import { isAdminConfigured, isAuthed } from "@/lib/admin-auth";
import { hasDb } from "@/lib/db";
import { listBriefs, sourceLabel } from "@/lib/briefs";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

function verdict(message: string | null): { label: string; cls: string } | null {
  const m = message ?? "";
  if (/REFACERE|verdict refacere/i.test(m)) return { label: "De refăcut", cls: "border-brand-orange/50 text-brand-orange" };
  if (/ÎMBUNĂTĂȚIRE|verdict imbunatatire/i.test(m)) return { label: "De reparat / îmbunătățit", cls: "border-green-500/50 text-green-400" };
  return null;
}

export default async function AnalizePage() {
  if (!isAdminConfigured()) redirect("/admin");
  if (!(await isAuthed())) redirect("/admin/login");
  if (!hasDb()) redirect("/admin");

  const { rows, total } = await listBriefs({ sourcePrefix: "analiza", limit: 200 });
  const cuEmail = rows.filter((r) => r.email.includes("@")).length;

  return (
    <main className="container-app py-10">
      <AdminNav active="analize" />
      <h1 className="font-display text-2xl font-extrabold text-text">Analize gratuite</h1>
      <p className="mt-1 text-sm text-text-muted">
        Total: <b className="text-text">{total}</b> · cu email lăsat: <b className="text-text">{cuEmail}</b> — aceștia sunt cei mai buni de contactat.
      </p>

      {rows.length === 0 ? (
        <p className="mt-8 text-sm text-text-muted">Nicio analiză încă.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {rows.map((b) => {
            const v = verdict(b.message);
            const areEmail = b.email.includes("@");
            return (
              <div key={b.id} className="rounded-2xl border border-bg-border bg-bg-card/60 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <Link href={`/admin/${b.id}`} className="min-w-0 flex-1">
                    <p className="font-semibold text-text">
                      {b.name}
                      {b.industry ? <span className="font-normal text-text-muted"> · {b.industry}</span> : null}
                    </p>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {new Date(b.created_at).toLocaleString("ro-RO", { dateStyle: "medium", timeStyle: "short" })} · {sourceLabel(b.source)}
                    </p>
                  </Link>
                  <div className="flex flex-wrap items-center gap-2">
                    {v ? <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${v.cls}`}>{v.label}</span> : null}
                    {areEmail ? (
                      <a href={`mailto:${b.email}`} className="inline-flex items-center gap-1.5 rounded-full bg-orange-gradient px-3 py-1.5 text-xs font-semibold text-white">
                        <Mail className="h-3.5 w-3.5" /> {b.email}
                      </a>
                    ) : null}
                  </div>
                </div>
                {b.message ? (
                  <p className="mt-3 line-clamp-3 whitespace-pre-line text-[13px] leading-relaxed text-text-muted">{b.message}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
