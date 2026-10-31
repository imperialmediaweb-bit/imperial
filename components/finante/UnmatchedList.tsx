"use client";

// Facturile găsite (email, StartCo, încărcate) care nu sunt încă legate de o tranzacție.
import { useState } from "react";
import type { InvRow } from "@/lib/finante/data";

export function UnmatchedList({ rows, isAdmin, txOptions, firme, firma }: { rows: InvRow[]; isAdmin: boolean; txOptions: { id: number; label: string }[]; firme: { id: number; name: string }[]; firma: number }) {
  const [sel, setSel] = useState<Record<number, string>>({});

  async function link(invoiceId: number) {
    const tx = Number(sel[invoiceId]);
    if (!tx) return;
    await fetch("/api/finante/potrivire", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ invoiceId, transactionId: tx }) });
    window.location.reload();
  }
  async function aloca(invoiceId: number, companyId: string) {
    await fetch("/api/finante/factura-firma", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ invoiceId, companyId: Number(companyId) || null }) });
    window.location.reload();
  }
  async function del(id: number) {
    if (!confirm("Ștergi factura din panou?")) return;
    await fetch(`/api/finante/factura/${id}`, { method: "DELETE" });
    window.location.reload();
  }

  if (!rows.length) return null;
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold">Facturi fără plată legată ({rows.length})</h2>
      <p className="mt-1 text-sm text-white/50">Găsite în emailuri, StartCo sau încărcate. Leagă-le de plata din extras dacă potrivirea automată nu le-a prins.</p>
      <div className="mt-3 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-white/[0.04] text-left text-xs uppercase tracking-wider text-white/45">
            <tr>
              <th className="px-3 py-2.5">Tip</th>
              <th className="px-3 py-2.5">Partener</th>
              <th className="px-3 py-2.5">Nr. / data</th>
              <th className="px-3 py-2.5 text-right">Sumă</th>
              <th className="px-3 py-2.5">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((i) => (
              <tr key={i.id} className="border-t border-white/[0.06]">
                <td className="px-3 py-3 text-xs uppercase text-white/50">{i.kind === "emisa" ? "emisă" : "primită"} · {i.source}</td>
                <td className="px-3 py-3">
                  {i.partner ?? "—"}
                  {i.company_id == null ? (
                    <span className="mt-1 block text-xs text-amber-300">
                      Nealocată{i.buyer_name ? ` · emisă pe „${i.buyer_name}”` : ""}
                      {i.buyer_name && !/\b(srl|sa|pfa|asocia)/i.test(i.buyer_name) ? " — pare pe persoană fizică, nu pe firmă" : ""}
                    </span>
                  ) : null}
                </td>
                <td className="px-3 py-3 text-white/70">
                  {i.has_file || i.link?.startsWith("https://") ? (
                    <a href={`/api/finante/factura/${i.id}`} target="_blank" rel="noopener" className="underline underline-offset-2">{i.number ?? "vezi"}</a>
                  ) : (
                    i.number ?? "—"
                  )}{" "}
                  · {i.issue_date ?? "—"}
                </td>
                <td className="px-3 py-3 text-right">{i.amount != null ? `${i.amount.toLocaleString("ro-RO", { minimumFractionDigits: 2 })} ${i.currency ?? ""}` : "—"}</td>
                <td className="px-3 py-3">
                  {isAdmin ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <select value={sel[i.id] ?? ""} onChange={(e) => setSel((s) => ({ ...s, [i.id]: e.target.value }))} className="max-w-[260px] rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs" aria-label="Tranzacția">
                        <option value="">Alege plata…</option>
                        {txOptions.map((o) => (
                          <option key={o.id} value={o.id}>{o.label}</option>
                        ))}
                      </select>
                      <button onClick={() => link(i.id)} className="rounded-full bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15">Leagă</button>
                      {i.company_id == null ? (
                        <select defaultValue="" onChange={(e) => aloca(i.id, e.target.value)} className="rounded-lg border border-amber-500/40 bg-black/40 px-2 py-1.5 text-xs" aria-label="Alocă firmei">
                          <option value="">Alocă firmei…</option>
                          {firme.map((f) => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                        </select>
                      ) : null}
                      <button onClick={() => del(i.id)} className="text-xs text-white/40 hover:text-rose-300">Șterge</button>
                    </div>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
