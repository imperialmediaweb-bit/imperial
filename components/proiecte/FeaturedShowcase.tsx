"use client";

/**
 * Vitrina portofoliului: proiectele recomandate defilează orizontal pe măsură ce
 * derulezi (secțiune fixată, GSAP ScrollTrigger). Fiecare proiect e un „ecran" mare
 * cu captura reală a site-ului într-o ramă de browser. Pe mobil / reduced-motion:
 * listă verticală simplă.
 */

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { gsap, registerGsap, useGSAP } from "../ids/lib/gsap";
import { useReducedMotion } from "../ids/hooks";
import { importedProjects } from "@/lib/projects-data";
import { sortProjectsNewestFirst } from "@/lib/project-overrides";

const featured = sortProjectsNewestFirst(importedProjects)
  .filter((p) => p.externalUrl)
  .slice(0, 6);

const GLOWS = ["#FF6B1A", "#FF2E9A", "#8B2FF7", "#FF2E9A", "#FF6B1A", "#B06CFF"];

function host(u: string) {
  return u.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

function Slide({ p, i }: { p: (typeof featured)[number]; i: number }) {
  const glow = GLOWS[i % GLOWS.length];
  return (
    <article className="showcase-slide relative flex w-full shrink-0 flex-col gap-8 lg:w-[78vw] lg:flex-row lg:items-center lg:gap-14">
      {/* rama de browser cu captura reală */}
      <div className="relative lg:w-[62%]">
        <div
          className="pointer-events-none absolute -inset-10 -z-10 rounded-full opacity-40 blur-3xl"
          style={{ background: `radial-gradient(circle, ${glow}55, transparent 65%)` }}
        />
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0c12] shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
            <span className="ml-3 truncate rounded-md bg-white/[0.05] px-3 py-1 font-jmono text-[10.5px] text-white/50">
              {host(p.externalUrl!)}
            </span>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/proiecte/${p.key}/cover.jpg`}
              alt={p.title}
              loading={i < 2 ? "eager" : "lazy"}
              onError={(e) => {
                const img = e.currentTarget;
                if (p.wpImages?.[0] && !img.dataset.fb) {
                  img.dataset.fb = "1";
                  img.src = p.wpImages[0];
                }
              }}
              className="showcase-img absolute inset-0 h-full w-full object-cover object-top"
            />
          </div>
        </div>
      </div>

      {/* descrierea */}
      <div className="lg:w-[38%]">
        <span className="font-jmono text-[11px] tracking-[0.25em] text-brand-magenta">
          {String(i + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")}
        </span>
        <p className="mt-4 font-jmono text-[10px] uppercase tracking-[0.25em] text-white/55">
          {p.categories.slice(0, 3).join(" · ")}
        </p>
        <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-text sm:text-[1.9rem]">
          {p.title.split(" — ")[0]}
        </h3>
        {p.excerpt ? (
          <p className="mt-4 line-clamp-4 text-[14.5px] leading-relaxed text-white/70">{p.excerpt}</p>
        ) : null}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href={`/proiecte/${p.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-6 py-3 text-[13.5px] font-semibold text-white shadow-glow-orange transition hover:scale-[1.04]"
          >
            Detalii proiect
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <a
            href={p.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-[13px] font-medium text-white/80 transition hover:border-brand-orange/60 hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Vezi site-ul live
          </a>
        </div>
      </div>
    </article>
  );
}

export function FeaturedShowcase() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion("auto");

  useGSAP(
    () => {
      registerGsap();
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        if (reduced || !track.current || !section.current) return;
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (st) => {
              if (bar.current) bar.current.style.transform = `scaleX(${st.progress})`;
            },
          },
        });
        // parallax fin pe capturi, legat de mișcarea orizontală
        gsap.utils.toArray<HTMLElement>(".showcase-img").forEach((img) => {
          gsap.fromTo(
            img,
            { scale: 1.12, xPercent: 4 },
            {
              scale: 1.02,
              xPercent: -4,
              ease: "none",
              scrollTrigger: {
                trigger: img,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        });
      });
      return () => mm.revert();
    },
    { scope: section, dependencies: [reduced] }
  );

  return (
    <section ref={section} className="relative overflow-hidden bg-[#050507] lg:h-screen">
      <div className="container-app pt-16 lg:absolute lg:inset-x-0 lg:top-0 lg:z-10 lg:pt-40">
        <div className="flex items-center gap-4">
          <span className="font-jmono text-[11px] tracking-[0.2em] text-brand-magenta">02</span>
          <span className="h-px w-14 bg-gradient-to-r from-brand-magenta to-brand-purple" />
          <span className="font-jmono text-[10px] uppercase tracking-[0.3em] text-white/60">
            Proiecte recomandate
          </span>
        </div>
      </div>

      <div
        ref={track}
        className="flex flex-col gap-20 px-4 py-16 sm:px-8 lg:h-full lg:flex-row lg:items-center lg:gap-[10vw] lg:px-[11vw] lg:py-0 lg:pt-16"
      >
        {featured.map((p, i) => (
          <Slide key={p.key} p={p} i={i} />
        ))}
      </div>

      {/* bara de progres */}
      <div className="absolute inset-x-0 bottom-10 hidden lg:block">
        <div className="container-app">
          <div className="h-px w-full bg-white/10">
            <div ref={bar} className="h-px origin-left scale-x-0 bg-gradient-to-r from-brand-orange via-brand-magenta to-brand-purple" />
          </div>
        </div>
      </div>
    </section>
  );
}
