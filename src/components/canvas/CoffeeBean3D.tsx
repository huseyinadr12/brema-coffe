import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createRealisticBeanGeometry } from './CoffeeBeanGeometry';
import { cached } from './assetCache';
import { surfaceNormal, variationMap } from './proceduralTextures';

interface CoffeeBean3DProps {
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  roastColor?: string;
  roughness?: number;
  metalness?: number;
  /** 0 = dry light roast, 1 = oily dark roast. Drives the surface sheen. */
  oiliness?: number;
  interactive?: boolean;
  floating?: boolean;
  onClick?: () => void;
}

/**
 * Micro-relief of a roasted bean: the cell walls rupture during first crack,
 * leaving a finely pitted, faintly wrinkled skin. Built as a height field with
 * added pores, then converted to a normal map.
 */
function beanNormalMap(): THREE.Texture {
  return surfaceNormal('bean-skin', {
    size: 256,
    scale: 20,
    octaves: 4,
    normalStrength: 1.15,
    repeat: [3, 2],
    detail: (ctx, size) => {
      // Blown cell pores, denser than the fbm alone would give
      ctx.globalAlpha = 0.5;
      for (let i = 0; i < 720; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const r = Math.random() * 2.4 + 0.5;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(0,0,0,0.85)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      // Faint surface wrinkling
      ctx.globalAlpha = 0.25;
      ctx.strokeStyle = '#FFFFFF';
      for (let i = 0; i < 72; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        ctx.lineWidth = Math.random() * 1.2 + 0.3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(
          x + Math.random() * 40 - 20,
          y + Math.random() * 30 - 15,
          x + Math.random() * 60 - 30,
          y + Math.random() * 40 - 20,
          x + Math.random() * 80 - 40,
          y + Math.random() * 50 - 25
        );
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    },
  });
}

/**
 * Roughness variation. Roasting drives oils to the surface in uneven patches,
 * so a real bean shows satin blooms over a matte base — never one flat gloss.
 */
function beanRoughnessMap(): THREE.Texture {
  return variationMap('bean-oil', {
    size: 256,
    scale: 5,
    octaves: 4,
    low: 0.55,
    high: 1.0,
    repeat: [3, 2],
  });
}

export const CoffeeBean3D: React.FC<CoffeeBean3DProps> = ({
  scale = 1,
  position = [0, 0, 0],
  rotation = [0.14, Math.PI, -0.16],
  roastColor = '#62371F',
  roughness = 0.72,
  metalness = 0.0,
  oiliness = 0.35,
  interactive = true,
  floating = true,
  onClick,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: rotation[0], y: rotation[1] });
  const isPointerDown = useRef(false);
  const previousPointerPos = useRef({ x: 0, y: 0 });

  const geometry = cached('bean:geometry', () =>
    createRealisticBeanGeometry(0.98, 1.34, 0.7, 88)
  );
  const normalMap = useMemo(() => beanNormalMap(), []);
  const roughnessMap = useMemo(() => beanRoughnessMap(), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const t = state.clock.getElapsedTime();

    if (floating && !isPointerDown.current) {
      const floatY = Math.sin(t * 0.85) * 0.045 + Math.cos(t * 0.45) * 0.015;
      const floatX = Math.cos(t * 0.62) * 0.014;
      meshRef.current.position.y = position[1] + floatY;
      meshRef.current.position.x = position[0] + floatX;

      targetRotation.current.y += delta * 0.045;
      targetRotation.current.x = rotation[0] + Math.sin(t * 0.55) * 0.055;
    }

    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      targetRotation.current.x,
      delta * 5.0
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetRotation.current.y,
      delta * 5.0
    );
  });

  const handlePointerDown = (e: any) => {
    if (!interactive) return;
    e.stopPropagation();
    isPointerDown.current = true;
    previousPointerPos.current = {
      x: e.clientX || (e.touches && e.touches[0]?.clientX) || 0,
      y: e.clientY || (e.touches && e.touches[0]?.clientY) || 0,
    };
  };

  const handlePointerMove = (e: any) => {
    if (!isPointerDown.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;

    targetRotation.current.y += (clientX - previousPointerPos.current.x) * 0.012;
    targetRotation.current.x += (clientY - previousPointerPos.current.y) * 0.012;

    previousPointerPos.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    isPointerDown.current = false;
  };

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      // Geometry comes from the module cache; letting r3f dispose it on unmount
      // would leave the next visit with an empty scene.
      dispose={null}
      scale={scale}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
      onClick={onClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <meshPhysicalMaterial
        color={roastColor}
        vertexColors
        normalMap={normalMap}
        normalScale={new THREE.Vector2(0.55, 0.55)}
        roughnessMap={roughnessMap}
        roughness={roughness}
        metalness={metalness}
        // Roasting oils read as a thin, slightly rough coat rather than a
        // lacquer — a high clearcoat is what made this look like moulded plastic.
        clearcoat={oiliness * 0.28}
        clearcoatRoughness={0.72}
        sheen={0.2}
        sheenRoughness={0.9}
        sheenColor={new THREE.Color('#C69262')}
        envMapIntensity={0.92}
      />
    </mesh>
  );
};
