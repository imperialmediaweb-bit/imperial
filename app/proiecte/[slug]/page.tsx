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
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Aurora } from "@/components/effects/Aurora";
import { Meteors } from "@/components/effects/Meteors";
import { importedProjects } from "@/lib/projects-data";

export function generateStaticParams() {
  return importedProjects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = importedProjects.find((x) => x.slug === params.slug);
  if (!p) return { title: "Proiect · Imperial Media" };
  return {
    title: `${p.title} — Portofoliu Imperial Media`,
    description: p.excerpt ?? `Proiect realizat de Imperial Media: ${p.title}`,
    openGraph: {
      title: p.title,
      description: p.excerpt ?? "",
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

  const prev =
    index > 0
      ? importedProjects[index - 1]
      : importedProjects[importedProjects.length - 1];
  const next =
    index < importedProjects.length - 1
      ? importedProjects[index + 1]
      : importedProjects[0];

  const heroImage = p.wpImages?.[0];
  const secondaryImages = p.wpImages?.slice(1) ?? [];
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
            {/* LEFT — info */}
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
              {p.excerpt && (
                <p className="mt-6 max-w-xl text-base text-text-muted sm:text-lg">
                  {p.excerpt}
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

            {/* RIGHT — hero image cu floating stats */}
            <div className="relative">
              {heroImage && (
                <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-bg-border bg-bg-card shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8),0_0_60px_rgba(255,107,26,0.25)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroImage}
                    alt={p.title}
                    className="h-full w-full object-cover"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              )}
              {/* Floating stat card */}
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
              {/* Categorii count */}
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

      {/* CONTENT + SIDEBAR */}
      {p.content && (
        <section className="relative pb-24">
          <div className="container-app">
            <div className="grid gap-10 lg:grid-cols-[1fr,280px]">
              {/* Main content */}
              <article className="min-w-0">
                <div
                  className="project-content"
                  dangerouslySetInnerHTML={{ __html: p.content }}
                />
              </article>

              {/* Sticky sidebar */}
              <aside className="lg:sticky lg:top-28 lg:h-fit lg:self-start">
                <div className="card space-y-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-text-subtle">
                      Categorii
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {p.categories.map((c) => (
                        <span
                          key={c}
                          className="rounded-full border border-bg-border bg-white/5 px-2.5 py-0.5 text-[11px] text-text-muted"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {p.externalUrl && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-text-subtle">
                        Site
                      </p>
                      <a
                        href={p.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1.5 break-all text-sm text-brand-orange transition hover:text-brand-orangeLight"
                      >
                        <Globe className="h-3.5 w-3.5 flex-shrink-0" />
                        {hostname}
                      </a>
                    </div>
                  )}

                  <div className="border-t border-bg-border/60 pt-5">
                    <p className="mb-3 text-[10px] uppercase tracking-wider text-text-subtle">
                      Vrei ceva similar?
                    </p>
                    <Link
                      href="/#brief"
                      className="btn-primary w-full justify-center"
                    >
                      <Zap className="h-3.5 w-3.5" />
                      Cere ofertă
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      )}

      {/* SECONDARY IMAGES gallery */}
      {secondaryImages.length > 0 && (
        <section className="relative pb-20">
          <div className="container-app">
            <h2 className="section-title mb-8">
              Galerie <span className="text-gradient">proiect</span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {secondaryImages.map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={img}
                  alt={`${p.title} — imagine ${i + 2}`}
                  className="aspect-[16/10] w-full rounded-2xl border border-bg-border object-cover shadow-card transition-transform duration-500 hover:scale-[1.01]"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PREV / NEXT navigation */}
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
                  Alte proiecte din{" "}
                  <span className="text-shimmer">aceeași categorie</span>
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

      {/* CTA final */}
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
