import type { Object3D, Material } from 'three';

function disposeMaterial(material: Material) {
  const m = material as Material & Record<string, unknown>;
  for (const key of Object.keys(m)) {
    const value = m[key];
    if (value && typeof value === 'object' && 'isTexture' in (value as object)) {
      (value as { dispose(): void }).dispose();
    }
  }
  material.dispose();
}

/**
 * Recursively disposes geometries, materials and textures under an Object3D.
 * R3F disposes JSX-declared resources automatically; use this for objects you
 * create imperatively (e.g. in `useMemo`).
 */
export function disposeObject(root: Object3D): void {
  root.traverse((obj) => {
    const mesh = obj as Object3D & {
      geometry?: { dispose(): void };
      material?: Material | Material[];
    };
    mesh.geometry?.dispose();
    if (Array.isArray(mesh.material)) mesh.material.forEach(disposeMaterial);
    else if (mesh.material) disposeMaterial(mesh.material);
  });
}
