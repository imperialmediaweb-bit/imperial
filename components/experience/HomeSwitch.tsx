"use client";

/**
 * Pe desktop (lg+, cu WebGL): EXPERIENȚA 3D completă.
 * Pe mobil / fără WebGL / reduced motion: varianta clasică ușoară.
 */

import { useEffect, useState } from "react";
import { Experience } from "./Experience";

export function HomeSwitch({ fallback }: { fallback: React.ReactNode }) {
  const [mode, setMode] = useState<"fallback" | "experience">("fallback");

  useEffect(() => {
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
  }, []);

  if (mode === "experience") return <Experience />;
  return <>{fallback}</>;
}
