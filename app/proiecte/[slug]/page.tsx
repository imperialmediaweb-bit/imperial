import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Zap, Calendar } from "lucide-react";
import { Aurora } from "@/components/effects/Aurora";
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
  const p = importedProjects.find((x) => x.slug === params.slug);
  if (!p) notFound();

  const heroImage = p.wpImages?.[0];
  const relatedProjects = importedProjects
    .filter((x) => x.slug !== p.slug)
    .filter((x) => x.categories.some((c) => p.categories.includes(c)))
    .slice(0, 3);

  return (
    <>
      {/* Hero cu imagine proiect */}
      <section className="relative overflow-hidden pb-16 pt-10 sm:pt-16">
        <Aurora />
        <div className="container-app relative z-10">
          <Link
            href="/proiecte"
            className="inline-flex items-center gap-2 text-sm text-text-muted transition hover:text-brand-orange"
          >
            <ArrowLeft className="h-4 w-4" />
            Înapoi la portofoliu
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr,1fr] lg:items-center">
            {/* LEFT — info */}
            <div>
              <div className="flex flex-wrap gap-2">
                {p.categories.slice(0, 4).map((c) => (
                  <span
                    key={c}
                    className="chip border-brand-orange/40 bg-brand-orange/10 text-brand-orangeLight"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-text sm:text-5xl lg:text-6xl">
                {p.title}
              </h1>
              {p.excerpt && (
                <p className="mt-5 max-w-xl text-base text-text-muted sm:text-lg">
                  {p.excerpt}
                </p>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                {p.externalUrl && (
                  <a
                    href={p.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Vizitează site-ul live
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <Link href="/#brief" className="btn-ghost">
                  <Zap className="h-4 w-4" />
                  Vreau ceva similar
                </Link>
              </div>
            </div>

            {/* RIGHT — hero image */}
            {heroImage && (
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-bg-border bg-bg-card shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8),0_0_60px_rgba(255,107,26,0.2)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImage}
                  alt={p.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content body */}
      {p.content && (
        <section className="relative pb-20">
          <div className="container-app max-w-4xl">
            <div
              className="project-content prose-invert"
              dangerouslySetInnerHTML={{ __html: p.content }}
            />
          </div>
        </section>
      )}

      {/* Related projects */}
      {relatedProjects.length > 0 && (
        <section className="section border-t border-bg-border/50 bg-bg-soft/30">
          <div className="container-app">
            <h2 className="section-title">
              Proiecte <span className="text-shimmer">similare</span>
            </h2>
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
                    </div>
                    <div className="p-5">
                      <span className="text-[10px] uppercase tracking-wider text-text-subtle">
                        {r.categories[0]}
                      </span>
                      <h3 className="mt-1 font-display text-base font-bold text-text">
                        {r.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="section">
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
