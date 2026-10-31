import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { getAllArticles } from "@/lib/blog-articles";

export const metadata: Metadata = {
  title: "Blog — Articole despre web design, SEO și marketing digital",
  description:
    "Articole, ghiduri și sfaturi despre creare site web, SEO local, promovare online, și marketing digital pentru afaceri din România.",
};

export default function BlogPage() {
  const articles = getAllArticles();
  const featured = articles.slice(0, 3);
  const rest = articles.slice(3);

  return (
    <main className="container-app py-10 sm:py-16">
      <div className="text-center">
        <span className="chip">Blog</span>
        <h1 className="section-title mt-4 mx-auto">
          Articole despre <span className="text-gradient">digital</span>
        </h1>
        <p className="section-subtitle mx-auto">
          Ghiduri practice, prețuri transparente, și strategii testate pentru
          afaceri din România. {articles.length} articole.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {featured.map((a) => (
          <Link
            key={a.slug}
            href={`/blog/${a.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-bg-border bg-bg-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/50"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand-orange/20 via-brand-purple/10 to-transparent">
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <p className="text-center font-display text-lg font-bold text-text/80 line-clamp-3">
                  {a.title}
                </p>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <span className="mb-2 inline-block w-fit rounded-full border border-brand-orange/30 bg-brand-orange/10 px-2.5 py-0.5 text-[10px] font-semibold text-brand-orange">
                {a.category}
              </span>
              <p className="flex-1 text-sm leading-relaxed text-text-muted line-clamp-2">
                {a.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[11px] text-text-subtle">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(a.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {a.readTime}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-brand-orange opacity-0 transition group-hover:opacity-100" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {rest.length > 0 && (
        <div className="mt-8 space-y-3">
          {rest.map((a) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="group flex items-center gap-4 rounded-xl border border-bg-border bg-bg-card/60 p-4 transition hover:border-brand-orange/50"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-brand-orange/30 bg-brand-orange/10 px-2 py-0.5 text-[9px] font-semibold text-brand-orange">
                    {a.category}
                  </span>
                  {a.location && (
                    <span className="text-[10px] text-text-subtle">
                      📍 {a.location.name}
                    </span>
                  )}
                </div>
                <h2 className="mt-1 font-display text-sm font-bold text-text line-clamp-1 group-hover:text-brand-orange">
                  {a.title}
                </h2>
                <p className="mt-0.5 text-xs text-text-muted line-clamp-1">
                  {a.description}
                </p>
              </div>
              <div className="hidden flex-shrink-0 items-center gap-2 text-[11px] text-text-subtle sm:flex">
                <span>{formatDate(a.date)}</span>
                <span>·</span>
                <span>{a.readTime}</span>
              </div>
              <ArrowRight className="h-4 w-4 flex-shrink-0 text-text-subtle transition group-hover:text-brand-orange" />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("ro-RO", { day: "numeric", month: "short" });
}
