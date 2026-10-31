"use client";

// Extrasul lunii: fiecare tranzacție cu factura ei. La o cheltuială fără factură:
// „Încarcă factura” → alegi PDF-ul/poza și se atașează imediat la acea plată.

import { useRef, useState } from "react";
import type { TxRow } from "@/lib/finante/data";

type Filter = "toate" | "lipsa" | "plati" | "incasari";

export function TxTable({ rows, isAdmin }: { rows: TxRow[]; isAdmin: boolean }) {
  const [filter, setFilter] = useState<Filter>("toate");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const target = useRef<number | null>(null);

  const shown = rows.filter((t) =>
    filter === "lipsa" ? !t.invoices.length && !t.fara_factura : filter === "plati" ? t.amount < 0 : filter === "incasari" ? t.amount > 0 : true
  );

  function pick(id: number) {
    target.current = id;
    fileRef.current?.click();
  }

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    const id = target.current;
    e.target.value = "";
    if (!f || !id) return;
    setBusyId(id);
    setErr(null);
    const fd = new FormData();
    fd.append("file", f);
    fd.append("transactionId", String(id));
    const r = await fetch("/api/finante/factura", { method: "POST", body: fd });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      setErr(j.error ?? "Încărcarea a eșuat.");
      setBusyId(null);
      return;
    }
    window.location.reload();
  }

  async function faraFactura(id: number, val: boolean) {
    setBusyId(id);
    await fetch("/api/finante/tranzactie", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, fara_factura: val }) });
    window.location.reload();
  }

  async function unlink(invoiceId: number) {
    if (!confirm("Dezlegi factura de această tranzacție?")) return;
    await fetch("/api/finante/potrivire", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ invoiceId, transactionId: null }) });
    window.location.reload();
  }

  return (
    <section className="mt-8">
      <input ref={fileRef} type="file" accept="application/pdf,image/*" capture="environment" className="hidden" onChange={upload} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Extras Banca Transilvania</h2>
        <div className="flex gap-1">
          {(
            [
              ["toate", "Toate"],
              ["lipsa", "Fără factură"],
              ["plati", "Plăți"],
              ["incasari", "Încasări"],
            ] as [Filter, string][]
          ).map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} className={`rounded-full px-3 py-1.5 text-xs font-medium ${filter === k ? "bg-white/15 text-white" : "text-white/55 hover:text-white"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>
      {err ? <p className="mt-2 text-sm text-red-400">{err}</p> : null}

      {shown.length === 0 ? (
        <p className="mt-4 rounded-xl border border-white/10 p-6 text-center text-sm text-white/50">Nicio tranzacție pentru filtrul ales.</p>
      ) : (
        <div className="mt-3 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-white/[0.04] text-left text-xs uppercase tracking-wider text-white/45">
              <tr>
                <th className="px-3 py-2.5">Data</th>
                <th className="px-3 py-2.5">Partener / detalii</th>
                <th className="px-3 py-2.5 text-right">Sumă</th>
                <th className="px-3 py-2.5">Factură</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((t) => {
                const ok = t.invoices.length > 0;
                return (
                  <tr key={t.id} className="border-t border-white/[0.06] align-top">
                    <td className="whitespace-nowrap px-3 py-3 text-white/70">{t.booking_date}</td>
                    <td className="px-3 py-3">
                      <p className="font-medium">{t.counterparty || t.description || "—"}</p>
                      {t.counterparty ? <p className="mt-0.5 max-w-[420px] text-xs text-white/50">{t.description}</p> : null}
                      {t.note ? <p className="mt-1 text-xs text-amber-300/80">Notă: {t.note}</p> : null}
                    </td>
                    <td className={`whitespace-nowrap px-3 py-3 text-right font-semibold ${t.amount < 0 ? "text-rose-300" : "text-emerald-300"}`}>
                      {t.amount.toLocaleString("ro-RO", { minimumFractionDigits: 2 })} {t.currency}
                    </td>
                    <td className="px-3 py-3">
                      {ok ? (
                        <div className="space-y-1">
                          {t.invoices.map((i) => (
                            <div key={i.id} className="flex items-center gap-2">
                              <a href={`/api/finante/factura/${i.id}`} target="_blank" rel="noopener" className="text-emerald-300 underline underline-offset-2">
                                ✓ {i.number || i.file_name || `factura #${i.id}`}
                              </a>
                              {i.match_kind === "auto" ? <span className="text-[10px] uppercase text-white/40">auto</span> : null}
                              {isAdmin ? (
                                <button onClick={() => unlink(i.id)} className="text-xs text-white/40 hover:text-white" title="Dezleagă">
                                  ✕
                                </button>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : t.fara_factura ? (
                        <span className="text-white/50">
                          Nu necesită factură{" "}
                          {isAdmin ? (
                            <button onClick={() => faraFactura(t.id, false)} className="ml-1 text-xs underline">anulează</button>
                          ) : null}
                        </span>
                      ) : isAdmin ? (
                        <div className="flex flex-wrap gap-2">
                          <button disabled={busyId === t.id} onClick={() => pick(t.id)} className="rounded-full bg-gradient-to-r from-orange-500 to-fuchsia-600 px-3 py-1.5 text-xs font-semibold disabled:opacity-50">
                            {busyId === t.id ? "Se încarcă…" : "Încarcă factura"}
                          </button>
                          <button onClick={() => faraFactura(t.id, true)} className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/60 hover:text-white" title="Comision bancar, transfer între conturi, taxe">
                            Nu necesită
                          </button>
                        </div>
                      ) : (
                        <span className="text-amber-300">Lipsește</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
