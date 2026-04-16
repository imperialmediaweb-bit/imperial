"use client";

import { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  STATUS_COLORS,
  STATUS_LABELS,
  type BriefStatus,
} from "@/lib/brief-types";

type Props = {
  id: number;
  status: BriefStatus;
  onChange?: (newStatus: BriefStatus) => void;
  compact?: boolean;
};

const ALL: BriefStatus[] = ["nou", "ofertat", "client", "refuzat"];

export function StatusPill({ id, status, onChange, compact }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState<BriefStatus>(status);

  async function setStatus(s: BriefStatus) {
    if (s === current || loading) {
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: s }),
      });
      if (!res.ok) throw new Error("Eroare actualizare.");
      setCurrent(s);
      onChange?.(s);
    } catch {
      // rollback silent
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  const colorClass = STATUS_COLORS[current];

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen((o) => !o);
        }}
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${colorClass} ${
          compact ? "" : "min-w-[90px]"
        }`}
      >
        {loading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : null}
        {STATUS_LABELS[current]}
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          />
          <div className="absolute left-0 top-full z-40 mt-1 min-w-[140px] overflow-hidden rounded-lg border border-bg-border bg-bg-card shadow-card">
            {ALL.map((s) => (
              <button
                key={s}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setStatus(s);
                }}
                className={`block w-full px-3 py-2 text-left text-xs transition hover:bg-white/5 ${
                  s === current ? "font-bold text-brand-orange" : "text-text-muted"
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
