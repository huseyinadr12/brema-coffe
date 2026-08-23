import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RoasterDrum3DProps {
  intensity?: number;
  scale?: number;
  position?: [number, number, number];
}

export const RoasterDrum3D: React.FC<RoasterDrum3DProps> = ({
  intensity = 1,
  scale = 1,
  position = [0, 0, 0],
}) => {
  const drumGroupRef = useRef<THREE.Group>(null);
  const vanesRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Generate Rising Embers & Roasted Bean Particles
  const particleCount = 120;
  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1.8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1.6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.8;
      speeds[i] = 0.5 + Math.random() * 1.2;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
    return geo;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Rotate internal vanes with realistic constant angular velocity
    if (vanesRef.current) {
      vanesRef.current.rotation.z += delta * 1.8;
    }

    // Subtle drum casing vibration
    if (drumGroupRef.current) {
      drumGroupRef.current.rotation.y = Math.sin(t * 0.4) * 0.15;
      drumGroupRef.current.position.y = position[1] + Math.sin(t * 1.8) * 0.02;
    }

    // Animate rising thermal particles
    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position;
      const speed = particlesRef.current.geometry.attributes.speed;

      for (let i = 0; i < particleCount; i++) {
        let y = pos.getY(i) + delta * speed.getX(i) * 0.8;
        if (y > 1.2) y = -1.2;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group ref={drumGroupRef} position={position} scale={scale}>
      {/* 1. Heavy Cast-Iron Outer Cylinder (Brushed Bronze / Iron) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 2.2, 36, 1, true]} />
        <meshStandardMaterial
          color="#3A281E"
          roughness={0.6}
          metalness={0.45}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Reinforced Flange Rings */}
      <mesh position={[0, 0, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.52, 0.06, 16, 36]} />
        <meshStandardMaterial color="#B87D3B" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0, -1.1]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.52, 0.06, 16, 36]} />
        <meshStandardMaterial color="#B87D3B" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* 3. Central Observation Sight Glass & Bezel */}
      <mesh position={[0, 0, 1.12]}>
        <circleGeometry args={[0.45, 32]} />
        <meshStandardMaterial
          color="#D9A066"
          roughness={0.1}
          transparent
          opacity={0.35}
        />
      </mesh>
      <mesh position={[0, 0, 1.13]}>
        <ringGeometry args={[0.42, 0.52, 32]} />
        <meshStandardMaterial color="#B87D3B" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* 4. Internal Spinning Helical Mixing Vanes */}
      <group ref={vanesRef}>
        {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
          <group key={i} rotation={[0, 0, angle]}>
            <mesh position={[0.7, 0, 0]}>
              <boxGeometry args={[0.08, 0.45, 1.8]} />
              <meshStandardMaterial color="#7A4B2E" roughness={0.5} metalness={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 5. Glowing Thermal Particle Cloud */}
      <points ref={particlesRef} geometry={particleGeo}>
        <pointsMaterial
          size={0.045}
          color="#D9A066"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
