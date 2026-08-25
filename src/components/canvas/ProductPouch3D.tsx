import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ProductItem } from '../../types';

interface ProductPouch3DProps {
  product: ProductItem;
  scale?: number;
  position?: [number, number, number];
  interactive?: boolean;
}

const POUCH_HEIGHT = 2.8;
const POUCH_WIDTH = 1.9;
const POUCH_DEPTH = 0.86;

/**
 * Shapes a cylinder into a stand-up doypack: oval cross section, bean-filled
 * belly, flat base and a heat-sealed crimp at the top.
 *
 * `inflate` lets the printed label panels ride a hair above the body so they
 * sit flush without z-fighting.
 */
function deformPouch(geometry: THREE.BufferGeometry, inflate = 1): THREE.BufferGeometry {
  const pos = geometry.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const yNorm = (v.y + POUCH_HEIGHT / 2) / POUCH_HEIGHT; // 0 bottom → 1 top

    let x = v.x * (POUCH_WIDTH / 1.9) * inflate;
    let z = v.z * (POUCH_DEPTH / 0.95) * inflate;

    if (yNorm < 0.2) {
      // Gusseted base: keeps its width and folds flat only in depth, the way a
      // doypack actually stands. Tapering both axes made it read as a cone.
      const t = yNorm / 0.2;
      x *= 0.95 + t * 0.05;
      z *= 0.55 + t * 0.45;
    } else if (yNorm <= 0.82) {
      // Belly: full of beans, so it bulges front-to-back
      const mid = 1.0 - Math.abs((yNorm - 0.51) / 0.31);
      z *= 1.0 + Math.max(0, mid) * 0.34;
      x *= 1.0 + Math.max(0, mid) * 0.05;
    } else {
      // Heat-seal crimp: collapses to a thin seam with a slight flange
      const t = (yNorm - 0.82) / 0.18;
      z *= Math.max(0.06, 1.0 - t * 0.94);
      x *= 1.0 + t * 0.06;
    }

    pos.setXYZ(i, x, v.y, z);
  }

  geometry.computeVertexNormals();
  return geometry;
}

/** Matte kraft-foil body: isotropic grain, so the back seam is invisible. */
function createKraftTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#2C1F17';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 30000; i++) {
      const a = Math.random();
      ctx.fillStyle =
        a > 0.5 ? 'rgba(255, 236, 214, 0.035)' : 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 1.4, 1.4);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 2);
  return tex;
}

/**
 * Front label. Drawn on its own panel geometry with straight 0..1 UVs, so the
 * type stays crisp — the previous version wrapped a single texture around the
 * whole cylinder, which put the seam straight down the middle of the artwork
 * and mirrored the text on the back.
 */
