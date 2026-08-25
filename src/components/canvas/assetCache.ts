import * as THREE from 'three';

/**
 * Process-wide cache for procedurally generated geometry and textures.
 *
 * Every scene used to rebuild its canvases and displaced meshes on mount —
 * 2048×1024 pixel loops, 128-segment vertex displacement, thousands of canvas
 * strokes — all synchronously, in the middle of a route transition. That is the
 * jank. Built once here, reused for the rest of the session.
 *
 * Anything handed out from this cache must be mounted with `dispose={null}`,
 * otherwise react-three-fiber frees it when the scene unmounts and the next
 * visit renders nothing.
 */
const cache = new Map<string, unknown>();

export function cached<T>(key: string, build: () => T): T {
  const hit = cache.get(key);
  if (hit !== undefined) return hit as T;

  const value = build();
  cache.set(key, value);
  return value;
}

/** Bounded cache for per-variant assets (labels keyed by product, …). */
export function cachedLRU<T>(key: string, build: () => T, limit = 16): T {
  const hit = cache.get(key);
  if (hit !== undefined) return hit as T;

  const value = build();
  cache.set(key, value);

  if (cache.size > limit) {
    const oldest = cache.keys().next().value as string | undefined;
    if (oldest !== undefined && oldest !== key) {
      const evicted = cache.get(oldest);
      cache.delete(oldest);
      if (
        evicted instanceof THREE.Texture ||
        evicted instanceof THREE.BufferGeometry ||
        evicted instanceof THREE.Material
      ) {
        evicted.dispose();
      }
    }
  }

  return value;
}

/**
 * Derives a tangent-space normal map from a greyscale height canvas with a
 * Sobel filter. Normal maps catch light per-pixel the way a real surface does;
 * `bumpMap` only perturbs the diffuse term and is what makes procedural props
 * read as flat plastic.
 */
export function heightToNormalMap(
  height: HTMLCanvasElement,
  strength = 2.0
): THREE.CanvasTexture {
  const size = height.width;
  const src = height.getContext('2d')!.getImageData(0, 0, size, height.height);
  const out = document.createElement('canvas');
  out.width = size;
  out.height = height.height;
  const ctx = out.getContext('2d')!;
  const dst = ctx.createImageData(size, height.height);

  const h = (x: number, y: number) => {
    const xi = (x + size) % size;
    const yi = (y + height.height) % height.height;
    return src.data[(yi * size + xi) * 4] / 255;
  };

  for (let y = 0; y < height.height; y++) {
    for (let x = 0; x < size; x++) {
      const dx =
        h(x - 1, y - 1) + 2 * h(x - 1, y) + h(x - 1, y + 1) -
        (h(x + 1, y - 1) + 2 * h(x + 1, y) + h(x + 1, y + 1));
      const dy =
        h(x - 1, y - 1) + 2 * h(x, y - 1) + h(x + 1, y - 1) -
        (h(x - 1, y + 1) + 2 * h(x, y + 1) + h(x + 1, y + 1));

      const nx = dx * strength;
      const ny = dy * strength;
      const nz = 1.0;
      const len = Math.hypot(nx, ny, nz);

      const idx = (y * size + x) * 4;
      dst.data[idx] = ((nx / len) * 0.5 + 0.5) * 255;
      dst.data[idx + 1] = ((ny / len) * 0.5 + 0.5) * 255;
      dst.data[idx + 2] = ((nz / len) * 0.5 + 0.5) * 255;
      dst.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(dst, 0, 0);
  const tex = new THREE.CanvasTexture(out);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}
