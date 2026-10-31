// Luna în panou: extrasul BT cu factura fiecărei tranzacții, totaluri, facturi nepotrivite, export.
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/finante/auth";
import { monthData } from "@/lib/finante/data";
import { lunaAnterioara } from "@/lib/finante/luna";
import { activeConnection } from "@/lib/finante/enablebanking";
import { FinNav } from "@/components/finante/FinNav";
import { MonthToolbar } from "@/components/finante/MonthToolbar";
import { TxTable } from "@/components/finante/TxTable";
import { UnmatchedList } from "@/components/finante/UnmatchedList";
import { companiesFor } from "@/lib/finante/companies";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const lei = (n: number) => `${n.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} lei`;

export default async function FinantePage(props: { searchParams: Promise<{ luna?: string; firma?: string }> }) {
  const user = await currentUser();
  if (!user) redirect("/login");
  const sp = await props.searchParams;
  const firme = await companiesFor(user);
  if (!firme.length) return <main className="p-8 text-white/70">Contul tău nu are acces la nicio firmă.</main>;
  const pref = Number(sp.firma ?? (await cookies()).get("fin_firma")?.value);
  const firma = firme.find((f) => f.id === pref) ?? firme[0];
  const d = await monthData(sp.luna, firma.id);
  const conn = await activeConnection(firma.id).catch(() => null);
  const next = (() => {
    const [y, m] = d.luna.split("-").map(Number);
    const n = new Date(Date.UTC(y, m, 1));
    return `${n.getUTCFullYear()}-${String(n.getUTCMonth() + 1).padStart(2, "0")}`;
  })();
  const isAdmin = user.role === "admin";
  const txOptions = d.tx.filter((t) => !t.invoices.length).map((t) => ({ id: t.id, label: `${t.booking_date} · ${t.amount.toFixed(2)} ${t.currency} · ${t.counterparty ?? ""}` }));

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <FinNav user={user} active="luna" firme={firme} firma={firma.id} luna={d.luna} />
      <MonthToolbar luna={d.luna} prev={lunaAnterioara(d.luna)} next={next} bankConnected={!!conn} isAdmin={isAdmin} firma={firma.id} />

      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {[
          ["Încasări", lei(d.totals.in), "text-emerald-400"],
          ["Plăți", lei(d.totals.out), "text-rose-400"],
          ["Tranzacții", String(d.totals.count), "text-white"],
          ["Fără factură", String(d.totals.missing), d.totals.missing ? "text-amber-400" : "text-emerald-400"],
        ].map(([k, v, c]) => (
          <div key={k} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wider text-white/45">{k}</p>
            <p className={`mt-1 text-xl font-bold ${c}`}>{v}</p>
          </div>
        ))}
      </div>

      {!conn && isAdmin ? (
        <p className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          Banca nu e conectată automat. Poți apăsa „Încarcă extrasul BT” (CSV sau PDF din BT24) sau o conectezi din <a className="underline" href="/setari">Setări</a>.
        </p>
      ) : null}

      <TxTable rows={d.tx} isAdmin={isAdmin} />
      <UnmatchedList rows={d.unmatched} isAdmin={isAdmin} txOptions={txOptions} firme={firme} firma={firma.id} />
    </main>
  );
}
