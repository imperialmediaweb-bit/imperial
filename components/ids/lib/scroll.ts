import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';

/** Shared ScrollTrigger-related props for scroll effects. */
export interface ScrollEffectProps {
  /** Custom scroll container (selector or element). Defaults to the window. */
  scroller?: string | Element;
  /** ScrollTrigger start position. */
  start?: string;
  /** ScrollTrigger end position. */
  end?: string;
  /** Show ScrollTrigger markers (development only). */
  markers?: boolean;
}

export type ScrollTriggerInstance = ScrollTriggerType;
