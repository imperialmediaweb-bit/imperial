"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Globe,
  BarChart3,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  TrendingDown,
  Zap,
  Stethoscope,
  MapPin,
  ShieldCheck,
  Store,
  Laptop,
  Shuffle,
  Lock,
  Newspaper,
  Hash,
  Facebook,
  Radar,
} from "lucide-react";
import type { ServiceReport, ServiceReportPreview } from "@/app/api/service-report/route";
import { ServiceReportView, ScoreCircle } from "@/components/ServiceReportView";
import { ShineCard } from "@/components/effects/ShineCard";
import { Magnetic } from "@/components/effects/MagneticButton";
import { getPartner } from "@/lib/partners";
import { LOCATIONS } from "@/lib/locations";

const BASE_PRICE = 299;
const REF_PRICE = 249;

const INDUSTRIES = [
  "Restaurant / HoReCa", "Salon / Beauty", "Cabinet medical / Stomatologie",
  "Construcții / Instalații", "Magazin / Comerț", "Imobiliare",
  "Auto / Service", "Avocat / Juridic", "Notariat", "Contabilitate",
  "Fitness / Sport", "Educație / Cursuri", "IT / Servicii online", "Altceva",
];

const BUSINESS_TYPES = [
  { key: "local", label: "Local (punct fizic)", icon: Store },
  { key: "online", label: "Online", icon: Laptop },
  { key: "ambele", label: "Ambele", icon: Shuffle },
];

const CLIENTS_OPTS = ["Sub 20 / lună", "20-50 / lună", "50-100 / lună", "Peste 100 / lună"];
const VALUE_OPTS = ["Sub 50€", "50-200€", "200-500€", "Peste 500€"];
const EMPLOYEE_OPTS = ["Doar eu", "2-5", "6-15", "Peste 15"];

// Fluxul „scanner live" — spectacolul e procesul: omul VEDE sistemul lucrând.
const SCAN_FEED = [
  { icon: "🛰️", text: "Conectare la Google Maps..." },
  { icon: "📍", text: "Profilul firmei localizat — citesc ratingul și recenziile" },
  { icon: "🏛️", text: "Interogare ANAF: registrul TVA + codul CAEN" },
  { icon: "📊", text: "Descarc bilanțul publicat: cifră de afaceri, profit, angajați" },
  { icon: "🥊", text: "Scanez competitorii din zona ta, unul câte unul" },
  { icon: "⭐", text: "Compar recenziile tale cu ale fiecărui competitor" },
  { icon: "🌐", text: "Testez site-ul: viteză, HTTPS, adaptare pe mobil" },
  { icon: "🤖", text: "Întreb AI-ul: te recomandă când caută lumea în domeniul tău?" },
  { icon: "📱", text: "Verific pagina de Facebook și prezența socială" },
  { icon: "🧮", text: "Calculez clienții și banii pierduți lunar" },
  { icon: "📈", text: "Construiesc proiecția: investiție vs. câștig pe 3 și 12 luni" },
  { icon: "🎯", text: "Scriu planul de acțiune pe 12 luni, pe domeniul tău" },
  { icon: "✨", text: "Finisez raportul..." },
];

// Chips: intră în cascadă, pop la selecție
const chipGroupV = { hidden: {}, show: { transition: { staggerChildren: 0.045 } } };
const chipItemV = {
  hidden: { opacity: 0, y: 12, scale: 0.92 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 400, damping: 24 } },
};

// Secțiunile din raportul complet, arătate blurat până la deblocare.
const LOCKED_SECTIONS = [
  { emoji: "⭐", title: "Recomandarea #1", desc: "Dacă faci un singur lucru luna asta — care e și de ce" },
  { emoji: "📋", title: "Diagnosticul complet", desc: "7-9 arii analizate în detaliu, specifice domeniului tău" },
  { emoji: "🏆", title: "Tu vs competiția", desc: "Comparație directă cu firmele reale din zona ta" },
  { emoji: "📈", title: "Proiecția economică", desc: "Cât investești vs cât scoți — pe 3 luni și pe 12 luni" },
  { emoji: "👑", title: "Ce fac liderii din domeniul tău", desc: "Practicile care îi țin în top + ce-ți lipsește ție" },
  { emoji: "📱", title: "Planul tău de social media", desc: "Câte reeluri, postări și story-uri pe săptămână + idei concrete pentru domeniul tău" },
  { emoji: "📆", title: "Prima ta lună, săptămână cu săptămână", desc: "Plan de execuție detaliat: ce faci concret în fiecare din cele 4 săptămâni" },
  { emoji: "🎯", title: "Planul de acțiune pe 12 luni", desc: "4 faze concrete, cu investiție și impact per fază" },
];

