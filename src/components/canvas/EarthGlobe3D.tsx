import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ORIGINS_DATA } from '../../data/origins';
import { OriginData } from '../../types';

interface EarthGlobe3DProps {
  selectedOrigin?: OriginData;
  onSelectOrigin?: (origin: OriginData) => void;
  scale?: number;
  position?: [number, number, number];
}

// Convert Lat/Lng to 3D Sphere Coordinates
export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

export const EarthGlobe3D: React.FC<EarthGlobe3DProps> = ({
  selectedOrigin,
  onSelectOrigin,
  scale = 1,
  position = [0, 0, 0],
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const previousPointerPos = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0.2, y: -0.6 });

  // Istanbul coordinates (Roasting Atelier destination)
  const istanbulPos = useMemo(() => latLngToVector3(41.0082, 28.9784, 2.0), []);

  // Generate Luminous Warm Earth Map Texture
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Warm ivory & sand ocean
      ctx.fillStyle = '#EAE2D5';
      ctx.fillRect(0, 0, 2048, 1024);

      // Stylized gold-caramel continental grid
      ctx.fillStyle = '#9C673D';
      
      // Draw procedural landmass dots
      for (let y = 80; y < 940; y += 14) {
        for (let x = 60; x < 1980; x += 14) {
          const lat = (1 - y / 512) * 90;
          const lng = (x / 1024 - 1) * 180;
          
          // Approximate continental land masks
          const inAmericas = lng > -125 && lng < -35 && lat > -55 && lat < 68;
          const inAfrica = lng > -20 && lng < 52 && lat > -35 && lat < 36;
          const inEurasia = lng > -10 && lng < 150 && lat > 8 && lat < 70;
          const inAustralia = lng > 110 && lng < 155 && lat > -42 && lat < -10;
          
          if (inAmericas || inAfrica || inEurasia || inAustralia) {
            ctx.beginPath();
            ctx.arc(x, y, 4.0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Latitude / Longitude luxury guide rings
      ctx.strokeStyle = 'rgba(184, 125, 59, 0.15)';
      ctx.lineWidth = 1.5;
      for (let latY = 128; latY < 1024; latY += 128) {
        ctx.beginPath();
        ctx.moveTo(0, latY);
        ctx.lineTo(2048, latY);
        ctx.stroke();
      }
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Generate Flight Curves from Origins to Istanbul
  const flightCurves = useMemo(() => {
    return ORIGINS_DATA.map((origin) => {
      const originPos = latLngToVector3(origin.lat, origin.lng, 2.0);
      
      // Midpoint raised into space for 3D flight arc
      const midPoint = new THREE.Vector3()
        .addVectors(originPos, istanbulPos)
        .multiplyScalar(0.5);
      
      const distance = originPos.distanceTo(istanbulPos);
      midPoint.normalize().multiplyScalar(2.0 + distance * 0.28);

      const curve = new THREE.QuadraticBezierCurve3(originPos, midPoint, istanbulPos);
      const points = curve.getPoints(40);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);

      return {
        origin,
        lineGeo,
        originPos,
        curve,
      };
    });
  }, [istanbulPos]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (!isDragging.current) {
      targetRotation.current.y += delta * 0.12;
    }

    // Smooth inertia interpolation
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current.y,
      delta * 4.0
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotation.current.x,
      delta * 4.0
    );
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

    const deltaX = clientX - previousPointerPos.current.x;
    const deltaY = clientY - previousPointerPos.current.y;

    targetRotation.current.y += deltaX * 0.008;
    targetRotation.current.x += deltaY * 0.008;

    previousPointerPos.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <group
      ref={groupRef}
      scale={scale}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* 1. Main Luminous Earth Globe */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[2.0, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      {/* 2. Soft Glowing Atmospheric Rim */}
      <mesh scale={1.03}>
        <sphereGeometry args={[2.0, 48, 48]} />
        <meshBasicMaterial
          color="#D9A066"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* 3. Istanbul Hub Pin (Center Destination) */}
      <mesh position={istanbulPos}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#B87D3B" />
      </mesh>

      {/* 4. Flight Arcs & Origin Coordinate Markers */}
      {flightCurves.map(({ origin, lineGeo, originPos }) => {
        const isSelected = selectedOrigin?.id === origin.id;

        return (
          <group key={origin.id}>
            {/* Flight Path Line */}
            <primitive
              object={
                new THREE.Line(
                  lineGeo,
                  new THREE.LineBasicMaterial({
                    color: isSelected ? '#B87D3B' : '#C28746',
                    transparent: true,
                    opacity: isSelected ? 0.9 : 0.35,
                    linewidth: isSelected ? 2 : 1,
                  })
                )
              }
            />

            {/* Interactive Origin Marker */}
            <mesh
              position={originPos}
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectOrigin) onSelectOrigin(origin);
              }}
            >
              <sphereGeometry args={[isSelected ? 0.08 : 0.05, 16, 16]} />
              <meshBasicMaterial color={isSelected ? '#B87D3B' : origin.color} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
