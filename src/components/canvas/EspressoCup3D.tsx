import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EspressoCup3DProps {
  scale?: number;
  position?: [number, number, number];
}

/** Soft round sprite so steam reads as vapour instead of square dots. */
function createSoftSprite(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,0.9)');
    g.addColorStop(0.35, 'rgba(255,255,255,0.35)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
  }
  return new THREE.CanvasTexture(canvas);
}

/**
 * Demitasse profile revolved with a lathe: outer wall, over the rim and back
 * down the inner wall. The old open-ended cylinder had no thickness and no
 * interior, so the cup read as a paper tube from every angle but dead-on.
 */
function createCupGeometry(): THREE.BufferGeometry {
  const profile: [number, number][] = [
    [0.0, -0.32],
    [0.42, -0.32],
    [0.5, -0.3],
    [0.55, -0.24],
    [0.62, -0.1],
    [0.72, 0.1],
    [0.82, 0.34],
    [0.89, 0.54],
    [0.92, 0.63],
    [0.915, 0.66],
    [0.88, 0.665],
    [0.855, 0.63],
    [0.83, 0.52],
    [0.74, 0.28],
    [0.63, 0.02],
    [0.52, -0.16],
    [0.44, -0.24],
    [0.3, -0.26],
    [0.0, -0.26],
  ];

  const points = profile.map(([r, y]) => new THREE.Vector2(r, y));
  const geo = new THREE.LatheGeometry(points, 96);
  geo.computeVertexNormals();
  return geo;
}

function createSaucerGeometry(): THREE.BufferGeometry {
  const profile: [number, number][] = [
    [0.0, -0.02],
    [0.55, -0.02],
    [0.62, 0.0],
    [1.2, 0.05],
    [1.46, 0.12],
    [1.55, 0.17],
    [1.56, 0.2],
    [1.52, 0.2],
    [1.42, 0.15],
    [1.15, 0.09],
    [0.6, 0.04],
    [0.5, 0.02],
    [0.5, -0.06],
    [0.42, -0.09],
    [0.0, -0.09],
  ];
  const geo = new THREE.LatheGeometry(
    profile.map(([r, y]) => new THREE.Vector2(r, y)),
    96
  );
  geo.computeVertexNormals();
  return geo;
}

