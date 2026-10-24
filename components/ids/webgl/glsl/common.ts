/** Pass-through vertex shader exposing `vUv`. */
export const fullscreenVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/** Aspect-correct UV helper. Prepend to fragment shaders that use `coverUv`. */
export const coverUv = /* glsl */ `
  vec2 coverUv(vec2 uv, vec2 planeSize, vec2 imageSize) {
    float planeAspect = planeSize.x / planeSize.y;
    float imageAspect = imageSize.x / imageSize.y;
    vec2 scale = planeAspect > imageAspect
      ? vec2(1.0, imageAspect / planeAspect)
      : vec2(planeAspect / imageAspect, 1.0);
    return (uv - 0.5) * scale + 0.5;
  }
`;

/** Compose GLSL snippets into one shader source. */
export function composeShader(...chunks: string[]): string {
  return chunks.join('\n');
}
