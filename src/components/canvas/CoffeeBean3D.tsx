import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createRealisticBeanGeometry } from './CoffeeBeanGeometry';

interface CoffeeBean3DProps {
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  roastColor?: string;
  roughness?: number;
  metalness?: number;
  interactive?: boolean;
  floating?: boolean;
  onClick?: () => void;
}

export const CoffeeBean3D: React.FC<CoffeeBean3DProps> = ({
  scale = 1,
  position = [0, 0, 0],
  rotation = [0.3, 0.4, 0.2],
  roastColor = '#382013',
  roughness = 0.32,
  metalness = 0.06,
  interactive = true,
  floating = true,
  onClick,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: rotation[0], y: rotation[1] });
  const isPointerDown = useRef(false);
  const previousPointerPos = useRef({ x: 0, y: 0 });

  // 1. High-Density Photorealistic Geometry
  const geometry = useMemo(() => {
    return createRealisticBeanGeometry(1.0, 1.5, 0.85, 120);
  }, []);

  // 2. High-Resolution Photorealistic PBR Texture & Bump Map
  const { diffuseMap, bumpMap, roughnessMap } = useMemo(() => {
    // A. Diffuse Map (Color & Chaff Crease)
    const diffCanvas = document.createElement('canvas');
    diffCanvas.width = 1024;
    diffCanvas.height = 1024;
    const dCtx = diffCanvas.getContext('2d');

    if (dCtx) {
      // Base roasted rich coffee bean gradient
      const bgGrad = dCtx.createRadialGradient(512, 512, 100, 512, 512, 512);
      bgGrad.addColorStop(0, '#4A2A18');
      bgGrad.addColorStop(0.6, '#382013');
      bgGrad.addColorStop(1, '#24140B');
      dCtx.fillStyle = bgGrad;
      dCtx.fillRect(0, 0, 1024, 1024);

      // Micro pore cellular texture
      const imgData = dCtx.getImageData(0, 0, 1024, 1024);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 22;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.7));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.4));
      }
      dCtx.putImageData(imgData, 0, 0);

      // Natural white/cream silverskin chaff crease
      dCtx.save();
      dCtx.strokeStyle = 'rgba(235, 225, 210, 0.85)';
      dCtx.lineWidth = 10;
      dCtx.filter = 'blur(3px)';
      dCtx.beginPath();
      dCtx.moveTo(512, 80);
      dCtx.bezierCurveTo(535, 380, 485, 640, 512, 944);
      dCtx.stroke();

      // Deep dark inner shadow along the fissure
      dCtx.strokeStyle = 'rgba(20, 10, 5, 0.95)';
      dCtx.lineWidth = 18;
      dCtx.filter = 'blur(5px)';
      dCtx.beginPath();
      dCtx.moveTo(512, 80);
      dCtx.bezierCurveTo(535, 380, 485, 640, 512, 944);
      dCtx.stroke();
      dCtx.restore();
    }

    const diffTexture = new THREE.CanvasTexture(diffCanvas);
    diffTexture.wrapS = THREE.RepeatWrapping;
    diffTexture.wrapT = THREE.RepeatWrapping;

    // B. Micro Bump Displacement Map
    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = 512;
    bumpCanvas.height = 512;
    const bCtx = bumpCanvas.getContext('2d');

    if (bCtx) {
      bCtx.fillStyle = '#808080';
      bCtx.fillRect(0, 0, 512, 512);

      const bImg = bCtx.getImageData(0, 0, 512, 512);
      const bData = bImg.data;
      for (let i = 0; i < bData.length; i += 4) {
        const n = (Math.random() - 0.5) * 50;
        const val = Math.min(255, Math.max(0, 128 + n));
        bData[i] = val;
        bData[i + 1] = val;
        bData[i + 2] = val;
      }
      bCtx.putImageData(bImg, 0, 0);

      // Deep groove
      bCtx.strokeStyle = '#000000';
      bCtx.lineWidth = 22;
      bCtx.filter = 'blur(8px)';
      bCtx.beginPath();
      bCtx.moveTo(256, 40);
      bCtx.bezierCurveTo(270, 200, 240, 320, 256, 472);
      bCtx.stroke();
    }

    const bTexture = new THREE.CanvasTexture(bumpCanvas);
    bTexture.wrapS = THREE.RepeatWrapping;
    bTexture.wrapT = THREE.RepeatWrapping;

    return { diffuseMap: diffTexture, bumpMap: bTexture, roughnessMap: bTexture };
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const t = state.clock.getElapsedTime();

    if (floating && !isPointerDown.current) {
      // Natural organic levitation
      const floatY = Math.sin(t * 1.3) * 0.08 + Math.cos(t * 0.7) * 0.03;
      const floatX = Math.cos(t * 0.9) * 0.03;
      meshRef.current.position.y = position[1] + floatY;
      meshRef.current.position.x = position[0] + floatX;

      // Gentle smooth gyro precession
      targetRotation.current.y += delta * 0.35;
      targetRotation.current.x = rotation[0] + Math.sin(t * 0.8) * 0.12;
    }

    // Smooth spring-like lerp to target rotation
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

    const deltaX = clientX - previousPointerPos.current.x;
    const deltaY = clientY - previousPointerPos.current.y;

    targetRotation.current.y += deltaX * 0.012;
    targetRotation.current.x += deltaY * 0.012;

    previousPointerPos.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    isPointerDown.current = false;
  };

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
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
        map={diffuseMap}
        bumpMap={bumpMap}
        bumpScale={0.035}
        roughness={roughness}
        metalness={metalness}
        clearcoat={0.45}
        clearcoatRoughness={0.28}
        sheen={0.8}
        sheenRoughness={0.35}
        sheenColor={new THREE.Color('#D49B5B')}
        reflectivity={0.65}
      />
    </mesh>
  );
};
