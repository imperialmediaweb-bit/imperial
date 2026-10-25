'use client';

import { useEffect, useState } from 'react';

const EVENTS = ['pointermove', 'pointerdown', 'scroll', 'wheel', 'keydown', 'touchstart'] as const;

/**
 * `true` imediat ce pagina s-a afișat și browserul e liber (sau la prima interacțiune, dacă vine mai devreme).
 * Pentru efectele grele (3D, particule): nu blochează prima afișare, dar pornesc singure, fără să aștepte
 * ca vizitatorul să miște mouse-ul.
 */
export function useAfterInteraction(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (ready) return;
    const go = () => setReady(true);
    EVENTS.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const start = () => (w.requestIdleCallback ? w.requestIdleCallback(go, { timeout: 1200 }) : window.setTimeout(go, 300));
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => {
      EVENTS.forEach((e) => window.removeEventListener(e, go));
      window.removeEventListener('load', start);
    };
  }, [ready]);
  return ready;
}
