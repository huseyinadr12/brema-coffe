import * as THREE from 'three';
import { cached, heightToNormalMap } from './assetCache';
import { fbm } from './proceduralTextures';

/**
 * Coarse continent outlines in [lng, lat].
 *
 * These define only the broad landmass; the coastlines you actually see are
 * produced by warping this mask with noise, which is what turns a polygon into
 * something that reads as a real coastline.
 */
const LANDMASSES: [number, number][][] = [
  [
    [-168, 65], [-158, 71], [-140, 70], [-125, 70], [-110, 68], [-95, 70],
    [-85, 73], [-75, 68], [-62, 58], [-55, 50], [-66, 45], [-70, 41],
    [-76, 35], [-81, 25], [-90, 29], [-97, 26], [-105, 22], [-114, 30],
    [-124, 40], [-124, 48], [-133, 55], [-150, 59], [-165, 55],
  ],
  [[-105, 22], [-95, 15], [-83, 8], [-77, 7], [-83, 15], [-92, 18], [-100, 20]],
  [[-45, 60], [-25, 70], [-20, 78], [-30, 83], [-50, 82], [-58, 75], [-52, 65]],
  [
    [-81, 6], [-76, 0], [-80, -6], [-75, -15], [-71, -30], [-73, -45],
    [-75, -53], [-66, -55], [-62, -40], [-57, -34], [-50, -30], [-48, -25],
    [-40, -20], [-35, -8], [-45, -1], [-50, 2], [-60, 8], [-72, 12],
  ],
  [
    [-17, 15], [-17, 21], [-10, 28], [0, 35], [10, 37], [20, 32], [32, 31],
    [35, 22], [38, 15], [43, 11], [51, 12], [50, 4], [41, -2], [40, -10],
    [35, -18], [33, -26], [27, -34], [20, -35], [18, -30], [12, -18],
    [9, -2], [3, 5], [-8, 4], [-13, 9],
  ],
  [[44, -12], [50, -16], [47, -25], [44, -22]],
  [
    [-10, 36], [-9, 43], [-2, 48], [4, 51], [8, 54], [12, 57], [20, 55],
    [28, 60], [24, 66], [30, 70], [40, 68], [45, 60], [40, 50], [35, 45],
    [28, 41], [22, 40], [15, 38], [12, 45], [5, 43], [-2, 37],
  ],
  [[-10, 51], [-3, 50], [0, 53], [-2, 58], [-8, 57]],
  [
    [45, 60], [60, 70], [75, 73], [90, 75], [105, 77], [125, 73], [140, 72],
    [160, 68], [178, 66], [175, 60], [160, 58], [145, 55], [135, 48],
    [128, 42], [120, 40], [110, 42], [95, 45], [80, 45], [60, 48], [48, 52],
  ],
  [
    [95, 45], [110, 42], [122, 40], [122, 30], [117, 23], [108, 18],
    [105, 10], [100, 6], [98, 12], [95, 20], [92, 27],
  ],
  [[68, 24], [75, 30], [88, 27], [92, 22], [88, 18], [80, 10], [74, 16]],
  [[35, 30], [43, 30], [56, 26], [59, 22], [52, 14], [44, 12], [38, 18]],
  [[95, 5], [110, 2], [120, 0], [130, -2], [128, -6], [112, -8], [100, -2]],
  [[118, 18], [124, 16], [126, 8], [121, 5], [118, 10]],
  [
    [113, -22], [114, -32], [120, -34], [130, -32], [138, -35], [147, -38],
    [152, -32], [153, -25], [145, -15], [137, -12], [130, -12], [124, -16],
  ],
  [[166, -46], [172, -44], [175, -37], [173, -35], [168, -44]],
  [[130, 32], [136, 35], [141, 40], [145, 44], [141, 36], [134, 33]],
  // Antarctica
  [[-180, -70], [180, -70], [180, -90], [-180, -90]],
];

const W = 2048;
const H = 1024;

const lngToX = (lng: number) => ((lng + 180) / 360) * W;
const latToY = (lat: number) => ((90 - lat) / 180) * H;

