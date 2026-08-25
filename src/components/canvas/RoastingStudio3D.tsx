import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RoastingStudio3DProps {
  intensity?: number;
  scale?: number;
  position?: [number, number, number];
}

const bronze = '#B8783F';
const iron = '#26312E';
const ironLight = '#41504B';
const cream = '#E7DDCE';

export const RoastingStudio3D: React.FC<RoastingStudio3DProps> = ({
  intensity = 1,
  scale = 1,
  position = [0, 0, 0],
}) => {
  const machineRef = useRef<THREE.Group>(null);
  const drumRef = useRef<THREE.Group>(null);
  const beansRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  const beans = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        radius: 0.18 + (index % 4) * 0.075,
        offset: (index / 12) * Math.PI * 2,
        scale: 0.055 + (index % 3) * 0.01,
      })),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (machineRef.current) {
      machineRef.current.rotation.y = -0.2 + Math.sin(t * 0.24) * 0.035;
    }

    if (drumRef.current) {
      drumRef.current.rotation.z -= delta * 0.34;
    }

    beansRef.current?.children.forEach((bean, index) => {
      const seed = beans[index];
      const angle = seed.offset + t * (0.7 + (index % 3) * 0.08);
      bean.position.set(
        Math.cos(angle) * seed.radius,
        Math.sin(angle) * seed.radius * 0.62 - 0.02,
        0.055
      );
      bean.rotation.z = angle * 1.8;
    });

    if (glowRef.current) {
      glowRef.current.intensity =
        (0.92 + Math.sin(t * 5.3) * 0.08 + Math.sin(t * 11.7) * 0.05) * intensity;
    }
  });

  return (
    <group ref={machineRef} position={position} scale={scale} rotation={[-0.03, -0.2, 0]}>
      {/* Feet and lower chassis */}
      {[-0.92, 0.92].map((x) => (
        <group key={x}>
          <mesh position={[x, -1.68, 0]} castShadow>
            <boxGeometry args={[0.18, 1.08, 0.2]} />
            <meshStandardMaterial color={iron} roughness={0.55} metalness={0.58} />
          </mesh>
          <mesh position={[x, -2.2, 0.08]} castShadow>
            <boxGeometry args={[0.42, 0.12, 0.58]} />
            <meshStandardMaterial color="#18221F" roughness={0.68} metalness={0.45} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, -1.35, -0.18]} castShadow receiveShadow>
        <boxGeometry args={[2.45, 1.72, 1.45]} />
        <meshStandardMaterial color={iron} roughness={0.5} metalness={0.52} envMapIntensity={1.05} />
      </mesh>

      {/* Main drum housing and animated face */}
      <group position={[-0.28, 0.28, 0.63]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[1.22, 1.22, 1.35, 64]} />
          <meshStandardMaterial color={ironLight} roughness={0.48} metalness={0.62} envMapIntensity={1.2} />
        </mesh>

        <mesh position={[0, 0, 0.72]} castShadow>
          <circleGeometry args={[1.2, 64]} />
          <meshStandardMaterial color="#31403B" roughness={0.52} metalness={0.58} />
        </mesh>

        <mesh position={[0, 0, 0.75]}>
          <torusGeometry args={[1.08, 0.095, 20, 64]} />
          <meshStandardMaterial color={bronze} roughness={0.3} metalness={0.82} envMapIntensity={1.4} />
        </mesh>

        <group ref={drumRef} position={[0, 0, 0.79]}>
          {Array.from({ length: 8 }).map((_, index) => {
            const angle = (index / 8) * Math.PI * 2;
            return (
              <mesh key={index} position={[Math.cos(angle) * 0.91, Math.sin(angle) * 0.91, 0]}>
                <sphereGeometry args={[0.04, 10, 10]} />
                <meshStandardMaterial color={cream} roughness={0.35} metalness={0.68} />
              </mesh>
            );
          })}
        </group>

        {/* Sight glass */}
        <mesh position={[0, 0.08, 0.805]}>
          <circleGeometry args={[0.46, 48]} />
          <meshStandardMaterial
            color="#371A10"
            emissive="#A7441E"
            emissiveIntensity={0.2 * intensity}
            roughness={0.78}
          />
        </mesh>

        <group ref={beansRef} position={[0, 0.08, 0.83]}>
          {beans.map((bean, index) => (
            <mesh key={index} scale={[bean.scale * 1.45, bean.scale, bean.scale * 0.72]}>
              <sphereGeometry args={[1, 10, 8]} />
              <meshStandardMaterial color="#A55F35" roughness={0.72} />
            </mesh>
          ))}
        </group>

        <mesh position={[0, 0.08, 0.86]}>
          <ringGeometry args={[0.46, 0.55, 48]} />
          <meshStandardMaterial color={bronze} roughness={0.26} metalness={0.86} />
        </mesh>

        <pointLight ref={glowRef} position={[0, 0.08, 1.05]} color="#F08A4B" distance={2.4} decay={2} />
      </group>

      {/* Bean hopper */}
      <group position={[-0.3, 2.02, -0.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.34, 0.74, 0.9, 40]} />
          <meshStandardMaterial color={cream} roughness={0.46} metalness={0.36} envMapIntensity={1.05} />
        </mesh>
        <mesh position={[0, 0.53, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.1, 40]} />
          <meshStandardMaterial color={bronze} roughness={0.28} metalness={0.82} />
        </mesh>
        <mesh position={[0, -0.58, 0]}>
          <cylinderGeometry args={[0.13, 0.24, 0.32, 28]} />
          <meshStandardMaterial color={iron} roughness={0.5} metalness={0.58} />
        </mesh>
      </group>

      {/* Control panel */}
      <group position={[1.42, 0.42, 0.48]} rotation={[0, -0.12, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.72, 1.5, 0.34]} />
          <meshStandardMaterial color="#E9E0D2" roughness={0.5} metalness={0.28} />
        </mesh>
        <mesh position={[0, 0.38, 0.18]}>
          <boxGeometry args={[0.48, 0.34, 0.035]} />
          <meshStandardMaterial color="#182A25" emissive="#2D8A70" emissiveIntensity={0.34} />
        </mesh>
        {[-0.22, 0, 0.22].map((x, index) => (
          <mesh key={x} position={[x, -0.18, 0.2]}>
            <cylinderGeometry args={[0.07, 0.07, 0.055, 20]} />
            <meshStandardMaterial
              color={index === 1 ? '#C86442' : '#596C64'}
              roughness={0.42}
              metalness={0.38}
            />
          </mesh>
        ))}
      </group>

      {/* Cooling tray */}
      <group position={[0.55, -1.16, 0.95]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.86, 0.74, 0.26, 48]} />
          <meshStandardMaterial color={cream} roughness={0.46} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.145, 0]}>
          <cylinderGeometry args={[0.66, 0.66, 0.025, 48]} />
          <meshStandardMaterial color="#283A34" roughness={0.65} metalness={0.42} />
        </mesh>
        {Array.from({ length: 12 }).map((_, index) => {
          const angle = (index / 12) * Math.PI * 2;
          return (
            <mesh key={index} position={[Math.cos(angle) * 0.45, 0.17, Math.sin(angle) * 0.45]} rotation={[0, -angle, 0]}>
              <boxGeometry args={[0.34, 0.025, 0.03]} />
              <meshStandardMaterial color={bronze} roughness={0.34} metalness={0.72} />
            </mesh>
          );
        })}
      </group>

      {/* Exhaust stack and sampling trier */}
      <mesh position={[-1.1, 1.72, -0.56]} castShadow>
        <cylinderGeometry args={[0.2, 0.26, 1.72, 28]} />
        <meshStandardMaterial color={ironLight} roughness={0.52} metalness={0.58} />
      </mesh>
      <group position={[-0.95, 0.08, 1.48]} rotation={[0, 0, -0.35]}>
        <mesh>
          <cylinderGeometry args={[0.055, 0.055, 0.82, 16]} />
          <meshStandardMaterial color={bronze} roughness={0.28} metalness={0.86} />
        </mesh>
        <mesh position={[0, 0.46, 0]}>
          <sphereGeometry args={[0.11, 18, 18]} />
          <meshStandardMaterial color="#3A2419" roughness={0.68} />
        </mesh>
      </group>
    </group>
  );
};
