import React, { useMemo, useRef } from 'react';
import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ORIGINS_DATA } from '../../data/origins';
import { OriginData } from '../../types';

interface CoffeeAtlas3DProps {
  selectedOrigin?: OriginData;
  onSelectOrigin?: (origin: OriginData) => void;
  scale?: number;
  position?: [number, number, number];
}

const RADIUS = 2;

// Simplified geographic silhouettes keep the globe recognisably terrestrial
// without generating multi-megabyte procedural textures on the main thread.
const CONTINENTS: [number, number][][] = [
  [
    [-165, 66], [-138, 72], [-105, 68], [-78, 54], [-66, 45], [-82, 25],
    [-98, 19], [-118, 32], [-128, 50], [-150, 58], [-165, 66],
  ],
  [
    [-81, 10], [-68, 6], [-48, -4], [-37, -18], [-53, -34], [-66, -55],
    [-75, -38], [-71, -18], [-81, 10],
  ],
  [
    [-17, 34], [8, 37], [32, 31], [50, 10], [39, -12], [28, -35],
    [12, -28], [2, -5], [-12, 8], [-17, 34],
  ],
  [
    [-10, 36], [12, 58], [44, 64], [72, 72], [118, 68], [160, 57],
    [132, 42], [112, 20], [94, 8], [70, 22], [45, 32], [20, 42], [-10, 36],
  ],
  [
    [112, -12], [135, -10], [153, -24], [146, -39], [122, -35], [112, -12],
  ],
  [
    [-51, 61], [-28, 69], [-22, 81], [-47, 83], [-60, 72], [-51, 61],
  ],
];

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export const CoffeeAtlas3D: React.FC<CoffeeAtlas3DProps> = ({
  selectedOrigin,
  onSelectOrigin,
  scale = 1,
  position = [0, 0, 0],
}) => {
  const globeRef = useRef<THREE.Group>(null);
  const travellersRef = useRef<THREE.Group>(null);
  const markerRef = useRef<THREE.Group>(null);
  const dragging = useRef(false);
  const pointer = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0.18, y: -0.55 });

  const istanbul = useMemo(() => latLngToVector3(41.0082, 28.9784, RADIUS + 0.025), []);
  const continentLines = useMemo(
    () =>
      CONTINENTS.map((continent) =>
        continent.map(([lng, lat]) => {
          const point = latLngToVector3(lat, lng, RADIUS + 0.018);
          return [point.x, point.y, point.z] as [number, number, number];
        })
      ),
    []
  );

  const routes = useMemo(
    () =>
      ORIGINS_DATA.map((origin, index) => {
        const start = latLngToVector3(origin.lat, origin.lng, RADIUS + 0.025);
        const middle = start
          .clone()
          .add(istanbul)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(RADIUS + 0.62 + start.distanceTo(istanbul) * 0.08);
        const curve = new THREE.QuadraticBezierCurve3(start, middle, istanbul);
        const normal = start.clone().normalize();
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          normal
        );

        return {
          origin,
          start,
          curve,
          quaternion,
          phase: index / ORIGINS_DATA.length,
          points: curve.getPoints(36).map((point) => [point.x, point.y, point.z] as [number, number, number]),
        };
      }),
    [istanbul]
  );

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (globeRef.current) {
      if (!dragging.current) target.current.y += delta * 0.035;
      globeRef.current.rotation.x = THREE.MathUtils.damp(
        globeRef.current.rotation.x,
        THREE.MathUtils.clamp(target.current.x, -0.7, 0.7),
        7,
        delta
      );
      globeRef.current.rotation.y = THREE.MathUtils.damp(
        globeRef.current.rotation.y,
        target.current.y,
        7,
        delta
      );
    }

    travellersRef.current?.children.forEach((child, index) => {
      const route = routes[index];
      const progress = (t * 0.07 + route.phase) % 1;
      child.position.copy(route.curve.getPointAt(progress));
      child.scale.setScalar(0.75 + Math.sin(progress * Math.PI) * 0.55);
    });

    markerRef.current?.children.forEach((child) => {
      const selected = child.userData.originId === selectedOrigin?.id;
      const pulse = selected ? 1 + Math.sin(t * 3.2) * 0.15 : 1;
      child.scale.setScalar(pulse);
    });
  });

  return (
    <group position={position} scale={scale}>
      <group
        ref={globeRef}
        onPointerDown={(event) => {
          event.stopPropagation();
          dragging.current = true;
          pointer.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerMove={(event) => {
          if (!dragging.current) return;
          target.current.y += (event.clientX - pointer.current.x) * 0.007;
          target.current.x += (event.clientY - pointer.current.y) * 0.007;
          pointer.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerLeave={() => {
          dragging.current = false;
        }}
      >
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[RADIUS, 64, 48]} />
          <meshPhysicalMaterial
            color="#24443A"
            roughness={0.72}
            metalness={0.05}
            clearcoat={0.16}
            clearcoatRoughness={0.72}
            emissive="#10241E"
            emissiveIntensity={0.2}
            envMapIntensity={0.7}
          />
        </mesh>

        <mesh scale={1.003}>
          <sphereGeometry args={[RADIUS, 28, 18]} />
          <meshBasicMaterial
            color="#D6C2A5"
            wireframe
            transparent
            opacity={0.13}
            depthWrite={false}
          />
        </mesh>

        {continentLines.map((points, index) => (
          <Line
            key={index}
            points={points}
            color="#F0D2AA"
            lineWidth={0.75}
            transparent
            opacity={0.48}
            depthWrite={false}
          />
        ))}

        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[RADIUS + 0.035, 0.012, 8, 128]} />
          <meshBasicMaterial color="#E9A76F" transparent opacity={0.7} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.57]}>
          <torusGeometry args={[RADIUS + 0.045, 0.008, 8, 128]} />
          <meshBasicMaterial color="#F4D4AD" transparent opacity={0.26} />
        </mesh>

        {routes.map(({ origin, points }) => {
          const selected = selectedOrigin?.id === origin.id;
          return (
            <Line
              key={origin.id}
              points={points}
              color={selected ? '#FFF1D6' : '#D98255'}
              lineWidth={selected ? 2.2 : 0.85}
              transparent
              opacity={selected ? 0.96 : 0.34}
              depthWrite={false}
            />
          );
        })}

        <group ref={travellersRef}>
          {routes.map(({ origin }) => (
            <mesh key={origin.id}>
              <sphereGeometry args={[0.035, 10, 10]} />
              <meshBasicMaterial color="#FFF1D6" />
            </mesh>
          ))}
        </group>

        <group position={istanbul}>
          <mesh>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#FFF7EA" />
          </mesh>
          <mesh scale={2.2}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#D98255" transparent opacity={0.34} depthWrite={false} />
          </mesh>
        </group>

        <group ref={markerRef}>
          {routes.map(({ origin, start, quaternion }) => {
            const selected = selectedOrigin?.id === origin.id;
            return (
              <group
                key={origin.id}
                position={start}
                quaternion={quaternion}
                userData={{ originId: origin.id }}
              >
                <mesh
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectOrigin?.(origin);
                  }}
                  onPointerOver={(event) => {
                    event.stopPropagation();
                    document.body.style.cursor = 'pointer';
                  }}
                  onPointerOut={() => {
                    document.body.style.cursor = '';
                  }}
                >
                  <circleGeometry args={[selected ? 0.085 : 0.06, 24]} />
                  <meshBasicMaterial color={selected ? '#FFF1D6' : origin.color} side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[0, 0, -0.004]}>
                  <ringGeometry args={[0.1, selected ? 0.18 : 0.14, 28]} />
                  <meshBasicMaterial
                    color={selected ? '#E9A76F' : origin.color}
                    transparent
                    opacity={selected ? 0.55 : 0.24}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                  />
                </mesh>
              </group>
            );
          })}
        </group>
      </group>

      <mesh scale={2.16}>
        <sphereGeometry args={[1, 40, 32]} />
        <meshBasicMaterial
          color="#7BA897"
          transparent
          opacity={0.055}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
