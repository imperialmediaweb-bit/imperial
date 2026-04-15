"use client";

import { motion } from "framer-motion";
import { Code2, Layers, Palette, Smartphone } from "lucide-react";

// Compoziție de mockup-uri "browser + device + cards" pentru hero.
// Înlocuiește orb-ul SVG cu ceva mult mai vizual.
export function HeroVisual() {
  return (
    <div className="relative aspect-square w-full max-w-[520px]">
      {/* Glow base */}
      <div className="absolute inset-8 animate-pulse-slow rounded-[3rem] bg-gradient-to-br from-brand-orange/40 via-brand-purple/30 to-transparent blur-3xl" />

      {/* Mockup browser principal — floating, tilted */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -5 }}
        animate={{ opacity: 1, y: 0, rotate: -6 }}
        transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
        className="absolute left-[8%] top-[14%] w-[78%] origin-bottom-left"
        style={{ animation: "float 8s ease-in-out infinite" }}
      >
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-bg-card shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8),0_0_60px_rgba(255,107,26,0.3)]">
          {/* Browser bar */}
          <div className="flex items-center gap-2 border-b border-bg-border bg-bg-soft px-3 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            <span className="ml-2 flex-1 rounded-md bg-bg/60 px-2 py-1 text-[10px] text-text-subtle">
              imperial-media.ro
            </span>
          </div>
          {/* Browser content — abstract layout */}
          <div className="relative aspect-[16/10] bg-gradient-to-br from-brand-orange via-brand-purple to-bg p-4">
            {/* Hero block */}
            <div className="h-3 w-1/2 rounded bg-white/40" />
            <div className="mt-2 h-2 w-2/3 rounded bg-white/25" />
            <div className="mt-1.5 h-2 w-1/2 rounded bg-white/20" />
            {/* CTA */}
            <div className="mt-3 inline-block rounded-md bg-white px-3 py-1 text-[8px] font-bold text-bg">
              CLICK
            </div>
            {/* Bottom 3-col grid */}
            <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-1.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-md border border-white/15 bg-white/5 p-1.5">
                  <div className="h-1 w-2/3 rounded bg-white/40" />
                  <div className="mt-1 h-0.5 w-full rounded bg-white/20" />
                  <div className="mt-0.5 h-0.5 w-3/4 rounded bg-white/15" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mockup mobile floating */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: 12 }}
        animate={{ opacity: 1, y: 0, rotate: 8 }}
        transition={{ duration: 0.9, delay: 0.55, ease: "easeOut" }}
        className="absolute right-[2%] top-[28%] w-[26%]"
        style={{ animation: "float 7s ease-in-out 1s infinite" }}
      >
        <div className="overflow-hidden rounded-[1.4rem] border-2 border-white/10 bg-bg-card p-1 shadow-[0_25px_50px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(123,47,247,0.4)]">
          <div className="rounded-[1rem] bg-gradient-to-br from-brand-purple via-brand-orange to-bg p-2.5">
            <div className="h-1 w-1/3 rounded bg-white/40" />
            <div className="mt-1.5 h-1 w-2/3 rounded bg-white/25" />
            <div className="mt-3 grid grid-cols-2 gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-md bg-white/10" />
              ))}
            </div>
            <div className="mt-2 h-1 w-1/2 rounded bg-white/30" />
          </div>
        </div>
      </motion.div>

      {/* Floating card 1 — Code snippet */}
      <motion.div
        initial={{ opacity: 0, x: -30, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="glass absolute left-[-4%] top-[8%] z-20 flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-glow-purple"
        style={{ animation: "float 6s ease-in-out 0.5s infinite" }}
      >
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-purple to-indigo-600 text-white">
          <Code2 className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-subtle">
            Cod curat
          </p>
          <p className="text-xs font-bold text-text">Next.js + React</p>
        </div>
      </motion.div>

      {/* Floating card 2 — Design palette */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, delay: 0.85 }}
        className="glass absolute right-[-2%] top-[6%] z-20 flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-glow-orange"
        style={{ animation: "float 7s ease-in-out 1.2s infinite" }}
      >
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-orange to-pink-500 text-white">
          <Palette className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-subtle">
            Design
          </p>
          <p className="text-xs font-bold text-text">100% custom</p>
        </div>
      </motion.div>

      {/* Floating card 3 — Mobile responsive */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1 }}
        className="glass absolute bottom-[6%] left-[6%] z-20 flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5"
        style={{ animation: "float 8s ease-in-out 0.8s infinite" }}
      >
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
          <Smartphone className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-subtle">
            Responsive
          </p>
          <p className="text-xs font-bold text-text">Mobile first</p>
        </div>
      </motion.div>

      {/* Floating card 4 — Layers */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, delay: 1.15 }}
        className="glass absolute bottom-[12%] right-[2%] z-20 flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-glow-purple"
        style={{ animation: "float 6.5s ease-in-out 0.3s infinite" }}
      >
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-orange via-brand-purple to-indigo-600 text-white">
          <Layers className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-subtle">
            UI / UX
          </p>
          <p className="text-xs font-bold text-text">Premium</p>
        </div>
      </motion.div>

      {/* Decorative dots scattered */}
      {[
        { top: "20%", left: "92%", size: "h-2 w-2", color: "bg-brand-orange" },
        { top: "45%", left: "-5%", size: "h-1.5 w-1.5", color: "bg-brand-purple" },
        { top: "75%", left: "95%", size: "h-2 w-2", color: "bg-brand-glow" },
        { top: "5%", left: "60%", size: "h-1 w-1", color: "bg-white" },
      ].map((d, i) => (
        <span
          key={i}
          className={`absolute ${d.size} rounded-full ${d.color} shadow-[0_0_12px_3px_currentColor] opacity-80`}
          style={{ top: d.top, left: d.left }}
        />
      ))}
    </div>
  );
}
