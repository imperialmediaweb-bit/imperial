// Setări (doar admin): banca, căsuțele de email, contul contabilei, StartCo, jurnalul de acces.
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/finante/auth";
import { getPool } from "@/lib/db";
import { activeConnection, bankingConfigured } from "@/lib/finante/enablebanking";
import { startcoConfigured } from "@/lib/finante/startco";
import { FinNav } from "@/components/finante/FinNav";
import { SettingsPanels } from "@/components/finante/SettingsPanels";
import { listCompanies } from "@/lib/finante/companies";

export const dynamic = "force-dynamic";

export default async function SetariPage(props: { searchParams: Promise<{ banca?: string }> }) {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/");
  const sp = await props.searchParams;
  const pool = getPool()!;
  const firme = await listCompanies();
  const [conns, users, boxes, log] = await Promise.all([
    Promise.all(firme.map((f) => activeConnection(f.id).catch(() => null))),
    pool.query(`SELECT id, email, name, role, active, company_ids, to_char(last_login, 'YYYY-MM-DD HH24:MI') AS last_login FROM finance_users ORDER BY id`),
    pool.query(`SELECT id, email, host, company_id, to_char(last_sync, 'YYYY-MM-DD HH24:MI') AS last_sync, last_error FROM fin_mailboxes ORDER BY id`),
    pool.query(`SELECT to_char(at, 'YYYY-MM-DD HH24:MI') AS at, user_email, action, detail, ip FROM finance_audit ORDER BY at DESC LIMIT 40`),
  ]);
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <FinNav user={user} active="setari" />
      {sp.banca ? (
        <p className={`mt-6 rounded-xl border p-4 text-sm ${sp.banca === "ok" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-rose-500/30 bg-rose-500/10 text-rose-200"}`}>
          {sp.banca === "ok" ? "Banca Transilvania e conectată. Mergi la Luna și apasă „Sincronizează luna”." : `Conectarea la bancă nu a reușit: ${sp.banca}`}
        </p>
      ) : null}
      <SettingsPanels
        me={user.id}
        firme={firme}
        bankConfigured={bankingConfigured()}
        banks={firme.map((f, i) => {
          const c = conns[i];
          return { firma: f.id, connected: !!c, validUntil: c?.valid_until ? new Date(c.valid_until).toISOString().slice(0, 10) : null, lastSync: c?.last_sync ? new Date(c.last_sync).toISOString().slice(0, 16).replace("T", " ") : null, accounts: (c?.accounts ?? []).map((a: any) => a.iban ?? a.name ?? a.uid) };
        })}
        users={users.rows}
        boxes={boxes.rows}
        startco={startcoConfigured()}
        log={log.rows}
      />
    </main>
  );
}
