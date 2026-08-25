import * as THREE from 'three';

/** Deterministic 3D value noise — no dependency, stable between renders. */
function hash3(x: number, y: number, z: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123;
  return s - Math.floor(s);
}

function smoothNoise(x: number, y: number, z: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = x - xi;
  const yf = y - yi;
  const zf = z - zi;

  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const w = zf * zf * (3 - 2 * zf);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const c000 = hash3(xi, yi, zi);
  const c100 = hash3(xi + 1, yi, zi);
  const c010 = hash3(xi, yi + 1, zi);
  const c110 = hash3(xi + 1, yi + 1, zi);
  const c001 = hash3(xi, yi, zi + 1);
  const c101 = hash3(xi + 1, yi, zi + 1);
  const c011 = hash3(xi, yi + 1, zi + 1);
  const c111 = hash3(xi + 1, yi + 1, zi + 1);

  return lerp(
    lerp(lerp(c000, c100, u), lerp(c010, c110, u), v),
    lerp(lerp(c001, c101, u), lerp(c011, c111, u), v),
    w
  );
}

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

/**
 * Anatomically plausible Arabica bean.
 *
 * Every deformation is blended with smoothstep/gaussian falloffs rather than
 * hard `if` cut-offs — the previous version stepped the ventral cleft on at a
 * fixed z threshold, which left a visible crease ring and shattered the
 * recomputed normals into facets.
 *
 * The bean also writes a COLOR attribute: the silverskin chaff in the fissure
 * and the shadowed cleft walls are painted per-vertex, so they line up with the
 * geometry exactly instead of relying on a sphere-UV texture that slides off.
 */
export function createRealisticBeanGeometry(
  width = 0.98,
  length = 1.36,
  height = 0.68,
  segments = 128
): THREE.BufferGeometry {
  const geometry = new THREE.SphereGeometry(1, segments, Math.round(segments * 0.75));
  const position = geometry.attributes.position;
  const v = new THREE.Vector3();

  const colors = new Float32Array(position.count * 3);
  const cream = new THREE.Color('#C9B49B');
  const base = new THREE.Color('#FFFFFF');
  const shadow = new THREE.Color('#4A382C');

  const tmp = new THREE.Color();

  for (let i = 0; i < position.count; i++) {
    v.fromBufferAttribute(position, i);

    const x = v.x;
    const y = v.y; // longitudinal axis
    const z = v.z;

    const yNorm = Math.abs(y);

    // 1. Tapered ends (micropyle / chalaza). A high power keeps the middle at
    // full width and only narrows the last stretch, so the tips stay rounded.
    const endTaper = 1.0 - Math.pow(yNorm, 4.0) * 0.24;

    // Gentle organic asymmetry so the bean never reads as a perfect solid
    const asymmetry = 1.0 + x * 0.09 + Math.sin(y * 1.7) * 0.02;

    // 2. How "ventral" this vertex is: 0 on the domed back, 1 on the flat face
    const ventral = smoothstep(-0.05, -0.85, z);

    let newX = x * width * endTaper * asymmetry;
    let newY = y * length;
    // Ventral face is flatter, dorsal face keeps a rich dome
    let newZ = z * height * endTaper * (1.0 - ventral * 0.42) * (1.0 + (1.0 - ventral) * 0.06);

    // 3. Sigmoid ventral fissure — gaussian profile, so no seam artefacts
    const sOffset = Math.sin(y * 2.6) * 0.09 * (1.0 - yNorm * 0.45);
    const creaseWidth = 0.19 * (1.0 - Math.pow(yNorm, 2.0) * 0.3);
    const d = Math.abs(newX - sOffset) / creaseWidth;

    const groove = Math.exp(-d * d * 3.4) * ventral;
    const lip = Math.exp(-Math.pow(d - 1.6, 2) * 4.5) * ventral;

    newZ += groove * 0.3 - lip * 0.045; // +Z here pushes INTO the bean (ventral is -Z)

    // 4. Organic irregularity. A perfectly symmetric solid is the single
    // clearest tell that a shape was generated rather than grown, so a
    // low-frequency lump field breaks the silhouette before the fine relief
    // breaks the surface.
    const lump = smoothNoise(x * 2.1 + 3.3, y * 2.1 + 9.7, z * 2.1 + 5.5) - 0.5;
    const n = smoothNoise(x * 7.0 + 11.3, y * 7.0 + 4.1, z * 7.0 + 2.7) - 0.5;
    const micro = smoothNoise(x * 26.0, y * 26.0, z * 26.0) - 0.5;
    const relief = lump * 0.055 + n * 0.022 + micro * 0.008;

    const len = Math.hypot(newX, newY, newZ) || 1;
    newX += (newX / len) * relief;
    newY += (newY / len) * relief;
    newZ += (newZ / len) * relief;

    position.setXYZ(i, newX, newY, newZ);

    // 5. Per-vertex colouring, aligned with the geometry
    tmp.copy(base);
    // Cleft walls fall into shadow
    tmp.lerp(shadow, Math.min(1, groove * 1.15));
    // Silverskin chaff sits in the deepest part of the fissure
    tmp.lerp(cream, Math.min(1, Math.pow(groove, 3.0) * 1.3));
    // Broad organic mottling from the low-frequency noise
    const mottle = 1.0 + n * 0.16;
    colors[i * 3] = tmp.r * mottle;
    colors[i * 3 + 1] = tmp.g * mottle;
    colors[i * 3 + 2] = tmp.b * mottle;
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}
