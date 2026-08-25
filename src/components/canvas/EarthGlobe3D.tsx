import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { ORIGINS_DATA } from '../../data/origins';
import { OriginData } from '../../types';
import { earthTextures, atmosphereMaterial } from './EarthTextures';
import { cached } from './assetCache';

interface EarthGlobe3DProps {
  selectedOrigin?: OriginData;
  onSelectOrigin?: (origin: OriginData) => void;
  scale?: number;
  position?: [number, number, number];
}

const GLOBE_RADIUS = 2.0;

export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export const EarthGlobe3D: React.FC<EarthGlobe3DProps> = ({
  selectedOrigin,
  onSelectOrigin,
  scale = 1,
  position = [0, 0, 0],
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const travellersRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const previousPointerPos = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0.25, y: -0.6 });

  const { map, normalMap, roughnessMap, clouds } = earthTextures();
  const atmosphere = cached('earth:atmosphere', () => atmosphereMaterial('#6FB4F0', 3.2, 1.15));
  const haze = cached('earth:haze', () => atmosphereMaterial('#2C6EA8', 2.0, 0.35));

  const istanbulPos = useMemo(() => latLngToVector3(41.0082, 28.9784, GLOBE_RADIUS), []);

  const flightCurves = useMemo(() => {
    return ORIGINS_DATA.map((origin) => {
      const originPos = latLngToVector3(origin.lat, origin.lng, GLOBE_RADIUS);

      const midPoint = new THREE.Vector3()
        .addVectors(originPos, istanbulPos)
        .multiplyScalar(0.5);

      const distance = originPos.distanceTo(istanbulPos);
      midPoint.normalize().multiplyScalar(GLOBE_RADIUS + distance * 0.26);

      const curve = new THREE.QuadraticBezierCurve3(originPos, midPoint, istanbulPos);

      return {
        origin,
        curve,
        points: curve.getPoints(64).map((p) => [p.x, p.y, p.z] as [number, number, number]),
        originPos,
        phase: Math.random(),
      };
    });
  }, [istanbulPos]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      if (!isDragging.current) {
        targetRotation.current.y += delta * 0.055;
      }

      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current.y,
        delta * 4.0
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        THREE.MathUtils.clamp(targetRotation.current.x, -0.85, 0.85),
        delta * 4.0
      );
    }

    // Weather drifts a little faster than the ground turns
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.012;
    }

    if (travellersRef.current) {
      travellersRef.current.children.forEach((child, i) => {
        const { curve, phase } = flightCurves[i];
        const p = (t * 0.14 + phase) % 1;
        child.position.copy(curve.getPointAt(p));
        child.scale.setScalar(0.35 + Math.sin(p * Math.PI) * 0.9);
      });
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    isDragging.current = true;
    previousPointerPos.current = {
      x: e.clientX || (e.touches && e.touches[0]?.clientX) || 0,
      y: e.clientY || (e.touches && e.touches[0]?.clientY) || 0,
    };
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;

    targetRotation.current.y += (clientX - previousPointerPos.current.x) * 0.007;
    targetRotation.current.x += (clientY - previousPointerPos.current.y) * 0.007;

    previousPointerPos.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <group
      scale={scale}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Outer atmospheric halo, outside the spinning group so it never smears */}
      <mesh scale={1.16} material={haze} dispose={null}>
        <sphereGeometry args={[GLOBE_RADIUS, 48, 48]} />
      </mesh>
      <mesh scale={1.035} material={atmosphere} dispose={null}>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
      </mesh>

      <group ref={groupRef}>
        {/* Planet surface: terrain albedo, elevation normals, and a roughness
            split so the oceans catch a specular highlight and the land does not */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[GLOBE_RADIUS, 128, 128]} />
          <meshStandardMaterial
            map={map}
            normalMap={normalMap}
            normalScale={new THREE.Vector2(0.85, 0.85)}
            roughnessMap={roughnessMap}
            roughness={1}
            metalness={0.05}
            envMapIntensity={0.35}
          />
        </mesh>

        {/* Cloud deck, a few kilometres up */}
        <mesh ref={cloudsRef} scale={1.012}>
          <sphereGeometry args={[GLOBE_RADIUS, 96, 96]} />
          <meshStandardMaterial
            map={clouds}
            transparent
            opacity={0.85}
            roughness={0.95}
            metalness={0}
            depthWrite={false}
          />
        </mesh>

        {/* Trade routes */}
        {flightCurves.map(({ origin, points }) => {
          const isSelected = selectedOrigin?.id === origin.id;
          return (
            <Line
              key={`arc-${origin.id}`}
              points={points}
              color={isSelected ? '#FFD9A8' : '#D49B5B'}
              lineWidth={isSelected ? 2.4 : 1.1}
              transparent
              opacity={isSelected ? 0.95 : 0.4}
              depthWrite={false}
            />
          );
        })}

        <group ref={travellersRef}>
          {flightCurves.map(({ origin }) => (
            <mesh key={`traveller-${origin.id}`}>
              <sphereGeometry args={[0.032, 10, 10]} />
              <meshBasicMaterial color="#FFE9CC" transparent opacity={0.95} />
            </mesh>
          ))}
        </group>

        {/* İstanbul — the roastery */}
        <group position={istanbulPos}>
          <mesh>
            <sphereGeometry args={[0.05, 20, 20]} />
            <meshBasicMaterial color="#FFF6E8" />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.12, 20, 20]} />
            <meshBasicMaterial color="#D49B5B" transparent opacity={0.3} depthWrite={false} />
          </mesh>
        </group>

        {/* Origin markers */}
        {flightCurves.map(({ origin, originPos }) => {
          const isSelected = selectedOrigin?.id === origin.id;
          return (
            <group key={`pin-${origin.id}`} position={originPos}>
              <mesh
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectOrigin?.(origin);
                }}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  document.body.style.cursor = 'pointer';
                }}
                onPointerOut={() => {
                  document.body.style.cursor = '';
                }}
              >
                <sphereGeometry args={[isSelected ? 0.075 : 0.05, 16, 16]} />
                <meshBasicMaterial color={isSelected ? '#FFE9CC' : origin.color} />
              </mesh>
              <mesh>
                <sphereGeometry args={[isSelected ? 0.18 : 0.11, 16, 16]} />
                <meshBasicMaterial
                  color={isSelected ? '#FFD9A8' : origin.color}
                  transparent
                  opacity={isSelected ? 0.32 : 0.16}
                  depthWrite={false}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};
