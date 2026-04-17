import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Zap, ArrowRight } from "lucide-react";
import {
  getAllArticles,
  getArticleBySlug,
  generateCostContent,
  generatePromoContent,
  generateGeneralContent,
} from "@/lib/blog-articles";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
    },
  };
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  let content: string;
  if (article.template === "cost" && article.location) {
    content = generateCostContent(article.location);
  } else if (article.template === "promovare" && article.location) {
    content = generatePromoContent(article.location);
  } else {
    content = generateGeneralContent(article.slug);
  }

  const htmlContent = markdownToHtml(content);

  return (
    <main className="container-app max-w-3xl py-10 sm:py-16">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted transition hover:text-text"
      >
        <ArrowLeft className="h-4 w-4" />
        Toate articolele
      </Link>

      <article className="mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-brand-orange/30 bg-brand-orange/10 px-3 py-0.5 text-[11px] font-semibold text-brand-orange">
            {article.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-text-subtle">
            <Calendar className="h-3 w-3" />
            {formatDate(article.date)}
          </span>
          <span className="flex items-center gap-1 text-xs text-text-subtle">
            <Clock className="h-3 w-3" />
            {article.readTime}
          </span>
        </div>

        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
          {article.title}
        </h1>

        <p className="mt-4 text-base leading-relaxed text-text-muted">
          {article.description}
        </p>

        <div className="mt-2 h-1 w-20 rounded-full bg-orange-gradient" />

        <div
          className="project-content mt-8"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* CTA */}
        <div className="mt-12 rounded-3xl border border-brand-orange/30 bg-gradient-to-br from-brand-orange/10 via-transparent to-brand-purple/10 p-6 text-center sm:p-8">
          <h2 className="font-display text-xl font-bold text-text">
            Pregătit să faci pasul?
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Primește estimare gratuită cu AI-ul nostru sau discută cu un consultant digital.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/brief" className="btn-primary">
              <Zap className="h-4 w-4" />
              Primește estimare
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/consultanta" className="btn-ghost">
              Consultanță gratuită
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function markdownToHtml(md: string): string {
  return md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/^(?!<[hulo])((?!<\/)[^\n]+)$/gm, "<p>$1</p>")
    .replace(/<p><\/p>/g, "");
}
