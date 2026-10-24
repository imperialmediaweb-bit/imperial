/**
 * Named easings used across the design system. The keys are what component
 * props accept (`ease="cinematic"`); the values are GSAP ease strings.
 */
export const easings = {
  imperial: 'expo.out',
  cinematic: 'power4.inOut',
  snap: 'power3.out',
  soft: 'power2.out',
  elastic: 'elastic.out(1, 0.6)',
  back: 'back.out(1.4)',
  linear: 'none',
} as const;

export type EasingName = keyof typeof easings;

/** Resolve an easing name or raw GSAP ease string. */
export function resolveEase(
  ease: EasingName | (string & {}) | undefined,
  fallback: EasingName = 'imperial',
): string {
  if (!ease) return easings[fallback];
  return (easings as Record<string, string>)[ease] ?? ease;
}
