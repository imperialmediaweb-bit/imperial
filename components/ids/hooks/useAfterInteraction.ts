'use client';

import { useEffect, useState } from 'react';

const EVENTS = ['pointermove', 'pointerdown', 'scroll', 'wheel', 'keydown', 'touchstart'] as const;

/**
 * `true` după prima interacțiune a vizitatorului (mișcare de mouse, scroll, tastă, atingere).
 * Pentru efectele grele (3D, particule): pagina se afișează instant, iar efectul pornește
 * imediat ce omul face ceva — nu mai blochează încărcarea.
 */
export function useAfterInteraction(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (ready) return;
    const go = () => setReady(true);
    EVENTS.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
    return () => EVENTS.forEach((e) => window.removeEventListener(e, go));
  }, [ready]);
  return ready;
}