export const EspressoCup3D: React.FC<EspressoCup3DProps> = ({
  scale = 1,
  position = [0, 0, 0],
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const steamRef = useRef<THREE.Points>(null);
  const cremaRef = useRef<THREE.Mesh>(null);

  const cupGeometry = useMemo(() => createCupGeometry(), []);
  const saucerGeometry = useMemo(() => createSaucerGeometry(), []);
  const steamSprite = useMemo(() => createSoftSprite(), []);

  // Tiger-striped crema, drawn in polar space so the swirl follows the cup
  const cremaTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const grad = ctx.createRadialGradient(512, 512, 30, 512, 512, 512);
      grad.addColorStop(0, '#E8B276');
      grad.addColorStop(0.4, '#C98B4E');
      grad.addColorStop(0.75, '#8C4F23');
      grad.addColorStop(0.94, '#3E220E');
      grad.addColorStop(1, '#1C0F05');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Swirled tiger striping: arcs that spiral out from the centre
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 26; i++) {
        const startA = Math.random() * Math.PI * 2;
        const r0 = 60 + Math.random() * 300;
        ctx.beginPath();
        for (let s = 0; s <= 40; s++) {
          const t = s / 40;
          const a = startA + t * (1.2 + Math.random() * 0.02);
          const r = r0 + t * 120;
          const px = 512 + Math.cos(a) * r;
          const py = 512 + Math.sin(a) * r;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = `rgba(245, 222, 190, ${0.05 + Math.random() * 0.12})`;
        ctx.lineWidth = 10 + Math.random() * 30;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
      ctx.restore();

      // Micro froth bubbles, denser toward the rim as in a real shot
      for (let b = 0; b < 900; b++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * 470;
        const bx = 512 + Math.cos(a) * r;
        const by = 512 + Math.sin(a) * r;
        ctx.fillStyle =
          Math.random() > 0.45 ? 'rgba(255, 244, 228, 0.30)' : 'rgba(60, 32, 12, 0.35)';
        ctx.beginPath();
        ctx.arc(bx, by, Math.random() * 2.2 + 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Darker meniscus ring where the crema meets the porcelain
      const ring = ctx.createRadialGradient(512, 512, 430, 512, 512, 512);
      ring.addColorStop(0, 'rgba(0,0,0,0)');
      ring.addColorStop(1, 'rgba(20, 10, 4, 0.75)');
      ctx.fillStyle = ring;
      ctx.fillRect(0, 0, 1024, 1024);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  const steamCount = 110;
  const steamGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(steamCount * 3);
    const seeds = new Float32Array(steamCount);

    for (let i = 0; i < steamCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.32;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = 0.45 + Math.random() * 1.5;
      pos[i * 3 + 2] = Math.sin(a) * r;
      seeds[i] = Math.random() * 10;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('seed', new THREE.BufferAttribute(seeds, 1));
    return geo;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.22;
    }

    if (cremaRef.current) {
      cremaRef.current.rotation.z = t * 0.06;
    }

    if (steamRef.current) {
      const pos = steamRef.current.geometry.attributes.position;
      const seed = steamRef.current.geometry.attributes.seed;

      for (let i = 0; i < steamCount; i++) {
        const s = seed.getX(i);
        let y = pos.getY(i) + delta * (0.26 + (s % 1) * 0.22);
        // Vapour widens and drifts as it rises
        const spread = 1 + (y - 0.45) * 0.5;
        const x = Math.sin(t * 0.9 + s * 3.1) * 0.06 * spread;
        const z = Math.cos(t * 0.7 + s * 2.3) * 0.06 * spread;

        if (y > 2.1) {
          y = 0.45;
        }
        pos.setXYZ(i, x + Math.cos(s * 6.28) * 0.12, y, z + Math.sin(s * 6.28) * 0.12);
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Bone porcelain body — thin-walled lathe with a real interior */}
      <mesh geometry={cupGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#F7F1E6"
          roughness={0.16}
          metalness={0}
          clearcoat={0.85}
          clearcoatRoughness={0.08}
          envMapIntensity={1.1}
          sheen={0.25}
          sheenColor={new THREE.Color('#FFE9CF')}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 24K gold rim line */}
      <mesh position={[0, 0.655, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.903, 0.012, 16, 96]} />
        <meshStandardMaterial color="#E5B871" roughness={0.18} metalness={1} envMapIntensity={1.8} />
      </mesh>

      {/* Demitasse handle */}
      <mesh position={[0.86, 0.24, 0]} rotation={[0, 0, Math.PI / 5.5]} castShadow>
        <torusGeometry args={[0.3, 0.062, 24, 48, Math.PI * 1.15]} />
        <meshPhysicalMaterial
          color="#F7F1E6"
          roughness={0.16}
          metalness={0}
          clearcoat={0.85}
          clearcoatRoughness={0.08}
          envMapIntensity={1.1}
        />
      </mesh>

      {/* Saucer */}
      <mesh geometry={saucerGeometry} position={[0, -0.42, 0]} receiveShadow castShadow>
        <meshPhysicalMaterial
          color="#F7F1E6"
          roughness={0.18}
          metalness={0}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          envMapIntensity={1.0}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, -0.24, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.009, 12, 96]} />
        <meshStandardMaterial color="#E5B871" roughness={0.2} metalness={1} envMapIntensity={1.6} />
      </mesh>

      {/* Crema surface, sunk just below the rim */}
      <mesh ref={cremaRef} position={[0, 0.44, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.815, 96]} />
        <meshPhysicalMaterial
          map={cremaTexture}
          roughness={0.32}
          metalness={0}
          clearcoat={0.7}
          clearcoatRoughness={0.22}
          envMapIntensity={0.7}
        />
      </mesh>

      {/* Rising steam */}
      <points ref={steamRef} geometry={steamGeo}>
        <pointsMaterial
          size={0.3}
          map={steamSprite}
          color="#FFF6EA"
          transparent
          opacity={0.16}
          depthWrite={false}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
