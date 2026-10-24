'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

/**
 * Registers GSAP plugins exactly once (idempotent, client-only).
 * Call it at module scope in any component that uses ScrollTrigger.
 */
export function registerGsap(): typeof gsap {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power3.out', duration: 0.8 });
    registered = true;
  }
  return gsap;
}

export { gsap, ScrollTrigger };
export { useGSAP } from '@gsap/react';
