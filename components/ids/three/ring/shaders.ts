export const glowVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

/** Fresnel-style sleeve glow: bright at the silhouette, transparent facing the camera. */
export const glowFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uPower;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float facing = clamp(dot(vNormal, vViewDir), 0.0, 1.0);
    float fresnel = pow(1.0 - facing, uPower);
    // Soft falloff: silhouette glows, the face pointing at the camera stays transparent.
    float a = fresnel * (0.35 + 0.65 * facing) * uIntensity;
    gl_FragColor = vec4(uColor * a, a * 0.9);
  }
`;

export const haloVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/** Soft atmospheric halo: radial falloff with a slow breathing pulse. */
export const haloFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uColor2;
  uniform float uTime;
  uniform float uIntensity;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv - 0.5;
    float d = length(p) * 2.0;
    float pulse = 0.92 + 0.08 * sin(uTime * 0.8);
    float glow = smoothstep(1.0, 0.0, d) * pulse;
    glow = pow(glow, 2.2);
    float ring = smoothstep(0.08, 0.0, abs(d - 0.62)) * 0.22;
    vec3 col = mix(uColor2, uColor, clamp(d * 1.4, 0.0, 1.0));
    float a = (glow * 0.6 + ring) * uIntensity;
    gl_FragColor = vec4(col * a, a);
  }
`;

export const dustVertex = /* glsl */ `
  attribute float aSize;
  attribute float aOffset;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.6 + aOffset * 6.2831) * 0.06;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float twinkle = 0.55 + 0.45 * sin(uTime * 1.7 + aOffset * 12.0);
    vAlpha = twinkle;
    gl_PointSize = aSize * uPixelRatio * (140.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

export const dustFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    gl_FragColor = vec4(uColor, a);
  }
`;
