'use client';

import { useSyncExternalStore } from 'react';

function subscribe(cb: () => void) {
  if (typeof document === 'undefined') return () => {};
  document.addEventListener('visibilitychange', cb);
  return () => document.removeEventListener('visibilitychange', cb);
}
const getSnapshot = () =>
  typeof document === 'undefined' ? true : document.visibilityState === 'visible';
const getServerSnapshot = () => true;

/** `true` while the tab is visible. Use it to pause autoplay and render loops. */
export function usePageVisibility(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
