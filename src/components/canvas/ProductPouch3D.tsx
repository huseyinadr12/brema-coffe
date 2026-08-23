import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ProductItem } from '../../types';

interface ProductPouch3DProps {
  product: ProductItem;
  scale?: number;
  position?: [number, number, number];
  interactive?: boolean;
}

/**
 * Creates an authentic stand-up coffee pouch (Doypack) geometry with:
 * - Bulging bean belly
 * - Flat oval base
 * - Tapered sealed top crimp
 */
function createCoffeePouchGeometry(): THREE.BufferGeometry {
  const width = 1.9;
  const height = 2.8;
  const depth = 0.8;
  const segmentsX = 40;
  const segmentsY = 60;

  // We create a custom cylinder/box morphed geometry
  const geometry = new THREE.CylinderGeometry(0.95, 0.95, height, segmentsX, segmentsY, true);
  const pos = geometry.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const yNorm = (v.y + height / 2) / height; // 0 (bottom) to 1 (top)

    // Oval cross section (X is wide, Z is depth)
    let x = v.x * (width / 1.9);
    let z = v.z * (depth / 0.95);

    // 1. Bottom: flat oval base
    if (yNorm < 0.2) {
      const bottomTaper = 0.85 + (yNorm / 0.2) * 0.15;
      x *= bottomTaper;
      z *= 0.9;
    } 
    // 2. Belly: natural bean volume bulge in the middle
    else if (yNorm >= 0.2 && yNorm <= 0.8) {
      const mid = 1.0 - Math.abs(yNorm - 0.5) * 2.0; // 0 to 1 peak at center
      z *= (1.0 + mid * 0.35); // Plump front and back curve
    } 
    // 3. Top: flattened heat seal crimp
    else {
      const topTaper = (yNorm - 0.8) / 0.2; // 0 to 1
      z *= Math.max(0.08, 1.0 - topTaper * 0.92); // Flattens to a thin seam
      x *= (1.0 + topTaper * 0.05); // Slight flange
    }

    pos.setXYZ(i, x, v.y, z);
  }

  geometry.computeVertexNormals();
  return geometry;
}

export const ProductPouch3D: React.FC<ProductPouch3DProps> = ({
  product,
  scale = 1,
  position = [0, 0, 0],
  interactive = true,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const previousPointerX = useRef(0);
  const targetRotationY = useRef(0);

  // Custom Stand-up Pouch Geometry
  const pouchGeometry = useMemo(() => createCoffeePouchGeometry(), []);

  // Generate high-resolution procedural Turkish label texture for the coffee pouch
  const labelTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Warm dark matte craft pouch body
      ctx.fillStyle = '#201510';
      ctx.fillRect(0, 0, 1024, 1024);

      // Fine craft texture grain
      ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
      for (let i = 0; i < 26000; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        ctx.fillRect(x, y, 1.5, 1.5);
      }

      // Metallic gold border frame
      ctx.strokeStyle = '#D49B5B';
      ctx.lineWidth = 4;
      ctx.strokeRect(60, 60, 904, 904);

      // Inner thin frame
      ctx.strokeStyle = 'rgba(212, 155, 91, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(76, 76, 872, 872);

      // Header: "BREMA"
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FAF4EB';
      ctx.font = 'bold 62px "Outfit", sans-serif';
      ctx.fillText('B R E M A', 512, 175);

      // Subhead: "KAVURMA ATÖLYESİ · İSTANBUL 2012"
      ctx.fillStyle = '#D49B5B';
      ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('KAHVE KAVURMA ATÖLYESİ · 2012', 512, 220);

      // Divider Line
      ctx.strokeStyle = 'rgba(212, 155, 91, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(300, 248);
      ctx.lineTo(724, 248);
      ctx.stroke();

      // Product Main Name (Editorial Serif)
      ctx.fillStyle = '#FAF4EB';
      ctx.font = 'italic 600 64px "Playfair Display", Georgia, serif';
      ctx.fillText(product.name.replace('Brema ', ''), 512, 360);

      // Category Tag Pill
      ctx.fillStyle = 'rgba(212, 155, 91, 0.25)';
      ctx.strokeStyle = '#D49B5B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(280, 400, 464, 46, 23);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FAF4EB';
      ctx.font = '700 17px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(product.category.toUpperCase() + ' · ' + product.roastLevel.toUpperCase() + ' KAVRUM', 512, 430);

      // Origin Tag
      ctx.fillStyle = '#D9C3B0';
      ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(product.origin, 512, 495);

      // Tasting Notes Pill Badges
      const notes = product.tastingNotes || [];
      const startY = 565;
      ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
      notes.slice(0, 3).forEach((note, idx) => {
        const y = startY + idx * 50;
        ctx.fillStyle = 'rgba(40, 26, 20, 0.92)';
        ctx.fillRect(240, y - 25, 544, 38);
        ctx.strokeStyle = 'rgba(212, 155, 91, 0.35)';
        ctx.strokeRect(240, y - 25, 544, 38);

        ctx.fillStyle = '#FAF4EB';
        ctx.fillText('• ' + note.toUpperCase(), 512, y);
      });

      // Degassing Aroma Valve Circle representation
      ctx.fillStyle = 'rgba(212, 155, 91, 0.4)';
      ctx.beginPath();
      ctx.arc(512, 740, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#D49B5B';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Bottom Seal
      ctx.fillStyle = '#D49B5B';
      ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('NET 250G · NİTROJEN MÜHÜRLÜ TAZE KAVRUM', 512, 830);
      ctx.font = '400 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#D9C3B0';
      ctx.fillText('ÇEKİRDEKTEN FİNCANA · BREMA.COM.TR', 512, 865);
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, [product]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (!isDragging.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = position[1] + Math.sin(t * 1.2) * 0.04;
      targetRotationY.current = Math.sin(t * 0.4) * 0.18;
    }

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotationY.current,
      delta * 4.0
    );
  });

  const handlePointerDown = (e: any) => {
    if (!interactive) return;
    e.stopPropagation();
    isDragging.current = true;
    previousPointerX.current = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    const deltaX = clientX - previousPointerX.current;
    targetRotationY.current += deltaX * 0.015;
    previousPointerX.current = clientX;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* 1. Stand-up Doypack Pouch Body */}
      <mesh geometry={pouchGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          map={labelTexture}
          roughness={0.38}
          metalness={0.1}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
          reflectivity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Top Heat-Sealed Crimp Hem */}
      <mesh position={[0, 1.42, 0]} castShadow>
        <boxGeometry args={[1.98, 0.12, 0.08]} />
        <meshStandardMaterial
          color="#1A100B"
          roughness={0.5}
          metalness={0.4}
        />
      </mesh>

      {/* 3. Degassing Aroma Valve on Front */}
      <mesh position={[0, 0.35, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 24]} />
        <meshStandardMaterial color="#D49B5B" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* 4. Bottom Stand-up Base Flange */}
      <mesh position={[0, -1.4, 0]}>
        <cylinderGeometry args={[0.82, 0.82, 0.04, 32]} />
        <meshStandardMaterial color="#1A100B" roughness={0.7} />
      </mesh>
    </group>
  );
};
