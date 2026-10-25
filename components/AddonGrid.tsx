"use client";

import { useState } from "react";
import { Info as InfoIcon } from "lucide-react";
import { InfoModal } from "./InfoModal";
import { ADDON_INFO, type Info } from "@/lib/addon-info";
import { SITE_START_ADDONS, addonPriceLabel } from "@/lib/site-start-addons";

// Lista de opțiuni de pe /site-start, cu fereastră de explicații pentru fiecare.
export function AddonGrid() {
  const [info, setInfo] = useState<Info | null>(null);
  return (
    <>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {SITE_START_ADDONS.map((a) => {
          const i = ADDON_INFO[a.key] ?? ADDON_INFO[a.key.replace(/-.*/, "")];
          return (
            <div key={a.key} className="flex items-start justify-between gap-3 rounded-2xl border border-bg-border bg-bg-card/60 p-4">
              <div className="min-w-0">
                <p className="text-sm font-bold text-text">{a.name}</p>
                <p className="mt-0.5 text-xs text-text-muted">{a.desc}</p>
                {i ? (
                  <button
                    onClick={() => setInfo(i)}
                    className="mt-2 inline-flex items-center gap-1 text-[11.5px] font-medium text-brand-magenta hover:underline"
                  >
                    <InfoIcon className="h-3.5 w-3.5" />
                    Ce înseamnă?
                  </button>
                ) : null}
              </div>
              <span className="flex-shrink-0 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand-orange">
                {addonPriceLabel(a)}
              </span>
            </div>
          );
        })}
      </div>
      <InfoModal info={info} onClose={() => setInfo(null)} />
    </>
  );
}
