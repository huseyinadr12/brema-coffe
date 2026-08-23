import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EspressoPortafilter3DProps {
  progress?: number;
  scale?: number;
  position?: [number, number, number];
}

export const EspressoPortafilter3D: React.FC<EspressoPortafilter3DProps> = ({
  progress = 0,
  scale = 1,
  position = [0, 0, 0],
}) => {
  const streamRef = useRef<THREE.Mesh>(null);
  const dropletRef = useRef<THREE.Mesh>(null);

  // Viscous fluid texture for the extraction stream
  const fluidTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Golden hazelnut caramel tiger stripes
      const grad = ctx.createLinearGradient(0, 0, 256, 0);
      grad.addColorStop(0, '#5C3317');
      grad.addColorStop(0.3, '#C6955B');
      grad.addColorStop(0.6, '#E8D8C0');
      grad.addColorStop(0.85, '#8A5A34');
      grad.addColorStop(1, '#5C3317');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 512);

      // Micro crema bubbles & flow streaks
      ctx.fillStyle = 'rgba(255, 248, 235, 0.4)';
      for (let i = 0; i < 400; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 512;
        const w = Math.random() * 2.5 + 1;
        const h = Math.random() * 25 + 10;
        ctx.fillRect(x, y, w, h);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Animate fluid stream texture scrolling downward
    fluidTexture.offset.y -= delta * 2.5;

    // Animate falling single droplet
    if (dropletRef.current) {
      const dropCycle = (t * 2.2) % 1; // 0 to 1
      dropletRef.current.position.y = -1.2 - dropCycle * 1.8;
      dropletRef.current.scale.setScalar(0.8 + Math.sin(dropCycle * Math.PI) * 0.3);
      dropletRef.current.visible = dropCycle < 0.95;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Portafilter Ring Body (Chrome / Stainless Steel) */}
      <group position={[0, 0.6, 0]}>
        {/* Main Basket Ring */}
        <mesh>
          <cylinderGeometry args={[1.35, 1.3, 0.65, 36]} />
          <meshStandardMaterial
            color="#E0E0E0"
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>

        {/* Laser Filter Mesh (Bottomless bottom) */}
        <mesh position={[0, -0.31, 0]}>
          <cylinderGeometry args={[1.22, 1.22, 0.05, 32]} />
          <meshStandardMaterial
            color="#2A1C14"
            roughness={0.7}
            metalness={0.4}
          />
        </mesh>

        {/* Precision Portafilter Wings / Ears */}
        <mesh position={[1.4, 0.15, 0]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.3, 0.2, 0.4]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[-1.4, 0.15, 0]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.3, 0.2, 0.4]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Luxury Walnut Wood Handle */}
        <group position={[0, 0.1, 1.35]} rotation={[0.08, 0, 0]}>
          {/* Chrome Neck */}
          <mesh position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.2, 0.8, 24]} />
            <meshStandardMaterial color="#E0E0E0" metalness={0.95} roughness={0.15} />
          </mesh>

          {/* Ergonomic Turned Walnut Grip */}
          <mesh position={[0, 0, 1.8]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.26, 0.32, 2.0, 24]} />
            <meshStandardMaterial
              color="#3B2215"
              roughness={0.4}
              metalness={0.05}
            />
          </mesh>

          {/* End Cap Brass Ring */}
          <mesh position={[0, 0, 2.85]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.1, 24]} />
            <meshStandardMaterial color="#C6955B" metalness={0.8} roughness={0.25} />
          </mesh>
        </group>
      </group>

      {/* Viscous 9-Bar Extraction Espresso Stream */}
      <group position={[0, 0.25, 0]}>
        {/* Golden Tapered Stream Ribbon */}
        <mesh ref={streamRef} position={[0, -0.7, 0]}>
          <cylinderGeometry args={[0.08, 0.16, 1.5, 24, 1, true]} />
          <meshStandardMaterial
            map={fluidTexture}
            color="#FFD699"
            roughness={0.1}
            metalness={0.2}
            transparent
            opacity={0.95}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Suspended Single Droplet with surface tension */}
        <mesh ref={dropletRef} position={[0, -1.5, 0]}>
          <sphereGeometry args={[0.1, 24, 24]} />
          <meshStandardMaterial
            color="#8A5A34"
            emissive="#C6955B"
            emissiveIntensity={0.6}
            roughness={0.05}
            metalness={0.1}
          />
        </mesh>
      </group>
    </group>
  );
};
