'use client';

import { useCallback, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import type { ReducedMotionMode } from '../../hooks';
import {
  QUAD_VERTEX,
  Quad,
  ShaderProgram,
  getContext,
  loseContext,
} from '../core/FullscreenShader';
import { useShaderCanvas } from '../core/useShaderCanvas';

export type ReliefMaterial = 'plaster' | 'stone' | 'bronze' | 'gold' | 'obsidian';

export interface ReliefLightProps {
  /** Words carved into the surface (use "\n" for lines). Either `text` or `src`. */
  text?: string;
  /** Image whose brightness becomes the relief height. */
  src?: string;
  /** Accessible description; defaults to `text`. */
  alt?: string;
  material?: ReliefMaterial;
  /** Font for `text` (must be loaded on the page). Default the display serif. */
  fontFamily?: string;
  /** Font weight for `text`. Default 400. */
  fontWeight?: number | string;
  /** Relief depth (0.2–3). Default 1. */
  depth?: number;
  /** Softness of the carving (0.5–3). Default 1. */
  softness?: number;
  /** Carve into the surface instead of raising from it. Default false. */
  engraved?: boolean;
  /** Light follows the pointer; otherwise (and when idle) it orbits slowly. Default true. */
  interactive?: boolean;
  maxDpr?: number;
  reducedMotion?: ReducedMotionMode;
  fallback?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const reliefMaterials: Record<
  ReliefMaterial,
  { base: string; spec: string; shine: number; gloss: number; background: string }
> = {
  plaster: { base: '#ece6da', spec: '#ffffff', shine: 12, gloss: 0.35, background: '#d9d2c4' },
  stone: { base: '#a39e95', spec: '#e8e4dc', shine: 10, gloss: 0.3, background: '#6f6b64' },
  bronze: { base: '#8f5d2c', spec: '#ffd6a3', shine: 42, gloss: 1, background: '#3b2614' },
  gold: { base: '#c9a96e', spec: '#fff1c8', shine: 64, gloss: 1.1, background: '#4a3818' },
  obsidian: { base: '#1d1d24', spec: '#c4ccff', shine: 90, gloss: 1.2, background: '#0b0b0f' },
};

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uHeight;
  uniform vec2 uTexel;
  uniform vec2 uLight;
  uniform float uAspect;
  uniform float uDepth;
  uniform float uSign;
  uniform vec3 uBase;
  uniform vec3 uSpec;
  uniform float uShine;
  uniform float uGloss;
  float H(vec2 uv) { return texture2D(uHeight, uv).r * uSign; }
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    vec2 e = uTexel * 1.5;
    float h = H(vUv);
    float hl = H(vUv - vec2(e.x, 0.0));
    float hr = H(vUv + vec2(e.x, 0.0));
    float hb = H(vUv - vec2(0.0, e.y));
    float ht = H(vUv + vec2(0.0, e.y));
    vec3 n = normalize(vec3((hl - hr) * uDepth, (hb - ht) * uDepth, 1.0));
    vec3 pos = vec3(vUv.x * uAspect, vUv.y, h * 0.05);
    // A low, raking light: flat ground stays calm, the carved edges catch it.
    vec3 lp = vec3(uLight.x * uAspect, uLight.y, 0.16);
    vec3 L = normalize(lp - pos);
    float d = length(lp.xy - pos.xy);
    float atten = 1.0 / (1.0 + d * d * 0.9);
    float diff = max(dot(n, L), 0.0);
    vec3 Hv = normalize(L + vec3(0.0, 0.0, 1.0));
    float spec = pow(max(dot(n, Hv), 0.0), uShine);
    // Cavities collect shadow, ridges catch light
    float cav = clamp((hl + hr + hb + ht - 4.0 * h) * 5.0 * uSign, -0.35, 0.35);
    float raised = 0.78 + 0.22 * clamp(h * uSign, 0.0, 1.0);
    float grain = 0.97 + 0.06 * hash(floor(vUv / uTexel));
    float slope = clamp(length(n.xy) * 4.0, 0.0, 1.0);
    vec3 col = uBase * (0.2 + diff * 0.95 * atten) * raised * grain
      + uSpec * spec * atten * (0.12 + 0.75 * slope) * uGloss;
    col *= 1.0 - cav;
    gl_FragColor = vec4(col, 1.0);
  }
`;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  const v = parseInt(full, 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}

/** Draws the height map (white = high) for text or an image, softened with a blur. */
function drawHeightMap(
  w: number,
  h: number,
  source: { text?: string; image?: HTMLImageElement },
  font: { family: string; weight: number | string },
  softness: number,
): HTMLCanvasElement {
  const raw = document.createElement('canvas');
  raw.width = w;
  raw.height = h;
  const ctx = raw.getContext('2d');
  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  const octx = out.getContext('2d');
  if (!ctx || !octx) return out;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);
  let blur = Math.max(2, Math.min(w, h) * 0.012 * softness);
  if (source.text) {
    const lines = source.text.split('\n');
    let size = (h * 0.7) / lines.length;
    ctx.font = `${font.weight} ${size}px ${font.family}`;
    const widest = Math.max(...lines.map((l) => ctx.measureText(l).width), 1);
    size = Math.min(size, (size * w * 0.86) / widest);
    ctx.font = `${font.weight} ${size}px ${font.family}`;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const lh = size * 1.02;
    lines.forEach((line, i) => {
      ctx.fillText(line, w / 2, h / 2 + (i - (lines.length - 1) / 2) * lh);
    });
    blur = Math.max(2, size * 0.03 * softness);
  } else if (source.image) {
    const img = source.image;
    const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const iw = img.naturalWidth * s;
    const ih = img.naturalHeight * s;
    ctx.filter = 'grayscale(1)';
    ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
    ctx.filter = 'none';
  }
  // A crisp top over a soft shoulder gives a carved bevel rather than a blurry blob.
  octx.globalCompositeOperation = 'lighter';
  octx.globalAlpha = 0.6;
  octx.filter = `blur(${blur}px)`;
  octx.drawImage(raw, 0, 0);
  octx.globalAlpha = 0.4;
  octx.filter = `blur(${Math.max(1, blur * 0.25)}px)`;
  octx.drawImage(raw, 0, 0);
  octx.filter = 'none';
  octx.globalAlpha = 1;
  octx.globalCompositeOperation = 'source-over';
  return out;
}

/**
 * WebGL — Relief Light
 *
 * Text or an image becomes a carved bas-relief (plaster, stone, bronze, gold or obsidian)
 * lit by a raking light that follows the cursor, then orbits slowly when the pointer is
 * away. The height map is drawn on a 2D canvas and softened; the shader derives normals,
 * cavity shadow and specular highlights from it. Inspired by Immersive Garden's sculpted
 * navigation; cheap enough for a hero (one texture, one pass).
 */
export function ReliefLight({
  text,
  src,
  alt,
  material = 'plaster',
  fontFamily = '"Instrument Serif", Georgia, serif',
  fontWeight = 400,
  depth = 1,
  softness = 1,
  engraved = false,
  interactive = true,
  maxDpr = 1.5,
  reducedMotion = 'auto',
  fallback,
  className,
  style,
}: ReliefLightProps) {
  const params = useRef({ material, depth, engraved, interactive, reduced: false });
  const pointer = useRef({ x: 0.3, y: 0.75, tx: 0.3, ty: 0.75, lastMove: -10 });
  const mat = reliefMaterials[material];

  const setup = useCallback(
    (canvas: HTMLCanvasElement, size: { width: number; height: number; dpr: number }) => {
      const gl = getContext(canvas, { alpha: false });
      if (!gl) return null;
      const quad = new Quad(gl);
      const program = new ShaderProgram(gl, QUAD_VERTEX, FRAG);
      const texture = gl.createTexture();
      if (!texture) return null;
      let planeW = size.width;
      let planeH = size.height;
      let cw = size.width * size.dpr;
      let ch = size.height * size.dpr;
      let texW = 1;
      let texH = 1;
      let ready = false;
      let disposed = false;
      let image: HTMLImageElement | undefined;

      const upload = () => {
        if (disposed) return;
        const scale = Math.min(1, 1400 / Math.max(planeW, planeH));
        texW = Math.max(2, Math.round(planeW * scale * 1.2));
        texH = Math.max(2, Math.round(planeH * scale * 1.2));
        const map = drawHeightMap(
          texW,
          texH,
          { text, image },
          { family: fontFamily, weight: fontWeight },
          softness,
        );
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, map);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        ready = true;
      };

      if (src) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          image = img;
          upload();
        };
        img.src = src;
      } else {
        upload();
        // Re-carve once web fonts have loaded so the letters use the real typeface.
        document.fonts?.ready.then(() => upload()).catch(() => {});
      }

      return {
        resize(width: number, height: number, dpr: number) {
          planeW = width;
          planeH = height;
          cw = width * dpr;
          ch = height * dpr;
          if (!src || image) upload();
        },
        frame(time: number, dt: number) {
          if (!ready) return;
          const p = params.current;
          const pt = pointer.current;
          const idle = !p.interactive || time - pt.lastMove > 2.5;
          if (p.reduced) {
            pt.x = 0.22;
            pt.y = 0.82;
          } else {
            const tx = idle ? 0.5 + Math.cos(time * 0.35) * 0.38 : pt.tx;
            const ty = idle ? 0.55 + Math.sin(time * 0.5) * 0.3 : pt.ty;
            const k = 1 - Math.pow(0.002, Math.min(dt || 0.016, 0.05));
            pt.x += (tx - pt.x) * k;
            pt.y += (ty - pt.y) * k;
          }
          const m = reliefMaterials[p.material];
          const base = hexToRgb(m.base);
          const spec = hexToRgb(m.spec);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          gl.viewport(0, 0, cw, ch);
          program.use();
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          program
            .i('uHeight', 0)
            .f2('uTexel', 1 / texW, 1 / texH)
            .f2('uLight', pt.x, pt.y)
            .f('uAspect', planeW / planeH)
            .f('uDepth', 9 * p.depth)
            .f('uSign', p.engraved ? -1 : 1)
            .f3('uBase', base[0], base[1], base[2])
            .f3('uSpec', spec[0], spec[1], spec[2])
            .f('uShine', m.shine)
            .f('uGloss', m.gloss);
          quad.draw();
        },
        dispose() {
          disposed = true;
          program.dispose();
          quad.dispose();
          gl.deleteTexture(texture);
          loseContext(gl);
        },
      };
    },
    [text, src, fontFamily, fontWeight, softness],
  );

  const { canvasRef, wrapperRef, supported, reduced } = useShaderCanvas({
    setup,
    maxDpr,
    reducedMotion,
  });
  useEffect(() => {
    params.current = { material, depth, engraved, interactive, reduced };
  });

  const label = alt ?? text?.replace(/\n/g, ' ') ?? '';
  const plain =
    fallback ??
    (text ? (
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          whiteSpace: 'pre-line',
          fontFamily,
          fontWeight,
          fontSize: 'clamp(3rem, 14vw, 12rem)',
          lineHeight: 1,
          color: mat.base,
          textShadow: `-2px -2px 2px rgb(255 255 255 / 0.25), 3px 4px 8px rgb(0 0 0 / 0.45)`,
        }}
      >
        {text}
      </div>
    ) : src ? (
      <img
        src={src}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'grayscale(1) contrast(1.2)',
        }}
      />
    ) : null);

  return (
    <div
      ref={wrapperRef}
      className={className}
      role="img"
      aria-label={label}
      data-imperial-webgl="relief-light"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: mat.background,
        ...style,
      }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const pt = pointer.current;
        pt.tx = (e.clientX - r.left) / r.width;
        pt.ty = 1 - (e.clientY - r.top) / r.height;
        pt.lastMove = performance.now() / 1000;
      }}
    >
      {supported === false ? plain : null}
      {supported ? (
        <canvas
          ref={canvasRef}
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />
      ) : null}
    </div>
  );
}
