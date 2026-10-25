"use client";

/**
 * Pe desktop (lg+, cu WebGL): EXPERIENȚA 3D completă.
 * Pe mobil / fără WebGL / reduced motion: varianta clasică ușoară.
 * Experiența 3D (și codul ei) se încarcă abia după prima interacțiune — până atunci
 * vizitatorul vede instant varianta clasică.
 */

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAfterInteraction } from "../ids/hooks";

const Experience = dynamic(() => import("./Experience").then((m) => m.Experience), { ssr: false });

export function HomeSwitch({ fallback }: { fallback: React.ReactNode }) {
  const [mode, setMode] = useState<"fallback" | "experience">("fallback");
  const interacted = useAfterInteraction();

  useEffect(() => {
    if (!interacted) return;
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let webgl = false;
    try {
      const c = document.createElement("canvas");
      webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webgl = false;
    }
    if (desktop && webgl && !reduced) setMode("experience");
  }, [interacted]);

  if (mode === "experience") return <Experience />;
  return <>{fallback}</>;
}