function createFrontLabel(product: ProductItem, accent: string): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 1024, 1024);

  // Printed area — leaves the crimp and base gusset unprinted
  const top = 150;
  const bottom = 900;
  const left = 130;
  const right = 894;

  const grad = ctx.createLinearGradient(0, top, 0, bottom);
  grad.addColorStop(0, '#40291B');
  grad.addColorStop(0.5, '#312016');
  grad.addColorStop(1, '#26180F');
  ctx.fillStyle = grad;
  ctx.fillRect(left, top, right - left, bottom - top);

  // Accent band keyed to the product
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.14;
  ctx.fillRect(left, top, right - left, 6);
  ctx.globalAlpha = 1;

  // Gold frame
  ctx.strokeStyle = '#D49B5B';
  ctx.lineWidth = 3;
  ctx.strokeRect(left + 22, top + 22, right - left - 44, bottom - top - 44);
  ctx.strokeStyle = 'rgba(212, 155, 91, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(left + 32, top + 32, right - left - 64, bottom - top - 64);

  ctx.textAlign = 'center';
  const cx = (left + right) / 2;

  // Wordmark
  ctx.fillStyle = '#FAF4EB';
  ctx.font = '600 58px Outfit, "Segoe UI", sans-serif';
  ctx.fillText('B R E M A', cx, top + 120);

  ctx.fillStyle = '#D49B5B';
  ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('KAHVE KAVURMA ATÖLYESİ · İSTANBUL 2012', cx, top + 158);

  ctx.strokeStyle = 'rgba(212, 155, 91, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 190, top + 186);
  ctx.lineTo(cx + 190, top + 186);
  ctx.stroke();

  // Product name — wraps if the name is long
  ctx.fillStyle = '#FAF4EB';
  const displayName = product.name.replace(/^Brema\s+/i, '');
  const words = displayName.split(' ');
  const lines: string[] = [];
  let line = '';
  ctx.font = 'italic 600 62px "Playfair Display", Georgia, serif';
  words.forEach((w) => {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > right - left - 120 && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  });
  if (line) lines.push(line);
  lines.slice(0, 2).forEach((l, i) => ctx.fillText(l, cx, top + 280 + i * 70));

  const afterName = top + 280 + Math.min(lines.length, 2) * 70;

  // Roast / category pill
  ctx.fillStyle = 'rgba(212, 155, 91, 0.18)';
  ctx.strokeStyle = '#D49B5B';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(cx - 230, afterName + 10, 460, 46, 23);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#FAF4EB';
  ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    `${product.category.toUpperCase()} · ${product.roastLevel.toUpperCase()} KAVRUM`,
    cx,
    afterName + 40
  );

  // Origin
  ctx.fillStyle = '#D9C3B0';
  ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(product.origin, cx, afterName + 100);

  // Tasting notes
  const notes = (product.tastingNotes || []).slice(0, 3);
  ctx.font = '600 19px "Plus Jakarta Sans", sans-serif';
  notes.forEach((note, idx) => {
    const y = afterName + 155 + idx * 48;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.roundRect(cx - 250, y - 26, 500, 38, 19);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212, 155, 91, 0.28)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#FAF4EB';
    ctx.fillText(note.toUpperCase(), cx, y);
  });

  // Footer lockup
  ctx.fillStyle = '#D49B5B';
  ctx.font = '600 17px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('NET 250 G · NİTROJEN MÜHÜRLÜ', cx, bottom - 78);
  ctx.fillStyle = '#A89080';
  ctx.font = '400 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('ÇEKİRDEKTEN FİNCANA · BREMA.COM.TR', cx, bottom - 50);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Back label: brewing guidance, the way a real specialty bag is printed. */
