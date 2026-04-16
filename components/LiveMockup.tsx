"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import type { BriefState, MoodBoard } from "@/lib/brief-schema";
import { MOODBOARDS } from "@/lib/brief-schema";

type Props = {
  brief: BriefState;
};

// Detectează mood board-ul din colorsPreference
function detectMoodboard(colorsPref: string): MoodBoard {
  const lower = colorsPref.toLowerCase();
  const match = MOODBOARDS.find((mb) => lower.includes(mb.name.toLowerCase()));
  if (match) return match;
  // Default mood board = Bold & Agresiv (brand Imperial Media)
  return MOODBOARDS[5];
}

// Detectează ce features sunt selectate ca "blocuri vizuale"
function getFeatureBlocks(features: string[]) {
  const has = (kw: string) =>
    features.some((f) => f.toLowerCase().includes(kw));
  return {
    hasBlog: has("blog"),
    hasShop: has("plăți") || has("magazin") || has("shop"),
    hasBooking: has("rezervări") || has("programări") || has("booking"),
    hasGallery: has("galerie") || has("portofoliu"),
    hasMap: has("hartă") || has("map"),
    hasSocial: has("social"),
    hasMembers: has("membri"),
    hasMulti: has("multilimbă") || has("multi"),
    hasContact: has("formular") || has("contact"),
  };
}

export function LiveMockup({ brief }: Props) {
  const mb = useMemo(() => detectMoodboard(brief.colorsPreference), [brief.colorsPreference]);
  const features = useMemo(() => getFeatureBlocks(brief.features), [brief.features]);
  const isShop = brief.selectedPackage === "shop";

  // Culorile din mood board — mapare:
  const [c1, c2, c3, c4] = mb.colors;
  // c1 = background principal, c2 = surface, c3 = accent, c4 = text/contrast
  const bg = c2 || c1;
  const accent = c3 || "#FF6B1A";
  const text = c4 || "#FFFFFF";
  const surface = c1 || "#111111";

  const industryLabel = brief.industry || "Site-ul tău";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-bg-border bg-bg-soft/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          <span className="h-2 w-2 rounded-full bg-yellow-400" />
          <span className="h-2 w-2 rounded-full bg-green-400" />
          <span className="ml-2 text-[10px] text-text-subtle">
            {industryLabel.toLowerCase().replace(/\s+/g, "-")}.ro
          </span>
        </div>
        <span className="text-[9px] uppercase tracking-wider text-text-subtle">
          {mb.emoji} {mb.name}
        </span>
      </div>

      <motion.div
        layout
        className="overflow-hidden rounded-lg shadow-xl"
        style={{ backgroundColor: surface }}
      >
        {/* ─── HEADER ─── */}
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{ backgroundColor: bg, borderBottom: `1px solid ${accent}22` }}
        >
          <div
            className="rounded px-2 py-0.5 text-[8px] font-bold"
            style={{ color: accent }}
          >
            {brief.name ? brief.name.split(" ")[0].toUpperCase() : "LOGO"}
          </div>
          <div className="flex gap-1.5">
            {["Acasă", "Despre", "Servicii", "Contact"].map((n, i) => (
              <span
                key={i}
                className="text-[7px]"
                style={{ color: text, opacity: 0.7 }}
              >
                {n}
              </span>
            ))}
          </div>
        </div>

        {/* ─── HERO ─── */}
        <div
          className="px-3 py-4"
          style={{
            background: `linear-gradient(135deg, ${bg} 0%, ${surface} 100%)`,
          }}
        >
          <div className="text-[10px] font-bold leading-tight" style={{ color: text }}>
            {isShop
              ? `Produse ${industryLabel} premium`
              : `${industryLabel} — servicii de calitate`}
          </div>
          <div
            className="mt-1 text-[7px] leading-tight"
            style={{ color: text, opacity: 0.6 }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-2 inline-block rounded px-2 py-0.5 text-[7px] font-semibold"
            style={{ backgroundColor: accent, color: surface }}
          >
            {isShop ? "Vezi produsele →" : "Contactează-ne →"}
          </motion.div>
        </div>

        {/* ─── FEATURE BLOCKS (grid) ─── */}
        <div className="grid grid-cols-3 gap-0.5 bg-black/20 p-0.5">
          <AnimatePresence>
            {isShop && (
              <MockBlock key="products" label="🛍 Produse" accent={accent} surface={bg} text={text} span={3} />
            )}
            {features.hasBooking && (
              <MockBlock key="booking" label="📅 Programări" accent={accent} surface={bg} text={text} />
            )}
            {features.hasShop && (
              <MockBlock key="shop" label="💳 Plăți" accent={accent} surface={bg} text={text} />
            )}
            {features.hasGallery && (
              <MockBlock key="gallery" label="🖼 Galerie" accent={accent} surface={bg} text={text} />
            )}
            {features.hasBlog && (
              <MockBlock key="blog" label="📝 Blog" accent={accent} surface={bg} text={text} />
            )}
            {features.hasMap && (
              <MockBlock key="map" label="📍 Hartă" accent={accent} surface={bg} text={text} />
            )}
            {features.hasSocial && (
              <MockBlock key="social" label="🔗 Social" accent={accent} surface={bg} text={text} />
            )}
            {features.hasMembers && (
              <MockBlock key="members" label="👤 Membri" accent={accent} surface={bg} text={text} />
            )}
            {features.hasMulti && (
              <MockBlock key="multi" label="🌍 Multi" accent={accent} surface={bg} text={text} />
            )}
            {features.hasContact && (
              <MockBlock key="contact" label="✉ Form" accent={accent} surface={bg} text={text} />
            )}
            {/* Placeholder-uri dacă sunt puține features */}
            {Object.values(features).filter(Boolean).length < 3 && (
              <>
                <MockBlock key="_1" label="✨ Servicii" accent={accent} surface={bg} text={text} />
                <MockBlock key="_2" label="👥 Echipă" accent={accent} surface={bg} text={text} />
                <MockBlock key="_3" label="📞 Contact" accent={accent} surface={bg} text={text} />
              </>
            )}
          </AnimatePresence>
        </div>

        {/* ─── FOOTER ─── */}
        <div
          className="flex items-center justify-between px-3 py-1.5"
          style={{ backgroundColor: bg, borderTop: `1px solid ${accent}22` }}
        >
          <span className="text-[7px]" style={{ color: text, opacity: 0.5 }}>
            © {industryLabel}
          </span>
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                className="h-1 w-1 rounded-full"
                style={{ backgroundColor: accent }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <p className="mt-2 flex items-center gap-1 text-[9px] text-text-subtle">
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-brand-orange" />
        Preview dinamic — se actualizează pe măsură ce brief-ul se umple
      </p>
    </div>
  );
}

function MockBlock({
  label,
  accent,
  surface,
  text,
  span = 1,
}: {
  label: string;
  accent: string;
  surface: string;
  text: string;
  span?: 1 | 2 | 3;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.25 }}
      className="flex aspect-square items-center justify-center text-[8px] font-semibold"
      style={{
        backgroundColor: surface,
        color: text,
        gridColumn: span > 1 ? `span ${span}` : undefined,
        aspectRatio: span > 1 ? "3 / 1" : undefined,
      }}
    >
      <span style={{ color: accent }}>●</span>
      <span className="ml-1 opacity-80">{label}</span>
    </motion.div>
  );
}
