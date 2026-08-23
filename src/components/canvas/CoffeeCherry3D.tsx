import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CoffeeCherry3DProps {
  position?: [number, number, number];
  scale?: number;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

export const CoffeeCherry3D: React.FC<CoffeeCherry3DProps> = ({
  position = [0, 0, 0],
  scale = 1,
  onPointerOver,
  onPointerOut,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const cherryRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.y += delta * 0.25;
      groupRef.current.position.y = position[1] + Math.sin(t * 1.3) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Ruby Ripe Cherry Body */}
      <mesh
        ref={cherryRef}
        castShadow
        receiveShadow
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        <sphereGeometry args={[1.2, 48, 48]} />
        <meshPhysicalMaterial
          color="#9E1B1B"
          roughness={0.18}
          metalness={0.12}
          emissive="#4A0000"
          emissiveIntensity={0.2}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Internal Glowing Seed/Parchment (visible in translucent x-ray moments) */}
      <mesh scale={[0.6, 0.8, 0.5]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#E8D8C0"
          emissive="#C6955B"
          emissiveIntensity={0.6}
          roughness={0.5}
        />
      </mesh>

      {/* Stem / Calyx */}
      <mesh position={[0, 1.25, 0]} rotation={[0.1, 0, 0.15]}>
        <cylinderGeometry args={[0.04, 0.06, 0.6, 16]} />
        <meshStandardMaterial color="#4A5826" roughness={0.7} />
      </mesh>

      {/* Atmospheric Point Light inside cherry */}
      <pointLight color="#E76F51" intensity={2.5} distance={5} />
    </group>
  );
};
