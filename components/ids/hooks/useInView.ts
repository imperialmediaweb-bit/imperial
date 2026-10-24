'use client';

import { useEffect, useState, type RefObject } from 'react';

export interface UseInViewOptions {
  rootMargin?: string;
  threshold?: number | number[];
  /** Once true, stay true (default false). */
  once?: boolean;
}

/** Tracks whether an element is intersecting the viewport. SSR returns `false`. */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  options: UseInViewOptions = {},
): boolean {
  const { rootMargin = '0px', threshold = 0, once = false } = options;
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin, threshold, once]);

  return inView;
}
