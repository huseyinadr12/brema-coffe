import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GrinderParticles3DProps {
  progress?: number;
  scale?: number;
  position?: [number, number, number];
}

export const GrinderParticles3D: React.FC<GrinderParticles3DProps> = ({
  progress = 0,
  scale = 1,
  position = [0, 0, 0],
}) => {
  const burrRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // High-Density Particle System for Ground Coffee
  const particleCount = 1200;
  const { geometry, particleData } = useMemo(() => {
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);
    const pData: {
      angle: number;
      radius: number;
      speed: number;
      y: number;
      fallSpeed: number;
    }[] = [];

    const baseColor1 = new THREE.Color('#3B2215');
    const baseColor2 = new THREE.Color('#6E4228');
    const baseColor3 = new THREE.Color('#C6955B');

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 1.2;
      const y = (Math.random() - 0.5) * 3.5;

      posArray[i * 3] = Math.cos(angle) * radius;
      posArray[i * 3 + 1] = y;
      posArray[i * 3 + 2] = Math.sin(angle) * radius;

      const choice = Math.random();
      const col = choice > 0.6 ? baseColor3 : choice > 0.2 ? baseColor2 : baseColor1;
      colorArray[i * 3] = col.r;
      colorArray[i * 3 + 1] = col.g;
      colorArray[i * 3 + 2] = col.b;

      pData.push({
        angle,
        radius,
        speed: 2.0 + Math.random() * 3.0,
        y,
        fallSpeed: 1.5 + Math.random() * 2.5,
      });
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    return { geometry: geom, particleData: pData };
  }, []);

  useFrame((state, delta) => {
    // Spin conical burr
    if (burrRef.current) {
      burrRef.current.rotation.y += delta * 4.5;
    }

    // Swirl particles in vortex cone
    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const p = particleData[i];
        p.angle += delta * p.speed;
        p.y -= delta * p.fallSpeed;

        // Conical funnel shape (narrower at bottom)
        const coneRadius = Math.max(0.1, (p.y + 2.0) * 0.45);
        const curRadius = Math.min(p.radius, coneRadius);

        pos[i * 3] = Math.cos(p.angle) * curRadius;
        pos[i * 3 + 1] = p.y;
        pos[i * 3 + 2] = Math.sin(p.angle) * curRadius;

        // Reset particle to top when it reaches bottom
        if (p.y < -2.2) {
          p.y = 1.8;
          p.radius = Math.random() * 1.4;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Precision Steel Conical Burr Chamber */}
      <group ref={burrRef} position={[0, 1.2, 0]}>
        {/* Outer Ring Burr */}
        <mesh>
          <cylinderGeometry args={[1.5, 0.9, 1.2, 24, 1, true]} />
          <meshStandardMaterial
            color="#C0C0C0"
            metalness={0.9}
            roughness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Inner Conical Burr with Helical Cutting Flutes */}
        <mesh position={[0, 0, 0]}>
          <coneGeometry args={[0.75, 1.1, 16]} />
          <meshStandardMaterial
            color="#D8D8D8"
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>
      </group>

      {/* Volumetric Ground Coffee Vortex Particles */}
      <points ref={particlesRef} geometry={geometry}>
        <pointsMaterial
          size={0.045}
          vertexColors
          transparent
          opacity={0.95}
        />
      </points>
    </group>
  );
};
