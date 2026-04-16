import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Calendar,
  Briefcase,
  Palette,
  Clock,
  Sparkles,
  User,
} from "lucide-react";
import { isAdminConfigured, isAuthed } from "@/lib/admin-auth";
import { hasDb } from "@/lib/db";
import { getBrief } from "@/lib/briefs";
import { StatusPill } from "@/components/admin/StatusPill";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function BriefDetailPage({
  params,
}: {
  params: { id: string };
}) {
  if (!isAdminConfigured()) {
    redirect("/admin");
  }
  if (!isAuthed()) {
    redirect("/admin/login");
  }
  if (!hasDb()) {
    redirect("/admin");
  }

  const id = parseInt(params.id, 10);
  if (!Number.isFinite(id) || id <= 0) notFound();

  const b = await getBrief(id);
  if (!b) notFound();

  const hasEstimate = b.ai_estimate_min !== null && b.ai_estimate_max !== null;

  return (
    <main className="container-app max-w-4xl py-10">
      {/* Nav */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted transition hover:text-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Toate brief-urile
        </Link>
        <LogoutButton />
      </div>

      {/* Header card */}
      <div className="rounded-3xl border border-bg-border bg-bg-card bg-card-gradient p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-text-subtle">
              Brief #{b.id}
            </p>
            <h1 className="mt-1 font-display text-2xl font-extrabold text-text">
              {b.name}
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-text-muted">
              <Clock className="h-3 w-3" />
              {b.created_at.toLocaleString("ro-RO", {
                dateStyle: "long",
                timeStyle: "short",
              })}
              {b.source === "ai-chat" && (
                <>
                  {" · "}
                  <span className="inline-flex items-center gap-1 text-brand-orange">
                    <Sparkles className="h-3 w-3" /> generat de AI chat
                  </span>
                </>
              )}
            </p>
          </div>
          <StatusPill id={b.id} status={b.status} />
        </div>

        {/* Quick actions */}
        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href={`mailto:${b.email}?subject=${encodeURIComponent(
              `Oferta Imperial Media — ${b.name}`
            )}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-orange-gradient px-4 py-2 text-xs font-semibold text-white shadow-glow-orange transition hover:scale-105"
          >
            <Mail className="h-3.5 w-3.5" />
            Trimite ofertă
          </a>
          {b.phone && (
            <a
              href={`tel:${b.phone}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-orange/50 bg-brand-orange/10 px-4 py-2 text-xs font-semibold text-text hover:bg-brand-orange/20"
            >
              <Phone className="h-3.5 w-3.5" />
              {b.phone}
            </a>
          )}
          <a
            href={`https://wa.me/${b.phone?.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 rounded-full border border-bg-border bg-white/5 px-4 py-2 text-xs font-semibold text-text-muted hover:text-text ${
              !b.phone ? "pointer-events-none opacity-40" : ""
            }`}
          >
            WhatsApp
          </a>
        </div>
      </div>

      {/* Info grid */}
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {/* Contact */}
        <Section icon={User} title="Contact">
          <Row icon={Mail} label="Email">
            <a
              href={`mailto:${b.email}`}
              className="break-all text-brand-orange hover:underline"
            >
              {b.email}
            </a>
          </Row>
          {b.phone && (
            <Row icon={Phone} label="Telefon">
              <a
                href={`tel:${b.phone}`}
                className="text-brand-orange hover:underline"
              >
                {b.phone}
              </a>
            </Row>
          )}
        </Section>

        {/* Proiect */}
        <Section icon={Briefcase} title="Proiect">
          <Row label="Pachet">{packageLabel(b.selected_package)}</Row>
          {b.industry && <Row label="Domeniu">{b.industry}</Row>}
          {b.current_site && (
            <Row icon={Globe} label="Site actual">
              <a
                href={b.current_site.startsWith("http") ? b.current_site : `https://${b.current_site}`}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-brand-orange hover:underline"
              >
                {b.current_site}
              </a>
            </Row>
          )}
          {b.pages && <Row label="Pagini">{b.pages}</Row>}
          {b.deadline && (
            <Row icon={Calendar} label="Termen">
              {b.deadline}
            </Row>
          )}
        </Section>

        {/* Design */}
        <Section icon={Palette} title="Design & detalii">
          {b.has_logo && (
            <Row label="Logo">
              {b.has_logo === "da" ? "Are deja" : "Face Imperial"}
            </Row>
          )}
          {b.colors_preference && (
            <Row label="Culori">{b.colors_preference}</Row>
          )}
          {b.features.length > 0 && (
            <Row label="Features">
              <div className="flex flex-wrap gap-1.5">
                {b.features.map((f, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-brand-orange/30 bg-brand-orange/10 px-2 py-0.5 text-[11px] text-brand-orange"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </Row>
          )}
          {b.inspiration && <Row label="Inspirație">{b.inspiration}</Row>}
        </Section>

        {/* AI recomandări */}
        {(hasEstimate || b.ai_recommended_package) && (
          <Section icon={Sparkles} title="Generat de AI">
            {b.ai_recommended_package && (
              <Row label="Pachet sugerat">
                {packageLabel(b.ai_recommended_package)}
                {b.ai_recommended_reason && (
                  <p className="mt-0.5 text-[11px] text-text-subtle">
                    {b.ai_recommended_reason}
                  </p>
                )}
              </Row>
            )}
            {hasEstimate && (
              <Row label="Estimare">
                <span className="font-mono font-bold text-gradient text-lg">
                  {b.ai_estimate_min}–{b.ai_estimate_max} €
                </span>
                {b.ai_estimate_reason && (
                  <p className="mt-0.5 text-[11px] text-text-subtle">
                    {b.ai_estimate_reason}
                  </p>
                )}
              </Row>
            )}
          </Section>
        )}
      </div>

      {/* Mesaj liber */}
      {b.message && (
        <div className="mt-5 rounded-2xl border border-bg-border bg-bg-card/60 p-5">
          <h3 className="text-[10px] uppercase tracking-wider text-text-subtle">
            Mesaj / detalii suplimentare
          </h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-text">
            {b.message}
          </p>
        </div>
      )}

      {/* Meta */}
      <div className="mt-5 rounded-2xl border border-bg-border bg-bg-soft/40 p-4 text-[11px] text-text-subtle">
        <p>
          <strong className="text-text-muted">Sursa:</strong>{" "}
          {b.source === "ai-chat" ? "AI Chat (/brief)" : b.source ?? "—"}
        </p>
        {b.user_agent && (
          <p className="mt-1 truncate">
            <strong className="text-text-muted">Browser:</strong> {b.user_agent}
          </p>
        )}
        {b.ip_hash && (
          <p className="mt-1">
            <strong className="text-text-muted">IP hash:</strong>{" "}
            <code className="break-all">{b.ip_hash}</code>
          </p>
        )}
      </div>
    </main>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
      <h2 className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
        <Icon className="h-3.5 w-3.5 text-brand-orange" />
        {title}
      </h2>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  children,
}: {
  icon?: any;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-text-subtle">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </div>
      <div className="mt-0.5 text-sm text-text">{children}</div>
    </div>
  );
}

function packageLabel(key: string | null): string {
  switch (key) {
    case "website":
      return "Website Prezentare";
    case "shop":
      return "Magazin Online";
    case "promo":
      return "Promovare";
    case "admin":
      return "Administrare / Mentenanță";
    case "personalizat":
      return "Personalizat";
    default:
      return key ?? "—";
  }
}
