"use client";

// Efectele decorative globale (scânteile de la cursor, firul de lumină, bara de progres)
// pornesc după prima interacțiune — pagina se afișează și răspunde instant.

import dynamic from "next/dynamic";
import { useAfterInteraction } from "../ids/hooks";

const ScrollProgress = dynamic(() => import("./ScrollProgress").then((m) => m.ScrollProgress), { ssr: false });
const LightThread = dynamic(() => import("./LightThread").then((m) => m.LightThread), { ssr: false });
const SparkTrail = dynamic(() => import("./SparkTrail").then((m) => m.SparkTrail), { ssr: false });

export function DeferredEffects() {
  const ready = useAfterInteraction();
  if (!ready) return null;
  return (
    <>
      <ScrollProgress />
      <LightThread />
      <SparkTrail />
    </>
  );
}
