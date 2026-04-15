import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Zap,
  Tag,
  Globe,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Target,
  Award,
  Layers,
} from "lucide-react";
import { Aurora } from "@/components/effects/Aurora";
import { Meteors } from "@/components/effects/Meteors";
import { importedProjects } from "@/lib/projects-data";
import {
  projectOverrides,
  getDefaultCaseStudy,
} from "@/lib/project-overrides";

export function generateStaticParams() {
  return importedProjects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = importedProjects.find((x) => x.slug === params.slug);
  if (!p) return { title: "Proiect · Imperial Media" };
  const override = projectOverrides[p.slug];
  return {
    title: `${p.title} — Portofoliu Imperial Media`,
    description:
      override?.tagline ??
      p.excerpt ??
      `Proiect realizat de Imperial Media: ${p.title}`,
    openGraph: {
      title: p.title,
      description: override?.tagline ?? p.excerpt ?? "",
      images: p.wpImages?.[0] ? [p.wpImages[0]] : undefined,
    },
  };
}

export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const index = importedProjects.findIndex((x) => x.slug === params.slug);
  if (index === -1) notFound();
  const p = importedProjects[index];
  const study =
    projectOverrides[p.slug] ?? getDefaultCaseStudy(p.title, p.categories);

  const prev =
    index > 0
      ? importedProjects[index - 1]
      : importedProjects[importedProjects.length - 1];
  const next =
    index < importedProjects.length - 1
      ? importedProjects[index + 1]
      : importedProjects[0];

  const heroImage = p.wpImages?.[0];
  const galleryImages = p.wpImages?.slice(1) ?? [];
  const hostname = p.externalUrl
    ? new URL(p.externalUrl).hostname.replace("www.", "")
    : null;

  const relatedProjects = importedProjects
    .filter((x) => x.slug !== p.slug)
    .filter((x) => x.categories.some((c) => p.categories.includes(c)))
    .slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pb-20 pt-10 sm:pt-16">
        <Aurora />
        <Meteors count={8} />
        <div className="container-app relative z-10">
          <Link
            href="/proiecte"
            className="group inline-flex items-center gap-2 rounded-full border border-bg-border bg-bg-card/60 px-4 py-2 text-xs font-medium text-text-muted backdrop-blur transition hover:border-brand-orange hover:text-text"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Înapoi la portofoliu
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr,1fr] lg:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                {p.categories.slice(0, 4).map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 rounded-full border border-brand-orange/40 bg-brand-orange/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-brand-orangeLight"
                  >
                    <Tag className="h-2.5 w-2.5" />
                    {c}
                  </span>
                ))}
              </div>
              <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-text sm:text-5xl lg:text-[4.5rem]">
                {p.title}
              </h1>
              {study.tagline && (
                <p className="mt-6 max-w-xl text-base text-text-muted sm:text-lg">
                  {study.tagline}
                </p>
              )}
              <div className="mt-9 flex flex-wrap gap-3">
                {p.externalUrl && (
                  <a
                    href={p.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-orange-gradient px-7 py-3.5 text-base font-semibold text-white shadow-glow-orange transition-all hover:scale-[1.04]"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <Globe className="h-4 w-4" />
                    Vizitează site-ul live
                    <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                )}
                <Link href="/#brief" className="btn-ghost">
                  <Zap className="h-4 w-4" />
                  Vreau ceva similar
                </Link>
              </div>
            </div>

            <div className="relative">
              {heroImage && (
                <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-bg-border bg-bg-card shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8),0_0_60px_rgba(255,107,26,0.25)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroImage}
                    alt={p.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              )}
              {hostname && (
                <div className="glass absolute -bottom-5 -left-4 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-glow-orange">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-gradient text-white">
                    <Globe className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-text-subtle">
                      Live pe
                    </p>
                    <p className="text-sm font-bold text-text">{hostname}</p>
                  </div>
                </div>
              )}
              <div className="glass absolute -top-4 -right-3 flex items-center gap-3 rounded-2xl px-4 py-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-purple to-indigo-600 text-white">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-text-subtle">
                    Servicii
                  </p>
                  <p className="text-sm font-bold text-text">
                    {p.categories.length} domenii
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CASE STUDY — Provocare + Soluție cards */}
      <section className="relative py-20">
        <div className="container-app max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-2">
            {study.challenge && (
              <div className="group relative overflow-hidden rounded-3xl border border-bg-border bg-bg-card bg-card-gradient p-8 transition hover:border-brand-orange/40">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-orange/10 blur-3xl transition group-hover:bg-brand-orange/20" />
                <div className="relative">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-orange to-pink-500 text-white shadow-glow-orange">
                    <Target className="h-5 w-5" />
                  </span>
                  <h2 className="mt-5 font-display text-2xl font-extrabold text-text">
                    Provocarea
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-text-muted">
                    {study.challenge}
                  </p>
                </div>
              </div>
            )}

            {study.solution && (
              <div className="group relative overflow-hidden rounded-3xl border border-bg-border bg-bg-card bg-card-gradient p-8 transition hover:border-brand-orange/40">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-purple/10 blur-3xl transition group-hover:bg-brand-purple/20" />
                <div className="relative">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple to-indigo-600 text-white shadow-glow-purple">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <h2 className="mt-5 font-display text-2xl font-extrabold text-text">
                    Soluția livrată
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-text-muted">
                    {study.solution}
                  </p>
                </div>
              </div>
            )}
          </div>

          {study.highlights && study.highlights.length > 0 && (
            <div className="mt-8 rounded-3xl border border-bg-border bg-bg-card bg-card-gradient p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-orange via-brand-purple to-indigo-500 text-white">
                  <Layers className="h-5 w-5" />
                </span>
                <h2 className="font-display text-2xl font-extrabold text-text">
                  Ce include proiectul
                </h2>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {study.highlights.map((h, i) => (
                  <div
                    key={h}
                    className="group flex items-center gap-3 rounded-2xl border border-bg-border bg-bg-soft/60 p-4 transition hover:border-brand-orange/50 hover:bg-bg-soft"
                  >
                    <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-orange-gradient text-xs font-bold text-white shadow-glow-orange">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-medium text-text">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {study.results && study.results.length > 0 && (
            <div className="mt-8 rounded-3xl border border-brand-orange/40 bg-brand-orange/5 p-8 shadow-glow-orange">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                  <Award className="h-5 w-5" />
                </span>
                <h2 className="font-display text-2xl font-extrabold text-text">
                  Rezultate
                </h2>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {study.results.map((r) => (
                  <div
                    key={r.label}
                    className="rounded-2xl border border-bg-border bg-bg-card p-6 text-center"
                  >
                    <p className="text-shimmer font-display text-4xl font-extrabold sm:text-5xl">
                      {r.value}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-wider text-text-muted">
                      {r.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* GALERIE — fără duplicate hero image */}
      {galleryImages.length > 0 && (
        <section className="relative py-20">
          <div className="container-app max-w-6xl">
            <div className="text-center">
              <span className="chip">Galerie</span>
              <h2 className="section-title mt-4 mx-auto">
                Capturi <span className="text-gradient">proiect</span>
              </h2>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  className="group overflow-hidden rounded-2xl border border-bg-border bg-bg-card shadow-card transition hover:-translate-y-1 hover:border-brand-orange/50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${p.title} — imagine ${i + 2}`}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CATEGORII + SITE */}
      <section className="relative py-16">
        <div className="container-app max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-bg-border bg-bg-card bg-card-gradient p-8">
              <p className="text-[10px] uppercase tracking-wider text-text-subtle">
                Domenii abordate
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.categories.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-3 py-1.5 text-xs font-medium text-brand-orangeLight"
                  >
                    <Tag className="h-3 w-3" />
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-bg-border bg-bg-card bg-card-gradient p-8">
              <p className="text-[10px] uppercase tracking-wider text-text-subtle">
                Site live
              </p>
              {p.externalUrl ? (
                <>
                  <a
                    href={p.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-xl font-bold text-brand-orange transition hover:text-brand-orangeLight"
                  >
                    <Globe className="h-5 w-5" />
                    {hostname}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <p className="mt-2 text-sm text-text-muted">
                    Click pentru a vedea site-ul în acțiune.
                  </p>
                </>
              ) : (
                <p className="mt-3 text-text-muted">Site offline sau privat.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PREV / NEXT */}
      <section className="border-y border-bg-border/60 bg-bg-soft/40 py-10">
        <div className="container-app grid gap-4 sm:grid-cols-2">
          <Link
            href={`/proiecte/${prev.slug}`}
            className="group flex items-center gap-4 rounded-2xl border border-bg-border bg-bg-card p-5 transition hover:border-brand-orange hover:bg-bg-card/80"
          >
            <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-full border border-bg-border text-text-muted transition group-hover:border-brand-orange group-hover:bg-orange-gradient group-hover:text-white">
              <ChevronLeft className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-text-subtle">
                Proiect anterior
              </p>
              <p className="truncate font-display text-base font-bold text-text">
                {prev.title}
              </p>
            </div>
          </Link>
          <Link
            href={`/proiecte/${next.slug}`}
            className="group flex flex-row-reverse items-center gap-4 rounded-2xl border border-bg-border bg-bg-card p-5 text-right transition hover:border-brand-orange hover:bg-bg-card/80"
          >
            <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-full border border-bg-border text-text-muted transition group-hover:border-brand-orange group-hover:bg-orange-gradient group-hover:text-white">
              <ChevronRight className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-text-subtle">
                Proiect următor
              </p>
              <p className="truncate font-display text-base font-bold text-text">
                {next.title}
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* RELATED */}
      {relatedProjects.length > 0 && (
        <section className="section">
          <div className="container-app">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <span className="chip">Proiecte similare</span>
                <h2 className="section-title mt-4">
                  Din <span className="text-shimmer">aceeași categorie</span>
                </h2>
              </div>
              <Link href="/proiecte" className="btn-ghost">
                Vezi toate
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {relatedProjects.map((r) => {
                const img = r.wpImages?.[0];
                return (
                  <Link
                    key={r.slug}
                    href={`/proiecte/${r.slug}`}
                    className="group overflow-hidden rounded-2xl border border-bg-border bg-bg-card transition hover:-translate-y-1 hover:border-brand-orange/60"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-bg-soft">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={img}
                          alt={r.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-brand-orange to-brand-purple" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute left-3 top-3 rounded-full bg-bg/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur">
                        {r.categories[0]}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-base font-bold text-text transition group-hover:text-brand-orange">
                        {r.title}
                      </h3>
                      <p className="mt-2 inline-flex items-center gap-1 text-xs text-text-subtle">
                        Vezi detalii
                        <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section className="section border-t border-bg-border/50">
        <div className="container-app text-center">
          <h2 className="section-title mx-auto">
            Vrei să fii <span className="text-shimmer">următorul</span>?
          </h2>
          <p className="section-subtitle mx-auto">
            Completează briefingul și revenim cu oferta ta personalizată în 24h.
          </p>
          <Link href="/#brief" className="btn-primary mt-8 inline-flex">
            <Zap className="h-4 w-4" />
            Începe proiectul tău
          </Link>
        </div>
      </section>
    </>
  );
}
