export interface WebGLSupport {
  supported: boolean;
  /** 2 when WebGL2 is available, 1 for WebGL1, 0 when unsupported. */
  version: 0 | 1 | 2;
  /** Unmasked renderer string when available (helps pick performance modes). */
  renderer?: string;
}

let cached: WebGLSupport | null = null;

/** Feature-detects WebGL once per page. Safe to call during SSR (returns unsupported). */
export function detectWebGL(): WebGLSupport {
  if (cached) return cached;
  if (typeof document === 'undefined') return { supported: false, version: 0 };
  try {
    const canvas = document.createElement('canvas');
    const gl2 = canvas.getContext('webgl2');
    const gl = gl2 ?? canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl');
    if (
      !gl ||
      !(
        gl instanceof WebGLRenderingContext ||
        (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext)
      )
    ) {
      cached = { supported: false, version: 0 };
      return cached;
    }
    const ctx = gl as WebGLRenderingContext;
    const debug = ctx.getExtension('WEBGL_debug_renderer_info');
    const renderer = debug
      ? (ctx.getParameter(debug.UNMASKED_RENDERER_WEBGL) as string)
      : undefined;
    cached = { supported: true, version: gl2 ? 2 : 1, renderer };
    ctx.getExtension('WEBGL_lose_context')?.loseContext();
    return cached;
  } catch {
    cached = { supported: false, version: 0 };
    return cached;
  }
}

/** Reset the memoised result (tests only). */
export function _resetWebGLDetection(): void {
  cached = null;
}
