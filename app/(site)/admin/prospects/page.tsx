"use client";

import { useState } from "react";
import {
  Search,
  Loader2,
  Globe,
  Phone,
  Star,
  XCircle,
  CheckCircle2,
  ExternalLink,
  Mail,
  Target,
  Copy,
  Check,
} from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";

type Prospect = {
  name: string;
  address: string;
  rating: number | null;
  reviewCount: number;
  website: string | null;
  phone: string | null;
  hasWebsite: boolean;
  isLead: boolean;
  placeId: string;
};

export default function ProspectsPage() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Prospect[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() || !city.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/prospects?q=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Eroare");
      setResults(data.results ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Eroare.");
    } finally {
      setLoading(false);
    }
  }

  function generateEmail(p: Prospect): string {
    const hasReviews = p.reviewCount > 0;
    const sitePart = p.hasWebsite
      ? `Am analizat site-ul ${p.website} și am găsit câteva oportunități de îmbunătățire.`
      : `Am observat că ${p.name} nu are încă un site web — în 2026, 87% din clienți caută online înainte să cumpere.`;
    const reviewPart = hasReviews
      ? `Aveți ${p.reviewCount} review-uri pe Google (${p.rating}★) — bine, dar putem crește.`
      : `Nu aveți review-uri pe Google încă — asta înseamnă că pierdeți clienți care aleg concurența.`;

    return `Bună ziua,

${sitePart}

${reviewPart}

Am pregătit o consultanță digitală GRATUITĂ pentru ${p.name} — durează 2 minute și vă arată exact unde pierdeți clienți online și ce puteți face:

👉 https://tools.imperial-media.ro/consultanta

Fără obligații, fără costuri. Doar informații utile pentru afacerea dumneavoastră.

Cu stimă,
Imperial Media
office@imperial-media.ro`;
  }

  function copyEmail(p: Prospect) {
    const text = generateEmail(p);
    navigator.clipboard.writeText(text);
    setCopied(p.placeId);
    setTimeout(() => setCopied(null), 2000);
  }

  const leads = results.filter((r) => r.isLead);
  const nonLeads = results.filter((r) => !r.isLead);

  return (
    <main className="container-app py-10">
      <AdminNav active="prospects" />
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold text-text">
          <Target className="mr-2 inline h-6 w-6 text-brand-orange" />
          Prospectare clienți
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Caută firme pe Google Maps → vezi care n-au site sau au puține review-uri → contactează-le
        </p>
      </div>

      {/* Search */}
      <form onSubmit={search} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ce cauți? (ex: restaurant, salon, instalator)"
          className="input flex-1"
          required
        />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Oraș (ex: Botoșani)"
          className="input sm:w-48"
          required
        />
        <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Caut...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Caută firme
            </>
          )}
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-6">
          {/* Stats */}
          <div className="mb-4 flex gap-4">
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-2 text-center">
              <p className="font-display text-2xl font-extrabold text-red-400">{leads.length}</p>
              <p className="text-[10px] uppercase tracking-wider text-text-subtle">Lead-uri</p>
            </div>
            <div className="rounded-xl border border-green-500/30 bg-green-500/5 px-4 py-2 text-center">
              <p className="font-display text-2xl font-extrabold text-green-400">{nonLeads.length}</p>
              <p className="text-[10px] uppercase tracking-wider text-text-subtle">Au deja site</p>
            </div>
          </div>

          {/* Lead-uri (fără site / puține reviews) */}
          {leads.length > 0 && (
            <>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-red-400">
                🔥 Lead-uri — fără site sau sub 10 review-uri
              </h2>
              <div className="space-y-3">
                {leads.map((p) => (
                  <ProspectCard
                    key={p.placeId}
                    p={p}
                    onCopy={() => copyEmail(p)}
                    isCopied={copied === p.placeId}
                  />
                ))}
              </div>
            </>
          )}

          {/* Non-leads */}
          {nonLeads.length > 0 && (
            <>
              <h2 className="mb-3 mt-8 text-xs font-bold uppercase tracking-wider text-green-400">
                ✅ Au deja prezență bună
              </h2>
              <div className="space-y-2">
                {nonLeads.map((p) => (
                  <ProspectCard
                    key={p.placeId}
                    p={p}
                    onCopy={() => copyEmail(p)}
                    isCopied={copied === p.placeId}
                    compact
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {results.length === 0 && !loading && !error && (
        <div className="mt-12 rounded-2xl border border-bg-border bg-bg-card/60 p-12 text-center">
          <Target className="mx-auto h-10 w-10 text-text-subtle" />
          <p className="mt-3 text-text-muted">
            Caută o industrie + oraș ca să găsești firme fără prezență online
          </p>
          <p className="mt-1 text-xs text-text-subtle">
            Exemplu: "frizerie Suceava", "stomatolog Cluj", "restaurant Iași"
          </p>
        </div>
      )}
    </main>
  );
}

function ProspectCard({
  p,
  onCopy,
  isCopied,
  compact,
}: {
  p: Prospect;
  onCopy: () => void;
  isCopied: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-4 rounded-xl border p-4 transition ${
        p.isLead
          ? "border-red-500/30 bg-red-500/5"
          : "border-bg-border bg-bg-card/60"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className={`font-display font-bold text-text ${compact ? "text-sm" : "text-base"}`}>
            {p.name}
          </h3>
          {p.isLead && (
            <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[9px] font-bold uppercase text-red-300">
              Lead
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-text-muted">{p.address}</p>

        <div className="mt-2 flex flex-wrap gap-3 text-xs">
          {p.rating && (
            <span className="flex items-center gap-1 text-text-muted">
              <Star className="h-3 w-3 text-yellow-400" />
              {p.rating}★ ({p.reviewCount} reviews)
            </span>
          )}
          {!p.rating && (
            <span className="flex items-center gap-1 text-red-400">
              <Star className="h-3 w-3" />
              Fără rating
            </span>
          )}

          {p.hasWebsite ? (
            <a
              href={p.website!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-green-400 hover:underline"
            >
              <Globe className="h-3 w-3" />
              Are site
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          ) : (
            <span className="flex items-center gap-1 font-semibold text-red-400">
              <XCircle className="h-3 w-3" />
              FĂRĂ site
            </span>
          )}

          {p.phone && (
            <a href={`tel:${p.phone}`} className="flex items-center gap-1 text-text-muted hover:text-text">
              <Phone className="h-3 w-3" />
              {p.phone}
            </a>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-shrink-0 flex-col gap-1.5">
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-brand-orange/40 bg-brand-orange/10 px-3 py-1.5 text-[11px] font-semibold text-brand-orange transition hover:bg-brand-orange/20"
        >
          {isCopied ? (
            <>
              <Check className="h-3 w-3" />
              Copiat!
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copiază email
            </>
          )}
        </button>
        <a
          href={`https://www.google.com/maps/place/?q=place_id:${p.placeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-bg-border px-3 py-1.5 text-[11px] text-text-muted transition hover:text-text"
        >
          <ExternalLink className="h-3 w-3" />
          Maps
        </a>
      </div>
    </div>
  );
}
