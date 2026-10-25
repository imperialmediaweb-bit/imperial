"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { Info } from "@/lib/addon-info";

export function InfoModal({ info, onClose }: { info: Info | null; onClose: () => void }) {
  // randat în <body>: un părinte cu backdrop-filter ar prinde altfel poziția fixed
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!info) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [info, onClose]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {info ? (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-modal-title"
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0d0b12] p-6 shadow-2xl sm:p-7"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Închide"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-white/10 text-white/60 transition hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 id="info-modal-title" className="pr-10 font-display text-lg font-bold text-text">
              {info.title}
            </h3>
            <div className="mt-4 space-y-3 text-[14px] leading-relaxed text-white/75">
              {info.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-orange-gradient py-2.5 text-[14px] font-semibold text-white"
            >
              Am înțeles
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
