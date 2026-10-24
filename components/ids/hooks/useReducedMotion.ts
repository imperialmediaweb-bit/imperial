'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}
const getSnapshot = () =>
  typeof window === 'undefined' ? false : window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

export type ReducedMotionMode = 'auto' | 'always' | 'never';

/**
 * Returns `true` when motion should be reduced.
 * - `auto` (default): follows the OS `prefers-reduced-motion` setting.
 * - `always`: forces the reduced experience (useful for previews/tests).
 * - `never`: ignores the OS setting (only when the user has opted in elsewhere).
 */
export function useReducedMotion(mode: ReducedMotionMode = 'auto'): boolean {
  const prefers = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (mode === 'always') return true;
  if (mode === 'never') return false;
  return prefers;
}
