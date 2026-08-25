import * as THREE from 'three';
import { cached, heightToNormalMap } from './assetCache';

/* ------------------------------------------------------------------ *
 * Noise
 * ------------------------------------------------------------------ */

function hash2(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

const fade = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Value noise that wraps at `period`, so tiles and equirectangular maps seam. */
export function tileNoise(x: number, y: number, period: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = fade(x - xi);
  const yf = fade(y - yi);

  const wrap = (v: number) => ((v % period) + period) % period;

  const c00 = hash2(wrap(xi), wrap(yi));
  const c10 = hash2(wrap(xi + 1), wrap(yi));
  const c01 = hash2(wrap(xi), wrap(yi + 1));
  const c11 = hash2(wrap(xi + 1), wrap(yi + 1));

  return lerp(lerp(c00, c10, xf), lerp(c01, c11, xf), yf);
}

/** Fractal Brownian motion — the workhorse for organic surface detail. */
export function fbm(x: number, y: number, octaves = 5, period = 256): number {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let norm = 0;

  for (let i = 0; i < octaves; i++) {
    value += tileNoise(x * frequency, y * frequency, period * frequency) * amplitude;
    norm += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value / norm;
}

/* ------------------------------------------------------------------ *
 * Generic surface maps
 * ------------------------------------------------------------------ */

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return [canvas, canvas.getContext('2d')!];
}

interface SurfaceOptions {
  size?: number;
  /** Base frequency of the large forms */
  scale?: number;
  octaves?: number;
  /** How hard the Sobel pass pushes the normals */
  normalStrength?: number;
  /** Optional extra detail drawn onto the height field */
  detail?: (ctx: CanvasRenderingContext2D, size: number) => void;
  repeat?: [number, number];
}

/**
 * Builds a tileable height field and derives a normal map from it.
 *
 * Normal maps are the difference between "a shape with a colour" and "a
 * surface": they perturb the shading normal per pixel, so every light in the
 * environment breaks up across the micro-structure the way it does on a real
 * object.
 */
export function surfaceNormal(key: string, opts: SurfaceOptions = {}): THREE.Texture {
  const {
    size = 512,
    scale = 12,
    octaves = 5,
    normalStrength = 2.2,
    detail,
    repeat = [1, 1],
  } = opts;

  return cached(`normal:${key}`, () => {
    const [canvas, ctx] = makeCanvas(size, size);
    const img = ctx.createImageData(size, size);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const v = fbm((x / size) * scale, (y / size) * scale, octaves, scale);
        const c = Math.max(0, Math.min(255, v * 255));
        const idx = (y * size + x) * 4;
        img.data[idx] = c;
        img.data[idx + 1] = c;
        img.data[idx + 2] = c;
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);

    if (detail) detail(ctx, size);

    const tex = heightToNormalMap(canvas, normalStrength);
    tex.repeat.set(repeat[0], repeat[1]);
    return tex;
  });
}

/**
 * Greyscale variation map. Used as a roughnessMap: real surfaces are never
 * uniformly rough — oil, wear and handling all leave patches.
 */
export function variationMap(
  key: string,
  opts: { size?: number; scale?: number; low?: number; high?: number; octaves?: number; repeat?: [number, number] } = {}
): THREE.Texture {
  const { size = 512, scale = 6, low = 0.45, high = 1.0, octaves = 4, repeat = [1, 1] } = opts;

  return cached(`variation:${key}`, () => {
    const [canvas, ctx] = makeCanvas(size, size);
    const img = ctx.createImageData(size, size);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const v = fbm((x / size) * scale, (y / size) * scale, octaves, scale);
        const mapped = low + (high - low) * v;
        const c = Math.max(0, Math.min(255, mapped * 255));
        const idx = (y * size + x) * 4;
        img.data[idx] = c;
        img.data[idx + 1] = c;
        img.data[idx + 2] = c;
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat[0], repeat[1]);
    return tex;
  });
}

/** Soft round particle sprite (steam, embers, dust). */
export function softSprite(key: string, stops: [number, string][]): THREE.Texture {
  return cached(`sprite:${key}`, () => {
    const [canvas, ctx] = makeCanvas(128, 128);
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    stops.forEach(([offset, color]) => g.addColorStop(offset, color));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  });
}
