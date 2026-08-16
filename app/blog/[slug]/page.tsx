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
import { siteConfig } from "@/lib/site";
import { getStockPhoto } from "@/lib/stock-photo";

// Interogarea de poză per tip de articol — generic business, mereu relevant
function photoQueryFor(article: { template: string; slug: string }): string {
  if (article.template === "cost") return "web designer laptop modern office";
  if (article.template === "promovare") return "social media marketing smartphone business";
  if (article.slug.includes("restaurant")) return "restaurant owner tablet menu";
  if (article.slug.includes("medical")) return "medical clinic reception modern";
  if (article.slug.includes("magazin")) return "online shopping ecommerce laptop";
  return "small business owner laptop working";
}

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `${siteConfig.url}/blog/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      url: `${siteConfig.url}/blog/${article.slug}`,
      locale: "ro_RO",
    },
  };
}

// Plasa de linkuri interne: fiecare articol împinge autoritate spre paginile care
// trebuie să urce în Google — paginile de oraș și articolele-frate. Ancore exacte.
function relatedLinks(article: { slug: string; template: string; location?: { slug: string; name: string } }) {
  if (article.location) {
    const loc = article.location;
    const sibling =
      article.template === "cost"
        ? { href: `/blog/promovare-afacere-online-${loc.slug}`, label: `Cum să-ți promovezi afacerea online în ${loc.name}` }
        : { href: `/blog/cat-costa-site-web-${loc.slug}`, label: `Cât costă un site web în ${loc.name} în 2026` };
    return [
      { href: `/creare-site-web/${loc.slug}`, label: `Creare site web ${loc.name} — servicii, prețuri, proiecte locale` },
      sibling,
      { href: "/blog/seo-local-ghid-romania", label: "SEO local: cum ajungi pe prima pagină Google în orașul tău" },
    ];
  }
  const MAP: Record<string, Array<{ href: string; label: string }>> = {
    "cat-costa-magazin-online-romania": [
      { href: "/blog/magazin-online-ghid-complet", label: "Cum să deschizi un magazin online — ghid pas cu pas" },
      { href: "/blog/wordpress-vs-custom", label: "WordPress vs site custom — comparație sinceră" },
      { href: "/creare-site-web/bucuresti", label: "Creare site web București — prețuri și proiecte" },
    ],
    "magazin-online-ghid-complet": [
      { href: "/blog/cat-costa-magazin-online-romania", label: "Preț magazin online 2026: cât costă real în România" },
      { href: "/blog/seo-local-ghid-romania", label: "SEO local — strategia completă pentru România" },
      { href: "/creare-site-web/cluj-napoca", label: "Creare site web Cluj-Napoca — servicii și prețuri" },
    ],
    "seo-local-ghid-romania": [
      { href: "/blog/google-business-profile-ghid", label: "Google Business Profile — ghid complet 2026" },
      { href: "/creare-site-web/iasi", label: "Creare site web Iași — servicii, prețuri, proiecte" },
      { href: "/creare-site-web/timisoara", label: "Creare site web Timișoara — servicii și prețuri" },
    ],
    "google-business-profile-ghid": [
      { href: "/blog/seo-local-ghid-romania", label: "SEO local: cum ajungi pe prima pagină în orașul tău" },
      { href: "/service", label: "Radiografia Afacerii — vezi cum stă firma ta pe Google" },
      { href: "/creare-site-web/constanta", label: "Creare site web Constanța — servicii și prețuri" },
    ],
    "site-web-pentru-restaurant": [
      { href: "/blog/google-business-profile-ghid", label: "Google Business Profile pentru afaceri locale" },
      { href: "/blog/seo-local-ghid-romania", label: "SEO local — cum te găsesc clienții din orașul tău" },
      { href: "/creare-site-web/brasov", label: "Creare site web Brașov — servicii și prețuri" },
    ],
    "site-web-pentru-cabinet-medical": [
      { href: "/blog/google-business-profile-ghid", label: "Google Business Profile — ghid complet" },
      { href: "/blog/greseli-site-web-firme", label: "Top 10 greșeli pe care le fac firmele cu site-ul" },
      { href: "/creare-site-web/bucuresti", label: "Creare site web București — servicii și prețuri" },
    ],
    "site-web-pentru-salon-beauty": [
      { href: "/blog/google-business-profile-ghid", label: "Google Business Profile pentru afaceri locale" },
      { href: "/blog/seo-local-ghid-romania", label: "SEO local — strategia completă" },
      { href: "/creare-site-web/oradea", label: "Creare site web Oradea — servicii și prețuri" },
    ],
    "wordpress-vs-custom": [
      { href: "/blog/cat-costa-magazin-online-romania", label: "Preț magazin online 2026 — cât costă real" },
      { href: "/blog/greseli-site-web-firme", label: "Top 10 greșeli pe care le fac firmele cu site-ul" },
      { href: "/creare-site-web/sibiu", label: "Creare site web Sibiu — servicii și prețuri" },
    ],
    "de-ce-ai-nevoie-de-site-web": [
      { href: "/blog/greseli-site-web-firme", label: "Top 10 greșeli pe care le fac firmele cu site-ul" },
      { href: "/blog/seo-local-ghid-romania", label: "SEO local — cum apari primul în orașul tău" },
      { href: "/creare-site-web/craiova", label: "Creare site web Craiova — servicii și prețuri" },
    ],
    "greseli-site-web-firme": [
      { href: "/audit", label: "Audit gratuit al site-ului tău — 30 de secunde" },
      { href: "/blog/wordpress-vs-custom", label: "WordPress vs site custom — comparație sinceră" },
      { href: "/creare-site-web/ploiesti", label: "Creare site web Ploiești — servicii și prețuri" },
    ],
  };
  return MAP[article.slug] ?? [
    { href: "/blog/seo-local-ghid-romania", label: "SEO local — strategia completă pentru România" },
    { href: "/service", label: "Radiografia Afacerii — analiza completă a firmei tale" },
  ];
}

export default async function BlogArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  // Poza hero: Pexels (dacă e configurată cheia) sau coperta generată automat
  const heroAlt = `${article.title} — ghid Imperial Media`;
  const stock = await getStockPhoto(photoQueryFor(article), heroAlt);
  const heroSrc = stock?.url ?? `/blog/${article.slug}/opengraph-image`;

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

        {/* Imaginea hero — Pexels sau coperta branduită; Google și LLM-urile preferă articole cu imagini */}
        <figure className="mt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroSrc} alt={heroAlt} className="aspect-[1200/630] w-full rounded-2xl border border-bg-border object-cover" loading="eager" />
          {stock && (
            <figcaption className="mt-1.5 text-right text-[10px] text-text-subtle">
              Foto: <a href={stock.photographerUrl} target="_blank" rel="noopener noreferrer" className="underline">{stock.photographer}</a> / Pexels
            </figcaption>
          )}
        </figure>

        <div
          className="project-content mt-8"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Citește și — plasa de linkuri interne care împinge paginile de oraș */}
        <div className="mt-10 rounded-2xl border border-bg-border bg-bg-card/60 p-5">
          <h2 className="font-display text-base font-bold text-text">Citește și</h2>
          <ul className="mt-3 space-y-2">
            {relatedLinks(article).map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex items-start gap-2 text-sm text-brand-orange hover:underline">
                  <ArrowRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

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

      {/* Schema.org: Article + Breadcrumb — eligibil pentru rich results și citare LLM */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                "@id": `${siteConfig.url}/blog/${article.slug}#article`,
                headline: article.title,
                description: article.description,
                image: stock?.url ?? `${siteConfig.url}/blog/${article.slug}/opengraph-image`,
                datePublished: article.date,
                dateModified: article.date,
                inLanguage: "ro-RO",
                mainEntityOfPage: `${siteConfig.url}/blog/${article.slug}`,
                author: { "@type": "Organization", name: "Imperial Media", url: siteConfig.url },
                publisher: {
                  "@type": "Organization",
                  name: "Imperial Media",
                  url: siteConfig.url,
                  logo: { "@type": "ImageObject", url: `${siteConfig.url}/logo.png` },
                },
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Acasă", item: siteConfig.url },
                  { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
                  { "@type": "ListItem", position: 3, name: article.title, item: `${siteConfig.url}/blog/${article.slug}` },
                ],
              },
            ],
          }),
        }}
      />
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
    .replace(/\[(.+?)\]\((.+?)\)/g, (_m, text, href) => {
      // Doar link-uri relative sau http(s) — blochează javascript:, data:, etc.
      const safe = /^(\/|https?:\/\/)/i.test(href.trim());
      return safe ? `<a href="${href}">${text}</a>` : text;
    })
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/^(?!<[hulo])((?!<\/)[^\n]+)$/gm, "<p>$1</p>")
    .replace(/<p><\/p>/g, "");
}