/** Blurred polygon mask: 0 = ocean, 255 = deep interior. */
function landMask(): Uint8ClampedArray {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#FFFFFF';
  LANDMASSES.forEach((poly) => {
    ctx.beginPath();
    poly.forEach(([lng, lat], i) => {
      const x = lngToX(lng);
      const y = latToY(lat);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
  });

  // Blurring turns the hard polygon edge into a gradient, which the noise
  // threshold below can then bite into to make an irregular coastline.
  const blurred = document.createElement('canvas');
  blurred.width = W;
  blurred.height = H;
  const bctx = blurred.getContext('2d')!;
  bctx.filter = 'blur(14px)';
  bctx.drawImage(canvas, 0, 0);

  return bctx.getImageData(0, 0, W, H).data;
}

interface EarthMaps {
  map: THREE.Texture;
  normalMap: THREE.Texture;
  roughnessMap: THREE.Texture;
  clouds: THREE.Texture;
}

/**
 * Builds the whole Earth material set in one pass over the sphere's UV space:
 * albedo, elevation-derived normals, an ocean/land roughness split and a
 * separate cloud layer.
 */
export function earthTextures(): EarthMaps {
  return cached('earth:maps', (): EarthMaps => {
    const mask = landMask();

    const albedo = document.createElement('canvas');
    albedo.width = W;
    albedo.height = H;
    const aCtx = albedo.getContext('2d')!;
    const aImg = aCtx.createImageData(W, H);

    const rough = document.createElement('canvas');
    rough.width = W;
    rough.height = H;
    const rCtx = rough.getContext('2d')!;
    const rImg = rCtx.createImageData(W, H);

    // Height field is generated at half resolution: the Sobel pass that turns
    // it into a normal map is the expensive part and gains nothing from 4× the
    // samples at this viewing distance.
    const HW = W / 2;
    const HH = H / 2;
    const height = document.createElement('canvas');
    height.width = HW;
    height.height = HH;
    const hCtx = height.getContext('2d')!;
    const hImg = hCtx.createImageData(HW, HH);

    for (let y = 0; y < H; y++) {
      const lat = 90 - (y / H) * 180;
      const latAbs = Math.abs(lat);
      // Longitude bands compress toward the poles; scaling the noise by cos(lat)
      // keeps the terrain grain even instead of smeared into vertical streaks.
      const lonScale = Math.max(0.15, Math.cos((lat * Math.PI) / 180));

      for (let x = 0; x < W; x++) {
        const idx = (y * W + x) * 4;
        const m = mask[idx] / 255;

        const nx = (x / W) * 26 * lonScale;
        const ny = (y / H) * 13;

        const coast = fbm(nx * 2.2, ny * 2.2, 5, 64);
        const terrain = fbm(nx, ny, 6, 32);
        const detail = fbm(nx * 5, ny * 5, 4, 128);

        // Warp the blurred mask by noise → irregular coastlines and islands
        const landValue = m + (coast - 0.5) * 0.42;
        const isLand = landValue > 0.5;
        const shore = Math.max(0, Math.min(1, (landValue - 0.46) / 0.16));

        let r: number, g: number, b: number, roughness: number;

        if (!isLand) {
          // Ocean: darkens with depth, and is the smooth part of the planet
          const depth = Math.max(0, Math.min(1, (0.5 - landValue) / 0.5));
          const shallow = 1 - depth;
          r = 8 + shallow * 26;
          g = 26 + shallow * 62;
          b = 52 + shallow * 74;
          roughness = 42 + detail * 26;
        } else {
          const elevation = terrain * 0.7 + detail * 0.3;

          if (latAbs > 68) {
            // Ice cap
            r = 226 + detail * 22;
            g = 232 + detail * 20;
            b = 236 + detail * 18;
            roughness = 150;
          } else if (latAbs > 52) {
            // Boreal
            r = 62 + elevation * 46;
            g = 74 + elevation * 40;
            b = 52 + elevation * 30;
            roughness = 205;
          } else if (latAbs > 32) {
            // Temperate
            r = 78 + elevation * 62;
            g = 92 + elevation * 52;
            b = 50 + elevation * 30;
            roughness = 210;
          } else if (latAbs > 18 && terrain > 0.55) {
            // Arid belt — the Sahara / Arabian / Australian latitudes
            r = 168 + elevation * 52;
            g = 136 + elevation * 44;
            b = 88 + elevation * 32;
            roughness = 225;
          } else {
            // Tropical
            r = 46 + elevation * 54;
            g = 86 + elevation * 58;
            b = 36 + elevation * 26;
            roughness = 215;
          }

          // Snow on the high ground
          if (elevation > 0.78) {
            const snow = (elevation - 0.78) / 0.22;
            r += (232 - r) * snow;
            g += (236 - g) * snow;
            b += (240 - b) * snow;
          }

          // Beach line where land meets water
          if (shore < 0.35) {
            const beach = 1 - shore / 0.35;
            r += (206 - r) * beach * 0.5;
            g += (188 - g) * beach * 0.5;
            b += (148 - b) * beach * 0.5;
          }
        }

        aImg.data[idx] = r;
        aImg.data[idx + 1] = g;
        aImg.data[idx + 2] = b;
        aImg.data[idx + 3] = 255;

        rImg.data[idx] = roughness;
        rImg.data[idx + 1] = roughness;
        rImg.data[idx + 2] = roughness;
        rImg.data[idx + 3] = 255;

        if (x % 2 === 0 && y % 2 === 0) {
          const hIdx = ((y / 2) * HW + x / 2) * 4;
          const elevation = isLand ? 90 + terrain * 150 + detail * 15 : 40 + detail * 12;
          hImg.data[hIdx] = elevation;
          hImg.data[hIdx + 1] = elevation;
          hImg.data[hIdx + 2] = elevation;
          hImg.data[hIdx + 3] = 255;
        }
      }
    }

    aCtx.putImageData(aImg, 0, 0);
    rCtx.putImageData(rImg, 0, 0);
    hCtx.putImageData(hImg, 0, 0);

    const map = new THREE.CanvasTexture(albedo);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;

    const roughnessMap = new THREE.CanvasTexture(rough);
    roughnessMap.anisotropy = 4;

    const normalMap = heightToNormalMap(height, 2.6);
    normalMap.anisotropy = 4;

    return { map, normalMap, roughnessMap, clouds: cloudTexture() };
  });
}

/** Banded cloud cover: heavier at the ITCZ and the mid-latitude storm tracks. */
function cloudTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(W, H);

  for (let y = 0; y < H; y++) {
    const lat = 90 - (y / H) * 180;
    const latAbs = Math.abs(lat);
    const lonScale = Math.max(0.15, Math.cos((lat * Math.PI) / 180));

    // Two convergence bands plus a quiet subtropical belt
    const itcz = Math.exp(-Math.pow((latAbs - 4) / 11, 2));
    const storm = Math.exp(-Math.pow((latAbs - 52) / 18, 2));
    const band = 0.35 + itcz * 0.6 + storm * 0.5;

    for (let x = 0; x < W; x++) {
      const nx = (x / W) * 16 * lonScale;
      const ny = (y / H) * 8;
      // Stretch the noise zonally: weather organises along latitude lines
      const density = fbm(nx * 1.6, ny * 3.4, 6, 64);
      const value = (density - 0.52) * 2.6 * band;
      const alpha = Math.max(0, Math.min(1, value)) * 235;

      const idx = (y * W + x) * 4;
      img.data[idx] = 255;
      img.data[idx + 1] = 253;
      img.data[idx + 2] = 250;
      img.data[idx + 3] = alpha;
    }
  }

  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Fresnel atmosphere. Rayleigh scattering makes a planet's limb glow, and its
 * absence is one of the loudest "this is a shaded ball" signals.
 */
export function atmosphereMaterial(color = '#5FA8E8', power = 3.0, intensity = 1.0) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uPower: { value: power },
      uIntensity: { value: intensity },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vViewDir = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uPower;
      uniform float uIntensity;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        float rim = 1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0);
        float glow = pow(rim, uPower) * uIntensity;
        gl_FragColor = vec4(uColor, glow);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false,
  });
}