function createBackLabel(product: ProductItem): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 1024, 1024);

  const top = 170;
  const bottom = 880;
  const left = 150;
  const right = 874;

  ctx.fillStyle = '#1B120D';
  ctx.fillRect(left, top, right - left, bottom - top);
  ctx.strokeStyle = 'rgba(212, 155, 91, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(left + 20, top + 20, right - left - 40, bottom - top - 40);

  ctx.textAlign = 'left';
  const x = left + 56;

  ctx.fillStyle = '#D49B5B';
  ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('DEMLEME ÖNERİSİ', x, top + 90);

  ctx.fillStyle = '#D9C3B0';
  ctx.font = '400 19px "Plus Jakarta Sans", sans-serif';
  (product.brewMethods || []).slice(0, 4).forEach((m, i) => {
    ctx.fillText(`— ${m}`, x, top + 140 + i * 36);
  });

  ctx.fillStyle = '#D49B5B';
  ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('PROFİL', x, top + 330);

  const bars: [string, number][] = [
    ['Yoğunluk', product.intensity],
    ['Asidite', product.acidity],
    ['Gövde', product.body],
    ['Tatlılık', product.sweetness],
  ];
  bars.forEach(([labelText, value], i) => {
    const y = top + 380 + i * 52;
    ctx.fillStyle = '#D9C3B0';
    ctx.font = '400 17px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(labelText, x, y);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(x + 160, y - 14, 380, 12);
    ctx.fillStyle = '#D49B5B';
    ctx.fillRect(x + 160, y - 14, 380 * (Math.min(10, value) / 10), 12);
  });

  ctx.fillStyle = '#A89080';
  ctx.font = '400 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Serin ve kuru yerde saklayınız.', x, bottom - 90);
  ctx.fillText('Brema Kahve · Ataşehir / İstanbul', x, bottom - 62);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export const ProductPouch3D: React.FC<ProductPouch3DProps> = ({
  product,
  scale = 1,
  position = [0, 0, 0],
  interactive = true,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const previousPointerX = useRef(0);
  const targetRotationY = useRef(0);

  const bodyGeometry = useMemo(
    () =>
      deformPouch(
        // Seam starts at the back (thetaStart = π), never across the artwork
        new THREE.CylinderGeometry(0.95, 0.95, POUCH_HEIGHT, 64, 48, true, Math.PI, Math.PI * 2)
      ),
    []
  );

  const frontPanelGeometry = useMemo(
    () =>
      deformPouch(
        new THREE.CylinderGeometry(
          0.95,
          0.95,
          POUCH_HEIGHT,
          48,
          48,
          true,
          -Math.PI * 0.46,
          Math.PI * 0.92
        ),
        1.012
      ),
    []
  );

  const backPanelGeometry = useMemo(
    () =>
      deformPouch(
        new THREE.CylinderGeometry(
          0.95,
          0.95,
          POUCH_HEIGHT,
          48,
          48,
          true,
          Math.PI * 0.54,
          Math.PI * 0.92
        ),
        1.012
      ),
    []
  );

  const kraftTexture = useMemo(() => createKraftTexture(), []);
  const frontLabel = useMemo(
    () => createFrontLabel(product, product.accentColor || '#D49B5B'),
    [product]
  );
  const backLabel = useMemo(() => createBackLabel(product), [product]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (!isDragging.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = position[1] + Math.sin(t * 1.2) * 0.04;
      targetRotationY.current = Math.sin(t * 0.4) * 0.22;
    }

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotationY.current,
      delta * 4.0
    );
  });

  const handlePointerDown = (e: any) => {
    if (!interactive) return;
    e.stopPropagation();
    isDragging.current = true;
    previousPointerX.current = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    targetRotationY.current += (clientX - previousPointerX.current) * 0.015;
    previousPointerX.current = clientX;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Matte kraft-foil body */}
      <mesh geometry={bodyGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          map={kraftTexture}
          color="#FFFFFF"
          roughness={0.72}
          metalness={0.18}
          clearcoat={0.12}
          clearcoatRoughness={0.6}
          envMapIntensity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Printed front + back panels */}
      <mesh geometry={frontPanelGeometry} castShadow>
        <meshPhysicalMaterial
          map={frontLabel}
          transparent
          alphaTest={0.4}
          roughness={0.55}
          metalness={0.1}
          clearcoat={0.28}
          clearcoatRoughness={0.35}
          envMapIntensity={0.8}
          side={THREE.FrontSide}
        />
      </mesh>

      <mesh geometry={backPanelGeometry}>
        <meshPhysicalMaterial
          map={backLabel}
          transparent
          alphaTest={0.4}
          roughness={0.6}
          metalness={0.08}
          envMapIntensity={0.7}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Heat-sealed top crimp */}
      <mesh position={[0, 1.41, 0]} castShadow>
        <boxGeometry args={[2.02, 0.13, 0.07]} />
        <meshStandardMaterial color="#161009" roughness={0.55} metalness={0.35} />
      </mesh>
      {/* Tear notch */}
      <mesh position={[0.86, 1.32, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.05, 0.05, 0.09]} />
        <meshStandardMaterial color="#0E0906" roughness={0.7} />
      </mesh>

      {/* One-way degassing valve */}
      <group position={[0, 0.62, 0.63]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.085, 0.085, 0.022, 32]} />
          <meshStandardMaterial color="#C08A46" roughness={0.28} metalness={0.85} envMapIntensity={1.4} />
        </mesh>
        <mesh position={[0, 0.013, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.008, 20]} />
          <meshStandardMaterial color="#0E0906" roughness={0.8} />
        </mesh>
      </group>

      {/* Base gusset */}
      <mesh position={[0, -1.39, 0]} receiveShadow>
        <cylinderGeometry args={[0.79, 0.79, 0.05, 48]} />
        <meshStandardMaterial color="#161009" roughness={0.75} metalness={0.15} />
      </mesh>
    </group>
  );
};
