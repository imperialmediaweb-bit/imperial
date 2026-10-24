export type QualityPreset = 'auto' | 'low' | 'medium' | 'high';
export type ResolvedQuality = Exclude<QualityPreset, 'auto'>;

export interface QualitySettings {
  level: ResolvedQuality;
  /** Device pixel ratio range passed to the canvas. */
  dpr: [number, number];
  /** Multiplier for particle counts and other scalable workloads (0–1). */
  budget: number;
  antialias: boolean;
}

/** Heuristic for mobile/low-power devices. Runs on the client only. */
export function resolveQuality(preset: QualityPreset = 'auto'): QualitySettings {
  let level: ResolvedQuality = preset === 'auto' ? 'high' : preset;
  if (preset === 'auto' && typeof navigator !== 'undefined') {
    const coarse =
      typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    if (coarse || cores <= 4 || memory <= 4) level = 'medium';
    if ((coarse && cores <= 4) || memory <= 2) level = 'low';
  }
  switch (level) {
    case 'low':
      return { level, dpr: [1, 1], budget: 0.35, antialias: false };
    case 'medium':
      return { level, dpr: [1, 1.5], budget: 0.6, antialias: true };
    default:
      return { level, dpr: [1, 2], budget: 1, antialias: true };
  }
}