export default function ServicePage() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1); // direcția tranziției între pași (1 înainte, -1 înapoi)
  const [form, setForm] = useState({
    businessType: "", companyName: "", city: "", industry: "", cui: "", placeId: "", zone: "",
    website: "", facebook: "",
    monthlyClients: "", avgValue: "", employees: "",
    mainProblem: "",
  });
  const [suggestions, setSuggestions] = useState<Array<{ placeId: string; name: string; detail: string }>>([]);
  const [showSug, setShowSug] = useState(false);
  const sugTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [preview, setPreview] = useState<{ token: string; data: ServiceReportPreview } | null>(null);
  const [unlockedReport, setUnlockedReport] = useState<ServiceReport | null>(null);
  const [unlocking, setUnlocking] = useState(false);
  const [unlockEmail, setUnlockEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  // Autocomplete oraș (lista locală) + verificare CUI live la ANAF
  const [citySugs, setCitySugs] = useState<string[]>([]);
  const [showCitySugs, setShowCitySugs] = useState(false);
  const [firmCheck, setFirmCheck] = useState<{ name: string; active: boolean; verified: boolean } | "notfound" | null>(null);
  const cuiTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Căutare firmă după nume (openapi.ro): scrii „legio" → apar firmele → alegi → CUI completat
  const [firmSugs, setFirmSugs] = useState<Array<{ name: string; cui: string; city: string }>>([]);
  const [showFirmSugs, setShowFirmSugs] = useState(false);
  const firmSugTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Anti-cursă: răspunsurile vechi de la /api/firm-suggest nu mai redeschid dropdown-ul
  const firmReqId = useRef(0);
  // Poze cu vitrina/produsele — comprimate în browser, analizate de AI în raport
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  async function addPhotos(list: FileList | null) {
    if (!list) return;
    setPhotoError(null);
    const room = 3 - photos.length;
    const picked = Array.from(list).slice(0, Math.max(0, room));
    const compressed: string[] = [];
    for (const file of picked) {
      if (!file.type.startsWith("image/")) continue;
      try {
        const bitmap = await createImageBitmap(file);
        const scale = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(bitmap.width * scale);
        canvas.height = Math.round(bitmap.height * scale);
        canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        compressed.push(canvas.toDataURL("image/jpeg", 0.8));
      } catch {}
    }
    if (compressed.length) setPhotos((p) => [...p, ...compressed].slice(0, 3));
    else if (picked.length > 0) {
      // ex: HEIC de pe iPhone — browserele nu-l pot decoda; fără feedback ar părea că butonul e stricat
      setPhotoError("Formatul pozei nu e suportat de browser (probabil HEIC). Exportă-le ca JPG sau fă un screenshot pozei și urcă-l.");
    }
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  function onCityChange(v: string) {
    set("city", v);
    const q = v.trim().toLowerCase();
    if (q.length < 2) {
      setCitySugs([]);
      setShowCitySugs(false);
      return;
    }
    const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    const nq = normalize(q);
    const matches = LOCATIONS.filter((l) => normalize(l.name).startsWith(nq))
      .sort((a, b) => b.population - a.population)
      .slice(0, 6)
      .map((l) => l.name);
    setCitySugs(matches);
    setShowCitySugs(matches.length > 0);
  }

  function onCuiChange(v: string) {
    set("cui", v);
    setFirmCheck(null);
    setFirmSugs([]);
    setShowFirmSugs(false);
    firmReqId.current += 1;
    if (cuiTimer.current) clearTimeout(cuiTimer.current);
    if (firmSugTimer.current) clearTimeout(firmSugTimer.current);
    const trimmed = v.trim();
    const digits = trimmed.replace(/\D/g, "");
    const hasLetters = /[a-zA-ZăâîșțĂÂÎȘȚ]{2}/.test(trimmed.replace(/^ro/i, ""));
    if (!hasLetters && digits.length >= 5) {
      // A scris un CUI → verificare live la ANAF (cu gardă anti-răspuns-învechit)
      const reqId = firmReqId.current;
      cuiTimer.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/firm-lookup?cui=${digits}`);
          const data = await res.json();
          if (reqId !== firmReqId.current) return;
          setFirmCheck(data?.found ? { name: data.name, active: !!data.active, verified: true } : "notfound");
        } catch {
          if (reqId === firmReqId.current) setFirmCheck(null);
        }
      }, 500);
    } else if (hasLetters && trimmed.length >= 3) {
      // A scris numele firmei → căutăm în registrul firmelor și îi arătăm lista
      const reqId = firmReqId.current;
      firmSugTimer.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/firm-suggest?q=${encodeURIComponent(trimmed)}`);
          const data = await res.json();
          if (reqId !== firmReqId.current) return; // răspuns învechit — între timp a tastat/ales altceva
          setFirmSugs(data.suggestions ?? []);
          setShowFirmSugs((data.suggestions ?? []).length > 0);
        } catch {
          if (reqId === firmReqId.current) setFirmSugs([]);
        }
      }, 450);
    }
  }

  function pickFirm(s: { name: string; cui: string; city: string }) {
    set("cui", s.cui);
    setFirmSugs([]);
    setShowFirmSugs(false);
    setFirmCheck(null);
    firmReqId.current += 1;
    const reqId = firmReqId.current;
    // Confirmare ANAF pe CUI-ul ales; dacă ANAF nu răspunde, afișăm doar completarea — fără pretenția „verificată"
    fetch(`/api/firm-lookup?cui=${s.cui}`)
      .then((r) => r.json())
      .then((d) => {
        if (reqId !== firmReqId.current) return;
        setFirmCheck(
          d?.found
            ? { name: d.name, active: !!d.active, verified: true }
            : { name: s.name, active: true, verified: false }
        );
      })
      .catch(() => {
        if (reqId === firmReqId.current) setFirmCheck({ name: s.name, active: true, verified: false });
      });
  }
  const reportRef = useRef<HTMLDivElement>(null);
  // Reduceri din URL: ?partener=bizzclub (partener) sau ?ref=cod (recomandare client)
  const [promo, setPromo] = useState<{ kind: "partner" | "ref"; label: string; price: number; partner?: string; ref?: string } | null>(null);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const partner = getPartner(sp.get("partener"));
    const refRaw = String(sp.get("ref") ?? "").toLowerCase();
    if (partner) {
      setPromo({ kind: "partner", label: partner.label, price: partner.priceRon, partner: partner.code });
    } else if (/^[a-z0-9]{4,16}$/.test(refRaw)) {
      setPromo({ kind: "ref", label: "recomandare", price: REF_PRICE, ref: refRaw });
    }
  }, []);

  const price = promo?.price ?? BASE_PRICE;

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  // Autocomplete Google Maps pe numele afacerii
  function onNameChange(v: string) {
    setForm((f) => ({ ...f, companyName: v, placeId: "" }));
    if (sugTimer.current) clearTimeout(sugTimer.current);
    if (v.trim().length < 3) {
      setSuggestions([]);
      setShowSug(false);
      return;
    }
    sugTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/place-suggest?q=${encodeURIComponent(v.trim())}&city=${encodeURIComponent(form.city.trim())}`
        );
        const data = await res.json();
        setSuggestions(data.suggestions ?? []);
        setShowSug((data.suggestions ?? []).length > 0);
      } catch {
        setSuggestions([]);
      }
    }, 400);
  }

  function pickSuggestion(s: { placeId: string; name: string; detail: string }) {
    setForm((f) => ({ ...f, companyName: s.name, placeId: s.placeId }));
    setSuggestions([]);
    setShowSug(false);
  }

  useEffect(() => () => {
    if (sugTimer.current) clearTimeout(sugTimer.current);
    if (cuiTimer.current) clearTimeout(cuiTimer.current);
    if (firmSugTimer.current) clearTimeout(firmSugTimer.current);
  }, []);

  // Formularul se ține minte singur (localStorage) — o eroare sau un refresh
  // nu te mai pune NICIODATĂ să completezi de la capăt.
  const formRestored = useRef(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("service-form-v1");
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && typeof saved === "object") setForm((f) => ({ ...f, ...saved }));
      }
    } catch {}
    formRestored.current = true;
  }, []);
  useEffect(() => {
    if (!formRestored.current) return;
    try {
      localStorage.setItem("service-form-v1", JSON.stringify(form));
    } catch {}
  }, [form]);

  const canNext =
    step === 0 ? form.businessType && form.companyName.trim() && form.city.trim() && form.industry
    : step === 1 ? true
    : step === 2 ? form.monthlyClients && form.avgValue
    : true;

  // Răspunsurile se citesc DEFENSIV: un proxy care taie conexiunea trimite HTML,
  // nu JSON — nu mai afișăm niciodată „Unexpected token <" utilizatorului.
  async function safeJson(res: Response): Promise<any | null> {
    try {
      return JSON.parse(await res.text());
    } catch {
      return null;
    }
  }

  async function generate() {
    setLoading(true);
    setError(null);
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, SCAN_FEED.length - 1));
    }, 1400);
    const finish = (data: any) => {
      if (data.locked) {
        setPreview({ token: data.token, data: data.preview });
      } else {
        setUnlockedReport(data.report);
      }
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
    };
    try {
      const res = await fetch("/api/service-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, photos, partner: promo?.partner, ref: promo?.ref }),
      });
      const data = await safeJson(res);
      if (!res.ok || !data) {
        throw new Error(data?.error || "Serverul n-a putut răspunde — datele tale sunt salvate în formular, mai apasă o dată.");
      }
      if (data.pending && data.token) {
        // Generarea rulează pe fundal — întrebăm la 3 secunde „e gata?" (max ~8 minute;
        // cu modelul mare + pasul de control al calității, un raport durează 3-5 minute)
        for (let i = 0; i < 160; i++) {
          await new Promise((r) => setTimeout(r, 3000));
          let sdata: any = null;
          try {
            const sres = await fetch(`/api/service-report-status?token=${data.token}`);
            sdata = await safeJson(sres);
          } catch {
            continue; // hop de rețea — încercăm iar
          }
          if (!sdata || sdata.pending) continue;
          if (sdata.error) throw new Error(sdata.error);
          finish(sdata);
          return;
        }
        throw new Error("Generarea durează neobișnuit de mult — reîncearcă în câteva minute.");
      }
      finish(data);
    } catch (e: any) {
      setError(e?.message ?? "Eroare. Încearcă din nou.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }

  async function unlock() {
    if (!preview) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(unlockEmail.trim())) {
      setError("Lasă un email valid — pe el primești raportul și accesul în cont.");
      return;
    }
    setUnlocking(true);
    setError(null);
    try {
      const res = await fetch("/api/service-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: preview.token, email: unlockEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error(data?.error || "Nu am putut porni plata.");
      window.location.href = data.url;
    } catch (e: any) {
      setError(e?.message ?? "Eroare. Încearcă din nou.");
      setUnlocking(false);
    }
  }

  const STEPS = [
    { icon: Building2, label: "Firma ta", title: "Să facem cunoștință cu firma ta", desc: "Doar datele de bază — restul le aflăm noi, din scanări reale" },
    { icon: Globe, label: "Online", title: "Prezența ta online", desc: "Site și Facebook — dacă nu le ai, fix asta analizăm" },
    { icon: BarChart3, label: "Cifre", title: "Cifrele afacerii tale", desc: "Estimări rapide — din ele calculăm cât pierzi lunar" },
    { icon: MessageSquare, label: "Problema", title: "Care e problema ta principală?", desc: "Cu cuvintele tale — consultantul pornește de aici" },
  ];

  // Tranziția între pași — direcțională, cu blur cinematic
  const stepAnim = {
    initial: { opacity: 0, x: 48 * dir, filter: "blur(8px)" },
    animate: { opacity: 1, x: 0, filter: "blur(0px)" },
    exit: { opacity: 0, x: -48 * dir, filter: "blur(8px)" },
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const },
  };

  // Chips premium — selecția e gradient cu glow, hover-ul se ridică ușor
  const chipCls = (sel: boolean) =>
    `rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition-all duration-200 ${
      sel
        ? "border-transparent bg-orange-gradient text-white shadow-glow-orange"
        : "border-bg-border bg-bg-soft/60 text-text-muted hover:-translate-y-0.5 hover:border-brand-orange/60 hover:text-text"
    }`;

  const showForm = !preview && !unlockedReport;

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-hero-gradient" />

      {/* HERO — scurt și aerisit */}
      <section className="container-app pb-6 pt-14 text-center sm:pt-20">
        <span className="chip"><Stethoscope className="h-3 w-3" /> Coach-ul cu date al afacerii tale</span>
        <h1 className="section-title mt-4 mx-auto max-w-3xl">
          Radiografia <span className="text-gradient">afacerii tale</span>
        </h1>
        <p className="section-subtitle mx-auto max-w-xl text-center">
          Raport pe date reale — Google, ANAF, competiția, testul AI — cu planul tău de creștere pe 12 luni.
          Plus <b className="text-text">articolul tău de promovare, publicat în 50 de ziare online</b> (pachetul de 300€, inclus).
        </p>

        {/* Prețul, compact */}
        <div className="mx-auto mt-5 flex flex-wrap items-center justify-center gap-2">
          {price === 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/40 bg-green-500/10 px-5 py-2 text-sm font-bold text-green-300">
              ⭐ Invitație VIP — raportul complet e gratuit pentru tine
            </span>
          ) : (
            <>
              <span className="inline-flex items-baseline gap-2 rounded-full border border-brand-orange/40 bg-brand-orange/10 px-5 py-2">
                {promo && <span className="text-sm font-semibold text-text-subtle line-through">{BASE_PRICE} lei</span>}
                <span className="font-display text-lg font-extrabold text-brand-orangeLight">{price} lei</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-bg-border bg-bg-soft/60 px-4 py-2 text-xs font-semibold text-text-muted">
                🗞️ + promovare în 50 de ziare online (300€), cadou
              </span>
              {promo && promo.kind === "partner" && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/40 bg-green-500/10 px-4 py-2 text-xs font-bold text-green-300">
                  🎟️ Reducere {promo.label}
                </span>
              )}
              {promo && promo.kind === "ref" && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/40 bg-green-500/10 px-4 py-2 text-xs font-bold text-green-300">
                  🎟️ Reducere prin recomandare
                </span>
              )}
            </>
          )}
        </div>

        {/* Dovada + garanția — omoară frica de „cumpăr pe nevăzute" */}
        <div className="mx-auto mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-text-subtle">
          <a href="/service/exemplu" className="font-semibold text-text-muted underline decoration-brand-orange/60 underline-offset-4 hover:text-brand-orange">
            📄 Vezi un raport-exemplu complet, înainte să dai un leu
          </a>
          {price !== 0 && (
            <span>🛡️ Garanție: nu afli minim 3 lucruri noi despre firma ta? Banii înapoi.</span>
          )}
          {price !== 0 && <span>💰 Suma se scade din orice pachet, în 30 de zile</span>}
        </div>

        {/* Parteneriatul — DOAR pentru linkul Bizz Club, nu pentru VIP */}
        {promo?.partner === "bizzclub" && (
          <p className="mx-auto mt-4 max-w-lg text-xs leading-relaxed text-text-subtle">
            🤝 <a href="https://botosani.bizz.club" target="_blank" rel="noopener noreferrer" className="font-semibold text-text-muted hover:text-brand-orange">Bizz Club Botoșani</a> —
            partenerul nostru: la club crești prin comunitate și mentorat, aici îți ținem scorul cu date.
          </p>
        )}
      </section>

      {/* FORM */}
      {showForm && (
        <section className="relative container-app overflow-hidden pb-20 pt-4">
          {/* Glow discret, ținut în spatele cardului — nu peste text */}
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[520px] w-[720px] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-orange/10 blur-[130px]" />
          <div aria-hidden className="pointer-events-none absolute left-[15%] bottom-0 -z-10 h-[320px] w-[420px] rounded-full bg-brand-purple/15 blur-[120px]" />
          <div className="gradient-border relative mx-auto max-w-2xl rounded-3xl">
            <ShineCard className="rounded-3xl bg-bg-card bg-card-gradient p-6 shadow-card sm:p-9">
            {/* Progres */}
            <div className="mb-8">
              <div className="flex items-center">
                {STEPS.map((s, i) => (
                  <div key={s.label} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
                    <div className={`flex items-center gap-2.5 ${i <= step ? "text-text" : "text-text-subtle"}`}>
                      <span
                        className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-2xl transition-all duration-300 ${
                          i < step
                            ? "bg-orange-gradient text-white shadow-glow-orange"
                            : i === step
                              ? "border-2 border-brand-orange bg-brand-orange/10 text-brand-orange shadow-[0_0_24px_rgba(255,107,26,0.3)]"
                              : "border border-bg-border bg-bg-soft/60 text-text-subtle"
                        }`}
                      >
                        {i < step ? <CheckCircle2 className="h-5 w-5" /> : <s.icon className="h-[18px] w-[18px]" />}
                      </span>
                      <span className={`hidden text-xs font-semibold sm:block ${i === step ? "text-text" : ""}`}>{s.label}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="mx-2.5 h-[3px] flex-1 overflow-hidden rounded-full bg-bg-soft/80 sm:mx-4">
                        <div
                          className={`h-full rounded-full bg-orange-gradient transition-all duration-500 ease-out ${i < step ? "w-full" : "w-0"}`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 border-l-2 border-brand-orange/50 pl-4">
                <p className="font-display text-lg font-bold text-text sm:text-xl">{STEPS[step].title}</p>
                <p className="mt-0.5 text-xs text-text-subtle">{STEPS[step].desc}</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="s0" {...stepAnim} className="grid gap-4">
                  <div>
                    <label className="label">Cum lucrezi cu clienții? *</label>
                    <motion.div variants={chipGroupV} initial="hidden" animate="show" className="flex flex-wrap gap-2">
                      {BUSINESS_TYPES.map((t) => (
                        <motion.button key={t.key} variants={chipItemV} whileTap={{ scale: 0.95 }} type="button" onClick={() => set("businessType", t.key)}
                          className={`inline-flex items-center gap-2 ${chipCls(form.businessType === t.key)}`}>
                          <t.icon className="h-4 w-4" /> {t.label}
                        </motion.button>
                      ))}
                    </motion.div>
                  </div>
                  <div className="relative">
                    <label className="label">Orașul *</label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
                      <input className="input rounded-2xl py-3.5 pl-11 text-[15px]" placeholder="ex: Botoșani" value={form.city}
                        onChange={(e) => onCityChange(e.target.value)}
                        onBlur={() => setTimeout(() => setShowCitySugs(false), 200)}
                        onFocus={() => citySugs.length > 0 && setShowCitySugs(true)} />
                    </div>
                    {showCitySugs && citySugs.length > 0 && (
                      <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-bg-border bg-bg-card shadow-card">
                        {citySugs.map((c) => (
                          <button key={c} type="button" onClick={() => { set("city", c); setCitySugs([]); setShowCitySugs(false); }}
                            className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm font-medium text-text transition hover:bg-brand-orange/10">
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-brand-orange" /> {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {form.businessType !== "online" && (
                    <div>
                      <label className="label">Zona / cartierul punctului de lucru (opțional)</label>
                      <div className="relative">
                        <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
                        <input className="input rounded-2xl py-3.5 pl-11 text-[15px]" placeholder="ex: Centrul Vechi, lângă Piața Mare, cartier Grivița"
                          value={form.zone} onChange={(e) => set("zone", e.target.value)} />
                      </div>
                      <p className="mt-1.5 text-[11px] leading-snug text-text-subtle">
                        Analizăm potențialul zonei: ce clientelă trece pe acolo, cum profiți de vad, ce parteneriate ai la doi pași.
                      </p>
                    </div>
                  )}
                  {form.businessType !== "online" && (
                    <div>
                      <label className="label">Poze cu vitrina / produsele / localul (opțional, max 3)</label>
                      <input ref={photoInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addPhotos(e.target.files)} />
                      <div className="flex flex-wrap items-center gap-2">
                        {photos.map((p, i) => (
                          <div key={i} className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p} alt={`poza ${i + 1}`} className="h-16 w-16 rounded-xl border border-bg-border object-cover" />
                            <button type="button" onClick={() => setPhotos((arr) => arr.filter((_, j) => j !== i))}
                              className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">✕</button>
                          </div>
                        ))}
                        {photos.length < 3 && (
                          <button type="button" onClick={() => photoInputRef.current?.click()}
                            className="grid h-16 w-16 place-items-center rounded-xl border-2 border-dashed border-bg-border text-2xl text-text-subtle transition hover:border-brand-orange/60 hover:text-brand-orange">
                            📷
                          </button>
                        )}
                      </div>
                      {photoError && <p className="mt-1.5 text-[11px] font-semibold text-yellow-400">⚠️ {photoError}</p>}
                      <p className="mt-1.5 text-[11px] leading-snug text-text-subtle">
                        AI-ul le analizează în raport: cum arată vitrina pentru un trecător, expunerea mărfii și ce ofertă merită pusă pe geam.
                      </p>
                    </div>
                  )}
                  <div className="relative">
                    <label className="label">Numele afacerii *</label>
                    <div className="relative">
                      <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
                      <input className="input rounded-2xl py-3.5 pl-11 text-[15px]" placeholder="ex: Pizzeria La Mario" value={form.companyName}
                        onChange={(e) => onNameChange(e.target.value)}
                        onBlur={() => setTimeout(() => setShowSug(false), 200)}
                        onFocus={() => suggestions.length > 0 && setShowSug(true)} />
                    </div>
                    {form.placeId ? (
                      <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-green-400">
                        <CheckCircle2 className="h-3 w-3" /> Găsit pe Google Maps — analizăm profilul exact
                      </p>
                    ) : (
                      <p className="mt-1.5 text-[11px] leading-snug text-text-subtle">
                        Scrie numele sub care te știu clienții și alege-l din listă. Dacă brandul diferă de firma de la ANAF, scrie brandul.
                      </p>
                    )}
                    {showSug && suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-bg-border bg-bg-card shadow-card">
                        {suggestions.map((s) => (
                          <button key={s.placeId} type="button" onClick={() => pickSuggestion(s)}
                            className="flex w-full items-start gap-2 px-3.5 py-2.5 text-left transition hover:bg-brand-orange/10">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-brand-orange" />
                            <span>
                              <span className="block text-sm font-semibold text-text">{s.name}</span>
                              {s.detail && <span className="block text-[11px] text-text-subtle">{s.detail}</span>}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="label">Domeniul de activitate *</label>
                    <motion.div variants={chipGroupV} initial="hidden" animate="show" className="flex flex-wrap gap-2">
                      {INDUSTRIES.map((ind) => (
                        <motion.button key={ind} variants={chipItemV} whileTap={{ scale: 0.95 }} type="button" onClick={() => set("industry", ind)} className={chipCls(form.industry === ind)}>
                          {ind}
                        </motion.button>
                      ))}
                    </motion.div>
                  </div>
                  <div className="relative">
                    <label className="label">CUI sau numele firmei (opțional)</label>
                    <div className="relative">
                      <Hash className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
                      <input className="input rounded-2xl py-3.5 pl-11 text-[15px]" placeholder="ex: 12345678 sau scrie numele firmei și alege din listă"
                        value={form.cui} onChange={(e) => onCuiChange(e.target.value)}
                        onBlur={() => setTimeout(() => setShowFirmSugs(false), 200)}
                        onFocus={() => firmSugs.length > 0 && setShowFirmSugs(true)} />
                    </div>
                    {showFirmSugs && firmSugs.length > 0 && (
                      <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-bg-border bg-bg-card shadow-card">
                        {firmSugs.map((s) => (
                          <button key={s.cui} type="button" onClick={() => pickFirm(s)}
                            className="flex w-full items-start gap-2 px-3.5 py-2.5 text-left transition hover:bg-brand-orange/10">
                            <Building2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-brand-orange" />
                            <span>
                              <span className="block text-sm font-semibold text-text">{s.name}</span>
                              <span className="block text-[11px] text-text-subtle">CUI {s.cui}{s.city ? ` · ${s.city}` : ""}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                    {firmCheck && firmCheck !== "notfound" && (
                      <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-green-400">
                        <CheckCircle2 className="h-3 w-3" /> {firmCheck.name} — {firmCheck.verified ? (firmCheck.active ? "activă, verificată la ANAF" : "⚠️ INACTIVĂ la ANAF") : "CUI completat din registrul firmelor"}
                      </p>
                    )}
                    {firmCheck === "notfound" && (
                      <p className="mt-1.5 text-[11px] font-semibold text-yellow-400">
                        CUI-ul nu a fost găsit la ANAF — verifică cifrele.
                      </p>
                    )}
                    {!firmCheck && (
                      <p className="mt-1.5 text-[11px] leading-snug text-text-subtle">
                        Scrie CUI-ul sau numele firmei și alege-o din listă — verificăm firma la ANAF: cifră de afaceri, profit, CAEN, TVA. Raportul se calculează pe cifrele tale oficiale.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="s1" {...stepAnim} className="grid gap-4">
                  <div>
                    <label className="label">Site-ul tău (dacă ai)</label>
                    <div className="relative">
                      <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
                      <input className="input rounded-2xl py-3.5 pl-11 text-[15px]" placeholder="ex: firma-mea.ro — sau lasă gol" value={form.website} onChange={(e) => set("website", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="label">Pagina de Facebook (dacă ai)</label>
                    <div className="relative">
                      <Facebook className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
                      <input className="input rounded-2xl py-3.5 pl-11 text-[15px]" placeholder="link sau nume — sau lasă gol" value={form.facebook} onChange={(e) => set("facebook", e.target.value)} />
                    </div>
                  </div>
                  <p className="text-xs text-text-subtle">Nu ai? Nicio problemă — exact asta analizăm.</p>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" {...stepAnim} className="grid gap-5">
                  <div>
                    <label className="label">Câți clienți ai pe lună? *</label>
                    <motion.div variants={chipGroupV} initial="hidden" animate="show" className="flex flex-wrap gap-2">
                      {CLIENTS_OPTS.map((o) => (
                        <motion.button key={o} variants={chipItemV} whileTap={{ scale: 0.95 }} type="button" onClick={() => set("monthlyClients", o)} className={chipCls(form.monthlyClients === o)}>
                          {o}
                        </motion.button>
                      ))}
                    </motion.div>
                  </div>
                  <div>
                    <label className="label">Cât valorează în medie un client? *</label>
                    <motion.div variants={chipGroupV} initial="hidden" animate="show" className="flex flex-wrap gap-2">
                      {VALUE_OPTS.map((o) => (
                        <motion.button key={o} variants={chipItemV} whileTap={{ scale: 0.95 }} type="button" onClick={() => set("avgValue", o)} className={chipCls(form.avgValue === o)}>
                          {o}
                        </motion.button>
                      ))}
                    </motion.div>
                  </div>
                  <div>
                    <label className="label">Câți angajați?</label>
                    <motion.div variants={chipGroupV} initial="hidden" animate="show" className="flex flex-wrap gap-2">
                      {EMPLOYEE_OPTS.map((o) => (
                        <motion.button key={o} variants={chipItemV} whileTap={{ scale: 0.95 }} type="button" onClick={() => set("employees", o)} className={chipCls(form.employees === o)}>
                          {o}
                        </motion.button>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" {...stepAnim} className="grid gap-4">
                  <div>
                    <label className="label">Care e cea mai mare problemă a afacerii tale acum?</label>
                    <textarea className="input min-h-[130px] resize-y rounded-2xl py-3.5 text-[15px]" maxLength={1000}
                      placeholder="ex: Am clienți puțini, concurența e peste tot, nu mă găsește nimeni online..."
                      value={form.mainProblem} onChange={(e) => set("mainProblem", e.target.value)} />
                    <p className="mt-2 text-[11px] text-text-subtle">
                      💡 Cu cât scrii mai sincer, cu atât raportul lovește mai precis.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">{error}</p>
            )}

            {/* Scanner live — spectacolul e procesul */}
            {loading && (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                className="mt-6 overflow-hidden rounded-2xl border border-brand-orange/30 bg-[#0a0512]/80 p-5 sm:p-6">
                {/* Antena radar */}
                <div className="flex items-center gap-4">
                  <span className="relative grid h-12 w-12 flex-shrink-0 place-items-center">
                    <span className="absolute inset-0 animate-ping rounded-full bg-brand-orange/25" />
                    <span className="absolute inset-1.5 animate-ping rounded-full bg-brand-orange/15 [animation-delay:300ms]" />
                    <span className="relative grid h-9 w-9 place-items-center rounded-full bg-orange-gradient shadow-glow-orange">
                      <Radar className="h-5 w-5 text-white" />
                    </span>
                  </span>
                  <div className="flex-1">
                    <p className="font-display text-base font-extrabold text-text sm:text-lg">
                      Scanez afacerea ta în timp real
                    </p>
                    <p className="text-[11px] text-text-subtle">
                      Google · ANAF · competiție · site · social — date reale, nu presupuneri
                    </p>
                  </div>
                  <span className="font-display text-2xl font-extrabold text-brand-orange tabular-nums">
                    {Math.min(97, Math.round(((loadingStep + 1) / SCAN_FEED.length) * 100))}%
                  </span>
                </div>

                {/* Feed-ul de scanare */}
                <div className="mt-5 max-h-64 space-y-2 overflow-hidden font-mono text-[13px]">
                  {SCAN_FEED.slice(0, loadingStep + 1).slice(-7).map((line, idx, arr) => {
                    const isLast = idx === arr.length - 1;
                    return (
                      <motion.div key={line.text} initial={{ opacity: 0, x: -12 }} animate={{ opacity: isLast ? 1 : 0.55, x: 0 }}
                        className="flex items-center gap-2.5">
                        {isLast ? (
                          <Loader2 className="h-3.5 w-3.5 flex-shrink-0 animate-spin text-brand-orange" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-green-400" />
                        )}
                        <span className={isLast ? "text-text" : "text-text-muted"}>
                          {line.icon} {line.text}
                          {isLast && <span className="ml-1 inline-block h-3.5 w-[7px] animate-pulse bg-brand-orange align-middle" />}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Bara de progres */}
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-bg-soft/60">
                  <motion.div className="h-full rounded-full bg-orange-gradient"
                    animate={{ width: `${Math.min(97, ((loadingStep + 1) / SCAN_FEED.length) * 100)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }} />
                </div>
              </motion.div>
            )}

            {/* Nav */}
            {!loading && (
              <div className="mt-8 flex items-center justify-between border-t border-bg-border/60 pt-6">
                {step > 0 ? (
                  <button type="button" onClick={() => { setDir(-1); setStep((s) => s - 1); }} className="btn-ghost">
                    <ArrowLeft className="h-4 w-4" /> Înapoi
                  </button>
                ) : <span className="text-xs text-text-subtle">Pasul {step + 1} din 4</span>}

                {step < 3 ? (
                  <Magnetic>
                    <button type="button" disabled={!canNext} onClick={() => { setDir(1); setStep((s) => s + 1); }} className="btn-primary">
                      Continuă <ArrowRight className="h-4 w-4" />
                    </button>
                  </Magnetic>
                ) : (
                  <Magnetic>
                    <button type="button" onClick={generate} className="btn-primary pulse-ring">
                      <Zap className="h-4 w-4" /> Generează raportul
                    </button>
                  </Magnetic>
                )}
              </div>
            )}
            </ShineCard>
          </div>
        </section>
      )}

      {/* ═══════════ PREVIEW + DEBLOCARE ═══════════ */}
      {preview && (
        <section ref={reportRef} className="container-app pb-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl space-y-5">

            {/* Header raport */}
            <div className="rounded-3xl border border-bg-border bg-bg-card bg-card-gradient p-6 shadow-card sm:p-8">
              <p className="text-xs uppercase tracking-wider text-text-subtle">Raport de consultanță · Imperial Media</p>
              <h2 className="mt-1 font-display text-2xl font-extrabold text-text sm:text-3xl">{preview.data.companyName}</h2>
              <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row">
                <ScoreCircle score={preview.data.overallScore} />
                <div className="flex-1">
                  <p className="text-sm leading-relaxed text-text-muted">{preview.data.summary}</p>
                </div>
              </div>
            </div>

            {/* ANAF compact */}
            {preview.data.anafData?.found && (
              <div className="rounded-3xl border border-green-500/25 bg-green-500/5 p-5">
                <p className="inline-flex items-center gap-1.5 text-sm font-bold text-green-300">
                  <ShieldCheck className="h-4 w-4" /> Firmă verificată la ANAF
                </p>
                <p className="mt-1.5 text-sm text-text">
                  {preview.data.anafData.legalName}
                  {" · "}
                  <span className={preview.data.anafData.active ? "text-green-400" : "font-bold text-red-400"}>
                    {preview.data.anafData.active ? "activă" : "INACTIVĂ"}
                  </span>
                  {preview.data.anafData.turnover != null && (
                    <span className="text-text-muted">
                      {" · "}CA {preview.data.anafData.balanceYear}: <b className="text-text">{preview.data.anafData.turnover.toLocaleString("ro-RO")} lei</b>
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Pierderi */}
            {preview.data.lostClientsPerMonth > 0 && (
              <div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-6 text-center">
                <TrendingDown className="mx-auto h-6 w-6 text-red-400" />
                <p className="mt-2 font-display text-3xl font-extrabold text-red-400">
                  ~{preview.data.lostClientsPerMonth} clienți pierduți / lună
                </p>
                {preview.data.lostRevenuePerMonth > 0 && (
                  <p className="mt-1 text-lg font-bold text-text">
                    ≈ {preview.data.lostRevenuePerMonth.toLocaleString("ro-RO")}€ venituri pierdute lunar
                  </p>
                )}
                <p className="mt-2 text-xs text-text-subtle">Estimare bazată pe cifrele tale + datele reale scanate</p>
              </div>
            )}

            {/* Secțiunile blocate (blur pe machetă, datele reale rămân pe server) */}
            <div className="relative">
              <div className="pointer-events-none select-none space-y-4 blur-[6px]" aria-hidden>
                {LOCKED_SECTIONS.map((s) => (
                  <div key={s.title} className="rounded-3xl border border-bg-border bg-bg-card/60 p-6">
                    <p className="font-display text-lg font-bold text-text">{s.emoji} {s.title}</p>
                    <p className="mt-1 text-sm text-text-muted">{s.desc}</p>
                    <div className="mt-4 space-y-2">
                      <div className="h-3 w-11/12 rounded bg-bg-soft" />
                      <div className="h-3 w-9/12 rounded bg-bg-soft" />
                      <div className="h-3 w-10/12 rounded bg-bg-soft" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Card de deblocare peste blur */}
              <div className="absolute inset-0 flex items-start justify-center pt-10">
                <div className="mx-4 w-full max-w-lg rounded-3xl border-2 border-brand-orange/60 bg-bg-card p-6 text-center shadow-card sm:p-8">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-orange-gradient">
                    <Lock className="h-5 w-5 text-white" />
                  </span>
                  <h3 className="mt-4 font-display text-xl font-extrabold text-text sm:text-2xl">
                    Deblochează raportul complet
                  </h3>
                  <p className="mt-3 font-display text-3xl font-extrabold text-brand-orange">
                    {promo && <span className="mr-2 text-lg font-bold text-text-subtle line-through">{BASE_PRICE} lei</span>}
                    {price === 0 ? "GRATUIT" : `${price} lei`}
                  </p>
                  <ul className="mx-auto mt-4 max-w-sm space-y-2 text-left text-sm text-text-muted">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                      Raportul complet: diagnostic, competiție, proiecție economică, plan 12 luni
                    </li>
                    <li className="flex items-start gap-2">
                      <Newspaper className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" />
                      <span><b className="text-text">CADOU: articol de promovare despre afacerea ta, publicat în toate cele 50 de ziare online din rețeaua Media Expres</b> — pachetul de publicare de 300€, inclus</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                      Cei {price} lei se scad integral din orice pachet comanzi în 30 de zile
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                      <span><b className="text-text">Garanție:</b> dacă nu afli minim 3 lucruri concrete pe care nu le știai despre afacerea ta — banii înapoi, fără întrebări</span>
                    </li>
                  </ul>
                  <div className="relative mt-5">
                    <input
                      type="email"
                      required
                      value={unlockEmail}
                      onChange={(e) => setUnlockEmail(e.target.value)}
                      placeholder="emailul tău — aici primești raportul"
                      className="input rounded-2xl py-3 text-center text-sm"
                    />
                  </div>
                  <button type="button" onClick={unlock} disabled={unlocking} className="btn-primary mt-3 w-full justify-center">
                    {unlocking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                    {unlocking ? "Se încarcă..." : price === 0 ? "Deblochează raportul — GRATUIT" : `Deblochează raportul — ${price} lei`}
                  </button>
                  <p className="mt-3 text-[11px] text-text-subtle">Plată securizată cu cardul · raportul rămâne al tău pe link permanent</p>
                  <p className="mt-1.5 text-[10px] leading-snug text-text-subtle">
                    Apăsând butonul ești de acord cu <a href="/termeni" target="_blank" className="underline">Termenii</a> și cu livrarea imediată
                    a conținutului digital (renunți la dreptul de retragere de 14 zile).
                  </p>
                  {error && (
                    <p className="mt-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs text-red-300">{error}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ═══════════ RAPORT COMPLET (mod fără DB) ═══════════ */}
      {unlockedReport && (
        <section ref={reportRef} className="container-app pb-20">
          <ServiceReportView report={unlockedReport} />
        </section>
      )}
    </main>
  );
}
