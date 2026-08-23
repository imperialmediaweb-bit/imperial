"use client";

// Balonul plutitor din colț — CHAT AI DIRECT PE PAGINĂ (consultantul mega smart,
// cu voce), plus scurtături: Radiografia și WhatsApp pentru cine vrea om.
// Chatul se încarcă leneș (dynamic) — nu îngreunează nicio pagină până la click.

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { MessageCircle, X, Sparkles, Radar, ArrowLeft } from "lucide-react";
import { siteConfig } from "@/lib/site";

const BriefChat = dynamic(() => import("./BriefChat").then((m) => m.BriefChat), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center text-sm text-text-muted">
      Se încarcă consultantul...
    </div>
  ),
});

export function WhatsAppButton() {
  const [view, setView] = useState<"closed" | "menu" | "chat">("closed");
  const waText = encodeURIComponent(
    "Bună! Am văzut site-ul Imperial Media și aș vrea să discutăm despre un site."
  );

  return (
    <div className="fixed bottom-5 right-5 z-50 print:hidden">
      {/* ─── CHATUL — direct pe pagină, fără să pleci ─── */}
      {view === "chat" && (
        <div className="fixed bottom-24 right-3 left-3 top-16 overflow-hidden rounded-3xl border border-bg-border bg-bg-card shadow-card sm:left-auto sm:top-auto sm:h-[min(640px,calc(100vh-140px))] sm:w-[400px]">
          <div className="flex items-center justify-between border-b border-bg-border/60 bg-gradient-to-r from-brand-orange/15 to-brand-purple/10 px-4 py-3">
            <button type="button" onClick={() => setView("menu")} aria-label="Înapoi la meniu"
              className="grid h-8 w-8 place-items-center rounded-full text-text-muted transition hover:bg-white/10 hover:text-text">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="text-center">
              <p className="font-display text-sm font-bold text-text">Consultantul AI Imperial</p>
              <p className="text-[10px] text-text-subtle">Întreabă orice — scris sau cu vocea 🎙</p>
            </div>
            <button type="button" onClick={() => setView("closed")} aria-label="Închide chatul"
              className="grid h-8 w-8 place-items-center rounded-full text-text-muted transition hover:bg-white/10 hover:text-text">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="h-[calc(100%-53px)]">
            <BriefChat mode="consultanta" compact />
          </div>
        </div>
      )}

      {/* ─── MENIUL ─── */}
      {view === "menu" && (
        <div className="absolute bottom-16 right-0 w-[300px] overflow-hidden rounded-3xl border border-bg-border bg-bg-card shadow-card">
          <div className="border-b border-bg-border/60 bg-gradient-to-r from-brand-orange/15 to-brand-purple/10 px-5 py-3.5">
            <p className="font-display text-sm font-bold text-text">Cu ce te putem ajuta?</p>
            <p className="text-[11px] text-text-subtle">Răspuns pe loc, 24/7</p>
          </div>
          <div className="p-2.5">
            <button type="button" onClick={() => setView("chat")}
              className="flex w-full items-start gap-3 rounded-2xl p-3 text-left transition hover:bg-white/5">
              <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-orange-gradient text-white shadow-glow-orange">
                <Sparkles className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-bold text-text">Vorbește cu consultantul AI</span>
                <span className="block text-[11px] leading-snug text-text-muted">
                  Chiar aici, în chat — orice întrebare despre site-uri, prețuri, tehnic
                </span>
              </span>
            </button>
            <Link href="/service" onClick={() => setView("closed")}
              className="flex items-start gap-3 rounded-2xl p-3 transition hover:bg-white/5">
              <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-brand-purple/20 text-brand-purple">
                <Radar className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-bold text-text">Testează-ți firma</span>
                <span className="block text-[11px] leading-snug text-text-muted">
                  Radiografia Afacerii — scorul firmei tale în 5 minute
                </span>
              </span>
            </Link>
            <a href={`https://wa.me/${siteConfig.whatsapp}?text=${waText}`} target="_blank" rel="noopener noreferrer"
              onClick={() => setView("closed")}
              className="flex items-start gap-3 rounded-2xl p-3 transition hover:bg-white/5">
              <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-[#25D366]/20 text-[#25D366]">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </span>
              <span>
                <span className="block text-sm font-bold text-text">Scrie-ne pe WhatsApp</span>
                <span className="block text-[11px] leading-snug text-text-muted">
                  Preferi un om? Mesaj direct — poți trimite și poze
                </span>
              </span>
            </a>
          </div>
        </div>
      )}

      {/* ─── BUTONUL ─── */}
      <button type="button" onClick={() => setView((v) => (v === "closed" ? "menu" : "closed"))}
        aria-label={view === "closed" ? "Deschide meniul de contact" : "Închide"}
        className="group relative grid h-14 w-14 place-items-center rounded-full bg-orange-gradient text-white shadow-glow-orange transition-transform hover:scale-110">
        {view === "closed" && <span className="absolute inset-0 animate-ping rounded-full bg-brand-orange opacity-25" />}
        {view === "closed" ? <MessageCircle className="relative h-7 w-7" /> : <X className="relative h-6 w-6" />}
      </button>
    </div>
  );
}
