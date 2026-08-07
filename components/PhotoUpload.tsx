"use client";

// Cardul „Trimite-ne poze" din contul clientului — upload direct în Cloudinary,
// fără emailuri cu atașamente. Pozele merg la echipă pentru pagini/site/postări.

import { useRef, useState } from "react";
import { Camera, CheckCircle2 } from "lucide-react";

export function PhotoUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  function onPick(list: FileList | null) {
    if (!list) return;
    setResult(null);
    setFiles(Array.from(list).slice(0, 10));
  }

  async function upload() {
    if (files.length === 0 || busy) return;
    setBusy(true);
    setResult(null);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("photos", f));
      const res = await fetch("/api/client-photos", { method: "POST", body: fd });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        setResult({
          ok: true,
          text: `${data.uploaded} ${data.uploaded === 1 ? "poză urcată" : "poze urcate"} — echipa le-a primit!${data.failed?.length ? ` (nu au mers: ${data.failed.join(", ")})` : ""}`,
        });
        setFiles([]);
        if (inputRef.current) inputRef.current.value = "";
      } else {
        setResult({ ok: false, text: data?.error ?? "Ceva n-a mers — încearcă din nou." });
      }
    } catch {
      setResult({ ok: false, text: "Eroare de rețea — încearcă din nou." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-3xl border border-bg-border bg-bg-card/60 p-6">
      <h2 className="inline-flex items-center gap-2 font-display text-lg font-bold text-text">
        <Camera className="h-5 w-5 text-brand-orange" /> Trimite-ne poze
      </h2>
      <p className="mt-1 text-sm text-text-muted">
        Pentru paginile, site-ul sau postările tale: poze cu produsele, localul, echipa, lucrările.
        Le urci aici — ajung direct la echipă, fără emailuri și fără telefoane.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => onPick(e.target.files)}
      />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => inputRef.current?.click()} className="btn-ghost text-sm">
          Alege pozele (max 10)
        </button>
        {files.length > 0 && (
          <span className="text-xs font-semibold text-text-muted">
            {files.length} {files.length === 1 ? "poză aleasă" : "poze alese"}
          </span>
        )}
        {files.length > 0 && (
          <button type="button" onClick={upload} disabled={busy} className="btn-primary text-sm">
            {busy ? "Se urcă..." : "Trimite pozele"}
          </button>
        )}
      </div>
      {result && (
        <p className={`mt-3 inline-flex items-center gap-1.5 text-sm font-semibold ${result.ok ? "text-green-400" : "text-red-400"}`}>
          {result.ok && <CheckCircle2 className="h-4 w-4" />}
          {result.text}
        </p>
      )}
    </div>
  );
}
