/**
 * Minimal WebGL helper for fullscreen fragment-shader effects: one quad, one or more
 * programs, uniform setters, textures and framebuffers. No three.js dependency.
 */

export interface GLContextOptions {
  alpha?: boolean;
  preferWebGL2?: boolean;
}

export function getContext(
  canvas: HTMLCanvasElement,
  { alpha = false, preferWebGL2 = true }: GLContextOptions = {},
): WebGLRenderingContext | WebGL2RenderingContext | null {
  const attrs: WebGLContextAttributes = {
    alpha,
    antialias: false,
    premultipliedAlpha: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: false,
  };
  if (preferWebGL2) {
    const gl2 = canvas.getContext('webgl2', attrs) as WebGL2RenderingContext | null;
    if (gl2) return gl2;
  }
  return canvas.getContext('webgl', attrs) as WebGLRenderingContext | null;
}

export const QUAD_VERTEX = /* glsl */ `
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

export class ShaderProgram {
  readonly program: WebGLProgram;
  private uniforms = new Map<string, WebGLUniformLocation | null>();

  constructor(
    readonly gl: WebGLRenderingContext | WebGL2RenderingContext,
    vertexSource: string,
    fragmentSource: string,
  ) {
    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) throw new Error('createShader failed');
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(sh);
        gl.deleteShader(sh);
        throw new Error(`Shader compile error: ${log ?? 'unknown'}`);
      }
      return sh;
    };
    const vs = compile(gl.VERTEX_SHADER, vertexSource);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    if (!program) throw new Error('createProgram failed');
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.bindAttribLocation(program, 0, 'aPosition');
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error(`Program link error: ${gl.getProgramInfoLog(program) ?? 'unknown'}`);
    this.program = program;
  }

  use(): this {
    this.gl.useProgram(this.program);
    return this;
  }

  loc(name: string): WebGLUniformLocation | null {
    if (!this.uniforms.has(name))
      this.uniforms.set(name, this.gl.getUniformLocation(this.program, name));
    return this.uniforms.get(name) ?? null;
  }

  f(name: string, v: number) {
    this.gl.uniform1f(this.loc(name), v);
    return this;
  }
  f2(name: string, x: number, y: number) {
    this.gl.uniform2f(this.loc(name), x, y);
    return this;
  }
  f3(name: string, x: number, y: number, z: number) {
    this.gl.uniform3f(this.loc(name), x, y, z);
    return this;
  }
  i(name: string, v: number) {
    this.gl.uniform1i(this.loc(name), v);
    return this;
  }

  dispose() {
    this.gl.deleteProgram(this.program);
  }
}

export class Quad {
  private buffer: WebGLBuffer;
  constructor(readonly gl: WebGLRenderingContext | WebGL2RenderingContext) {
    const b = gl.createBuffer();
    if (!b) throw new Error('createBuffer failed');
    this.buffer = b;
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  }
  draw() {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  dispose() {
    this.gl.deleteBuffer(this.buffer);
  }
}

export interface Target {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  attach(unit: number): number;
  dispose(): void;
}

/** Create a render target. `float` uses half-float textures when available (WebGL2 or OES ext). */
export function createTarget(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  width: number,
  height: number,
  opts: { float?: boolean; linear?: boolean } = {},
): Target | null {
  const isGL2 =
    typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
  let internalFormat: number = gl.RGBA;
  let type: number = gl.UNSIGNED_BYTE;
  let filter: number = opts.linear === false ? gl.NEAREST : gl.LINEAR;
  if (opts.float) {
    if (isGL2) {
      const ext = gl.getExtension('EXT_color_buffer_float');
      const gl2 = gl as WebGL2RenderingContext;
      if (!ext) return null;
      internalFormat = gl2.RGBA16F;
      type = gl2.HALF_FLOAT;
      if (!gl.getExtension('OES_texture_float_linear')) filter = gl.NEAREST;
    } else {
      const half = gl.getExtension('OES_texture_half_float');
      if (!half) return null;
      type = half.HALF_FLOAT_OES;
      if (!gl.getExtension('OES_texture_half_float_linear')) filter = gl.NEAREST;
    }
  }
  const texture = gl.createTexture();
  const fbo = gl.createFramebuffer();
  if (!texture || !fbo) return null;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, gl.RGBA, type, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  if (!ok) {
    gl.deleteTexture(texture);
    gl.deleteFramebuffer(fbo);
    return null;
  }
  return {
    texture,
    fbo,
    width,
    height,
    attach(unit: number) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      return unit;
    },
    dispose() {
      gl.deleteTexture(texture);
      gl.deleteFramebuffer(fbo);
    },
  };
}

/** Pair of targets for ping-pong rendering. */
export class DoubleTarget {
  private a: Target;
  private b: Target;
  constructor(a: Target, b: Target) {
    this.a = a;
    this.b = b;
  }
  get read() {
    return this.a;
  }
  get write() {
    return this.b;
  }
  swap() {
    const t = this.a;
    this.a = this.b;
    this.b = t;
  }
  dispose() {
    this.a.dispose();
    this.b.dispose();
  }
}

export function loadImageTexture(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  src: string,
): Promise<{ texture: WebGLTexture; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const texture = gl.createTexture();
      if (!texture) return reject(new Error('createTexture failed'));
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      resolve({ texture, width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

export function loseContext(gl: WebGLRenderingContext | WebGL2RenderingContext) {
  gl.getExtension('WEBGL_lose_context')?.loseContext();
}
