"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ImagePlus, Loader2, Minus, Plus, X } from "lucide-react";
import { fbTrack } from "@/lib/fbq";
import {
  CONFIG_OPTIONS,
  LOCAL_MONTHLY,
  LOCAL_MONTHLY_INCLUDES,
  SITE_TYPES,
  type LocalOffer,
  type SiteType,
  configTotal,
} from "@/lib/local-offer";

const MAX_PHOTOS = 10;

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-text">
        {label}
        {required && <span className="text-brand-orange"> *</span>}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-bg-border bg-bg-soft/40 px-3.5 py-2.5 text-sm text-text outline-none placeholder:text-text-subtle focus:border-brand-orange/60";

/** Brief-ul ofertei locale: tipul site-ului, bife cu preț, materiale, date. */
export function LocalConfigurator({ offer }: { offer: LocalOffer }) {
  const router = useRouter();
  const [type, setType] = useState<SiteType>("prezentare");
  const [options, setOptions] = useState<Record<string, number>>({});
  const [f, setF] = useState<Record<string, string>>({});
  const [logo, setLogo] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visibleOptions = CONFIG_OPTIONS.filter((o) => !o.only || o.only.includes(type));
  const { lines, total } = useMemo(() => configTotal({ type, options }), [type, options]);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  function toggle(id: string, on: boolean) {
    setOptions((p) => ({ ...p, [id]: on ? Math.max(1, p[id] ?? 0) : 0 }));
  }
  function qty(id: string, d: number) {
    setOptions((p) => ({ ...p, [id]: Math.max(0, Math.min(50, (p[id] ?? 0) + d)) }));
  }

  async function upload(files: FileList | null, kind: "logo" | "poze") {
    if (!files?.length) return;
    setError(null);
    setUploading(true);
    try {
      const list = kind === "logo" ? [files[0]] : Array.from(files).slice(0, MAX_PHOTOS - photos.length);
      for (const file of list) {
        const fd = new FormData();
        fd.set("file", file);
        fd.set("oras", offer.slug);
        const res = await fetch("/api/oferta-locala/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok || !data.url) throw new Error(data.error || "Nu am putut urca imaginea.");
        if (kind === "logo") setLogo(data.url);
        else setPhotos((p) => [...p, data.url].slice(0, MAX_PHOTOS));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nu am putut urca imaginea.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/oferta-locala/trimite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, oras: offer.slug, tip: type, optiuni: options, logo, poze: photos }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Nu am putut trimite.");
      fbTrack("Lead", { content_name: `oferta-${offer.slug}`, currency: "RON", value: data.total });
      router.push("/multumim");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu am putut trimite. Sună la 0741 970 247.");
      setSending(false);
    }
  }

  const card = "rounded-2xl border border-bg-border bg-bg-card/60 p-5 sm:p-6";
  const h = "font-display text-lg font-bold text-text";

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        {/* 1. Tipul */}
        <div className={card}>
          <h3 className={h}>1. Ce fel de site vrei?</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {SITE_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className={`rounded-xl border p-4 text-left transition ${
                  type === t.id ? "border-brand-orange bg-brand-orange/10" : "border-bg-border hover:border-brand-orange/40"
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-text">{t.label}</span>
                  {type === t.id && <Check className="h-4 w-4 text-brand-orange" />}
                </span>
                <span className="mt-0.5 block text-xs text-text-muted">{t.who}</span>
                <span className="mt-2 block text-sm font-bold text-brand-orange">
                  {t.id === "magazin" ? "de la " : ""}
                  {t.price.toLocaleString("ro-RO")} lei
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Opțiuni */}
        <div className={card}>
          <h3 className={h}>2. Ce mai vrei pe site?</h3>
          <p className="mt-1 text-xs text-text-muted">Bifează — totalul se actualizează pe loc.</p>
          <div className="mt-4 divide-y divide-bg-border/60">
            {visibleOptions.map((o) => {
              const n = options[o.id] ?? 0;
              return (
                <div key={o.id} className="flex items-center justify-between gap-3 py-3">
                  <label className="flex flex-1 cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={n > 0}
                      onChange={(e) => toggle(o.id, e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-[#FF6B1A]"
                    />
                    <span>
                      <span className="block text-sm text-text">{o.label}</span>
                      {o.why && <span className="block text-xs text-text-subtle">{o.why}</span>}
                    </span>
                  </label>
                  {o.perUnit && n > 0 ? (
                    <span className="flex items-center gap-2">
                      <button type="button" aria-label="Mai puțin" onClick={() => qty(o.id, -1)} className="rounded-full border border-bg-border p-1">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-5 text-center text-sm text-text">{n}</span>
                      <button type="button" aria-label="Mai mult" onClick={() => qty(o.id, 1)} className="rounded-full border border-bg-border p-1">
                        <Plus className="h-3 w-3" />
                      </button>
                    </span>
                  ) : null}
                  <span className="w-24 whitespace-nowrap text-right text-sm font-semibold text-text">
                    +{o.price} lei{o.perUnit ? ` / ${o.perUnit}` : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Despre firmă */}
        <div className={card}>
          <h3 className={h}>3. Despre afacerea ta</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Numele firmei" required>
              <input className={inputCls} value={f.firma ?? ""} onChange={set("firma")} placeholder="ex: Salon Bella" />
            </Field>
            <Field label="Domeniul">
              <input className={inputCls} value={f.domeniu ?? ""} onChange={set("domeniu")} placeholder="ex: coafură, stomatologie" />
            </Field>
          </div>
          <div className="mt-4 space-y-4">
            <Field label="Cu ce te ocupi? Povestește-ne pe scurt" required>
              <textarea rows={4} className={inputCls} value={f.descriere ?? ""} onChange={set("descriere")} placeholder="De când existați, ce vă face diferiți, pentru cine lucrați…" />
            </Field>
            <Field label="Serviciile sau produsele, cu prețuri dacă vrei să apară">
              <textarea rows={4} className={inputCls} value={f.servicii ?? ""} onChange={set("servicii")} placeholder="ex: tuns damă 60 lei, vopsit de la 150 lei…" />
            </Field>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Adresa">
              <input className={inputCls} value={f.adresa ?? ""} onChange={set("adresa")} placeholder={`str. …, ${offer.city}`} />
            </Field>
            <Field label="Programul">
              <input className={inputCls} value={f.program ?? ""} onChange={set("program")} placeholder="L–V 9–18, S 9–13" />
            </Field>
            <Field label="Telefonul afișat pe site">
              <input className={inputCls} value={f.telefonPublic ?? ""} onChange={set("telefonPublic")} />
            </Field>
            <Field label="Emailul afișat pe site">
              <input className={inputCls} value={f.emailPublic ?? ""} onChange={set("emailPublic")} />
            </Field>
            <Field label="Site-ul actual, dacă ai">
              <input className={inputCls} value={f.siteActual ?? ""} onChange={set("siteActual")} placeholder="www…" />
            </Field>
            <Field label="Facebook / Instagram">
              <input className={inputCls} value={f.social ?? ""} onChange={set("social")} placeholder="link-uri" />
            </Field>
            <Field label="Domeniul dorit (.ro)">
              <input className={inputCls} value={f.domeniuDorit ?? ""} onChange={set("domeniuDorit")} placeholder="ex: salonbella.ro" />
            </Field>
            <Field label="Culori preferate">
              <input className={inputCls} value={f.culori ?? ""} onChange={set("culori")} placeholder="ex: negru cu auriu" />
            </Field>
          </div>
          <div className="mt-4 space-y-4">
            <Field label="Site-uri care îți plac (exemple)">
              <input className={inputCls} value={f.exemple ?? ""} onChange={set("exemple")} />
            </Field>
            <Field label="Altceva ce trebuie să știm">
              <textarea rows={3} className={inputCls} value={f.mesaj ?? ""} onChange={set("mesaj")} />
            </Field>
          </div>
        </div>

        {/* 4. Materiale */}
        <div className={card}>
          <h3 className={h}>4. Logo și poze</h3>
          <p className="mt-1 text-xs text-text-muted">
            Nu ai poze bune? Nu e problemă — folosim imagini profesionale, incluse.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1.5 text-sm font-medium text-text">Logo</p>
              {logo ? (
                <div className="relative w-fit rounded-xl border border-bg-border bg-white p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logo} alt="Logo" className="h-16 w-auto" />
                  <button type="button" aria-label="Scoate logo" onClick={() => setLogo(null)} className="absolute -right-2 -top-2 rounded-full bg-bg-card p-1">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-bg-border p-4 text-sm text-text-muted hover:border-brand-orange/50">
                  <ImagePlus className="h-4 w-4" /> Încarcă logo-ul
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files, "logo")} />
                </label>
              )}
              {!logo && (
                <p className="mt-1.5 text-xs text-text-subtle">N-ai logo? Bifează mai sus „faceți-mi unul".</p>
              )}
            </div>
            <div>
              <p className="mb-1.5 text-sm font-medium text-text">Poze (până la {MAX_PHOTOS})</p>
              {photos.length < MAX_PHOTOS && (
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-bg-border p-4 text-sm text-text-muted hover:border-brand-orange/50">
                  <ImagePlus className="h-4 w-4" /> Încarcă poze
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => upload(e.target.files, "poze")} />
                </label>
              )}
              {photos.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {photos.map((p) => (
                    <div key={p} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p} alt="" className="h-14 w-14 rounded-lg object-cover" />
                      <button type="button" aria-label="Scoate poza" onClick={() => setPhotos((x) => x.filter((y) => y !== p))} className="absolute -right-1.5 -top-1.5 rounded-full bg-bg-card p-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {uploading && (
            <p className="mt-3 flex items-center gap-2 text-xs text-text-muted">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Se încarcă…
            </p>
          )}
        </div>

        {/* 5. Contact */}
        <div className={card}>
          <h3 className={h}>5. Cum te contactăm?</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field label="Numele tău" required>
              <input className={inputCls} value={f.name ?? ""} onChange={set("name")} autoComplete="name" />
            </Field>
            <Field label="Telefon (WhatsApp)" required>
              <input className={inputCls} value={f.phone ?? ""} onChange={set("phone")} autoComplete="tel" placeholder="07…" />
            </Field>
            <Field label="Email" required>
              <input type="email" className={inputCls} value={f.email ?? ""} onChange={set("email")} autoComplete="email" />
            </Field>
          </div>
        </div>
      </div>

      {/* Totalul — lipit pe desktop, la final pe telefon */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-brand-orange/40 bg-gradient-to-br from-brand-orange/10 via-bg-card/80 to-brand-purple/10 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Site-ul tău</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {lines.map((l) => (
              <li key={l.label} className="flex justify-between gap-3">
                <span className="text-text-muted">{l.label}</span>
                <span className="whitespace-nowrap text-text">{l.price.toLocaleString("ro-RO")} lei</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-brand-orange/20 pt-3">
            <p className="flex items-end justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Total</span>
              <span className="font-display text-3xl font-extrabold text-gradient">
                {total.toLocaleString("ro-RO")} lei
              </span>
            </p>
            <p className="mt-1 text-right text-xs text-text-muted">
              + {LOCAL_MONTHLY} lei/lună „Site activ" · prima lună gratuită
            </p>
          </div>
          <ul className="mt-3 space-y-1 text-[11px] text-text-subtle">
            {LOCAL_MONTHLY_INCLUDES.map((i) => (
              <li key={i}>• {i}</li>
            ))}
            <li>• Domeniu .ro gratuit primul an</li>
          </ul>
          <p className="mt-3 text-[11px] text-brand-orangeLight">
            🎁 Cadou: articol în {offer.newspaper.name}, campanie Facebook 5 zile, 30 de zile de modificări.
          </p>
          {error && <p className="mt-3 rounded-lg bg-red-500/10 p-2 text-xs text-red-300">{error}</p>}
          <button type="submit" disabled={sending || uploading} className="btn-primary mt-4 w-full justify-center">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Trimite cererea
          </button>
          <p className="mt-2 text-center text-[11px] text-text-subtle">
            Nu plătești nimic acum. Te contactăm azi sau mâine.
          </p>
        </div>
      </aside>
    </form>
  );
}
