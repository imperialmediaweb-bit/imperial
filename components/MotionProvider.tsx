"use client";

// Animațiile framer-motion respectă setarea de sistem „reduce motion”:
// cine a cerut mai puțină mișcare vede conținutul direct, fără tranziții.
import { MotionConfig } from "framer-motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
