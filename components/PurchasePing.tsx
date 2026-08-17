"use client";

// Evenimentul Purchase pentru Meta Pixel — tras O SINGURĂ DATĂ per raport,
// când clientul ajunge pe raportul deblocat imediat după plată (?platit=1).
// Garda din localStorage previne dublarea la refresh.

import { useEffect } from "react";
import { fbTrack } from "@/lib/fbq";

export function PurchasePing({ token, value }: { token: string; value: number }) {
  useEffect(() => {
    try {
      const key = `fb-purchase-${token}`;
      if (localStorage.getItem(key)) return;
      localStorage.setItem(key, "1");
    } catch {}
    fbTrack("Purchase", { value, currency: "RON" });
  }, [token, value]);
  return null;
}
