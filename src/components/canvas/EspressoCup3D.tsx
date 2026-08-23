import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EspressoCup3DProps {
  scale?: number;
  position?: [number, number, number];
}

export const EspressoCup3D: React.FC<EspressoCup3DProps> = ({
  scale = 1,
  position = [0, 0, 0],
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const steamRef = useRef<THREE.Points>(null);
  const cremaRef = useRef<THREE.Mesh>(null);

  // 1. High-Resolution Photorealistic Tiger-Striped Espresso Crema Texture
  const cremaTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Golden hazelnut / mahogany base
      const grad = ctx.createRadialGradient(512, 512, 40, 512, 512, 512);
      grad.addColorStop(0, '#EBB67D');
      grad.addColorStop(0.35, '#D49B5B');
      grad.addColorStop(0.7, '#8C4F23');
      grad.addColorStop(0.92, '#4A2810');
      grad.addColorStop(1, '#241206');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Natural irregular tiger mottling (striations & crema swirls)
      ctx.save();
      for (let i = 0; i < 48; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * 380;
        const cx = 512 + Math.cos(angle) * dist;
        const cy = 512 + Math.sin(angle) * dist;
        const rw = 20 + Math.random() * 80;
        const rh = 10 + Math.random() * 35;

        const mGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, rw);
        mGrad.addColorStop(0, 'rgba(250, 240, 225, 0.45)');
        mGrad.addColorStop(0.6, 'rgba(212, 155, 91, 0.25)');
        mGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = mGrad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rw, rh, angle + 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Microscopic glossy froth bubbles
      for (let b = 0; b < 600; b++) {
        const bx = Math.random() * 1024;
        const by = Math.random() * 1024;
        const d = Math.hypot(bx - 512, by - 512);
        if (d < 460) {
          ctx.fillStyle = Math.random() > 0.4 ? 'rgba(255, 255, 255, 0.35)' : 'rgba(74, 40, 16, 0.4)';
          ctx.beginPath();
          ctx.arc(bx, by, Math.random() * 2.5 + 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  // 2. Rising Soft Steam Particle Cloud
  const steamCount = 80;
  const steamGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(steamCount * 3);

    for (let i = 0; i < steamCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 1] = 0.5 + Math.random() * 1.4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.35) * 0.18;
    }

    // Crema gentle fluid swirl
    if (cremaRef.current) {
      cremaRef.current.rotation.z = t * 0.05;
    }

    // Steam physics
    if (steamRef.current) {
      const pos = steamRef.current.geometry.attributes.position;
      for (let i = 0; i < steamCount; i++) {
        let y = pos.getY(i) + delta * 0.38;
        let x = pos.getX(i) + Math.sin(t * 1.5 + i) * 0.002;
        if (y > 1.9) {
          y = 0.5;
          x = (Math.random() - 0.5) * 0.45;
        }
        pos.setY(i, y);
        pos.setX(i, x);
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* 1. Ceramic Bone Porcelain Cup Body */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.92, 0.58, 0.92, 48, 1, true]} />
        <meshPhysicalMaterial
          color="#FAF4EB"
          roughness={0.12}
          metalness={0.04}
          clearcoat={0.6}
          clearcoatRoughness={0.1}
          reflectivity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. 24K Electroplated Gold Rim Line */}
      <mesh position={[0, 0.66, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.92, 0.025, 20, 48]} />
        <meshStandardMaterial
          color="#D49B5B"
          roughness={0.12}
          metalness={0.92}
          envMapIntensity={2.0}
        />
      </mesh>

      {/* 3. Ceramic Demitasse Handle */}
      <mesh position={[0.88, 0.22, 0]} rotation={[0, 0, Math.PI / 5.5]}>
        <torusGeometry args={[0.32, 0.075, 20, 32, Math.PI * 1.1]} />
        <meshPhysicalMaterial
          color="#FAF4EB"
          roughness={0.12}
          metalness={0.04}
          clearcoat={0.6}
        />
      </mesh>

      {/* 4. Ceramic Heavy Saucer Base */}
      <mesh position={[0, -0.28, 0]} receiveShadow>
        <cylinderGeometry args={[1.55, 1.15, 0.1, 48]} />
        <meshPhysicalMaterial
          color="#FAF4EB"
          roughness={0.12}
          metalness={0.04}
          clearcoat={0.6}
        />
      </mesh>
      <mesh position={[0, -0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.52, 0.018, 16, 48]} />
        <meshStandardMaterial
          color="#D49B5B"
          roughness={0.12}
          metalness={0.92}
        />
      </mesh>

      {/* 5. Photorealistic Tiger-Striped Crema Liquid Surface */}
      <mesh ref={cremaRef} position={[0, 0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.84, 48]} />
        <meshPhysicalMaterial
          map={cremaTexture}
          roughness={0.25}
          metalness={0.08}
          clearcoat={0.5}
          clearcoatRoughness={0.15}
          reflectivity={0.9}
        />
      </mesh>

      {/* 6. Rising Steam Particles */}
      <points ref={steamRef} geometry={steamGeo}>
        <pointsMaterial
          size={0.055}
          color="#FAF4EB"
          transparent
          opacity={0.32}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
