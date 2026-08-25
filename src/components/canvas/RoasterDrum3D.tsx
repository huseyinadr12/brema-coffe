import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RoasterDrum3DProps {
  intensity?: number;
  scale?: number;
  position?: [number, number, number];
}

/** Soft round sprite for embers, so they glow instead of reading as squares. */
function createEmberSprite(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, 'rgba(255,190,110,0.85)');
    g.addColorStop(1, 'rgba(255,120,40,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(canvas);
}

/** Brushed cast-iron: fine circumferential grain plus a little pitting. */
function createIronTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#3A2A20';
    ctx.fillRect(0, 0, 1024, 512);

    for (let i = 0; i < 2600; i++) {
      const y = Math.random() * 512;
      ctx.strokeStyle =
        Math.random() > 0.5 ? 'rgba(255, 214, 170, 0.05)' : 'rgba(0, 0, 0, 0.09)';
      ctx.lineWidth = Math.random() * 1.6;
      ctx.beginPath();
      ctx.moveTo(Math.random() * 1024, y);
      ctx.lineTo(Math.random() * 1024, y + (Math.random() - 0.5) * 3);
      ctx.stroke();
    }

    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = 'rgba(20, 12, 8, 0.35)';
      ctx.beginPath();
      ctx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 3 + 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

export const RoasterDrum3D: React.FC<RoasterDrum3DProps> = ({
  intensity = 1,
  scale = 1,
  position = [0, 0, 0],
}) => {
  const drumGroupRef = useRef<THREE.Group>(null);
  const vanesRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const beansRef = useRef<THREE.Group>(null);

  const ironTexture = useMemo(() => createIronTexture(), []);
  const emberSprite = useMemo(() => createEmberSprite(), []);

  const particleCount = 150;
  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2.6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2.4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2.2;
      speeds[i] = 0.5 + Math.random() * 1.2;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
    return geo;
  }, []);

  // Beans tumbling behind the sight glass
  const tumbleSeeds = useMemo(
    () =>
      Array.from({ length: 14 }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: 0.15 + Math.random() * 0.28,
        speed: 1.4 + Math.random() * 1.6,
        scale: 0.05 + Math.random() * 0.035,
      })),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (vanesRef.current) {
      vanesRef.current.rotation.z += delta * 1.8;
    }

    if (drumGroupRef.current) {
      drumGroupRef.current.rotation.y = Math.sin(t * 0.4) * 0.15;
      drumGroupRef.current.position.y = position[1] + Math.sin(t * 1.8) * 0.02;
    }

    // Burner flicker
    if (glowRef.current) {
      glowRef.current.intensity =
        (6 + Math.sin(t * 9) * 1.2 + Math.sin(t * 23.7) * 0.8) * intensity;
    }

    if (beansRef.current) {
      beansRef.current.children.forEach((child, i) => {
        const s = tumbleSeeds[i];
        const a = s.angle + t * s.speed;
        child.position.set(Math.cos(a) * s.radius, Math.sin(a) * s.radius * 0.7, 0);
        child.rotation.z = a * 2;
      });
    }

    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position;
      const speed = particlesRef.current.geometry.attributes.speed;

      for (let i = 0; i < particleCount; i++) {
        let y = pos.getY(i) + delta * speed.getX(i) * 0.8;
        if (y > 1.6) y = -1.6;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group ref={drumGroupRef} position={position} scale={scale}>
      {/* Three-quarter presentation angle: the barrel, the riveted face and the
          sight glass are all readable at once. */}
      <group rotation={[0.16, -0.62, 0]}>
      {/* Cast-iron drum barrel */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 2.2, 64, 1, true]} />
        <meshStandardMaterial
          map={ironTexture}
          color="#7E6250"
          roughness={0.55}
          metalness={0.55}
          envMapIntensity={1.0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Closed end plates — the drum used to be a see-through tube */}
      {[1.1, -1.1].map((z) => (
        <mesh key={z} position={[0, 0, z]} rotation={[0, z > 0 ? 0 : Math.PI, 0]} castShadow>
          <circleGeometry args={[1.5, 64]} />
          <meshStandardMaterial
            map={ironTexture}
            color="#8A6B52"
            roughness={0.62}
            metalness={0.35}
            envMapIntensity={0.9}
          />
        </mesh>
      ))}

      {/* Bronze flange rings */}
      {[1.1, -1.1].map((z) => (
        <mesh key={`ring-${z}`} position={[0, 0, z]} castShadow>
          <torusGeometry args={[1.52, 0.06, 20, 64]} />
          <meshStandardMaterial
            color="#C08A46"
            roughness={0.28}
            metalness={0.95}
            envMapIntensity={1.7}
          />
        </mesh>
      ))}

      {/* Rivet detail around the front flange */}
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return (
          <mesh key={`rivet-${i}`} position={[Math.cos(a) * 1.36, Math.sin(a) * 1.36, 1.13]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshStandardMaterial
              color="#C08A46"
              roughness={0.3}
              metalness={0.95}
              envMapIntensity={1.5}
            />
          </mesh>
        );
      })}

      {/* Sight glass: bezel, tumbling beans, hot interior, glass */}
      <group position={[0, 0, 1.11]}>
        <mesh position={[0, 0, 0.005]}>
          <circleGeometry args={[0.46, 48]} />
          <meshStandardMaterial color="#160C06" roughness={0.9} />
        </mesh>

        <pointLight ref={glowRef} position={[0, 0, -0.3]} color="#FF7A2F" distance={4} decay={2} />

        <group ref={beansRef} position={[0, 0, 0.02]}>
          {tumbleSeeds.map((s, i) => (
            <mesh key={i} scale={[s.scale * 1.4, s.scale, s.scale * 0.7]}>
              <sphereGeometry args={[1, 10, 8]} />
              <meshStandardMaterial
                color="#7A4222"
                emissive="#FF6A18"
                emissiveIntensity={0.55}
                roughness={0.65}
              />
            </mesh>
          ))}
        </group>

        {/* Glass pane */}
        <mesh position={[0, 0, 0.05]}>
          <circleGeometry args={[0.45, 48]} />
          <meshPhysicalMaterial
            color="#FFD2A0"
            roughness={0.05}
            metalness={0}
            transmission={0.9}
            thickness={0.1}
            transparent
            opacity={0.5}
            envMapIntensity={1.6}
          />
        </mesh>

        <mesh position={[0, 0, 0.06]}>
          <ringGeometry args={[0.44, 0.54, 48]} />
          <meshStandardMaterial
            color="#C08A46"
            roughness={0.25}
            metalness={0.95}
            envMapIntensity={1.7}
          />
        </mesh>
      </group>

      {/* Internal mixing vanes */}
      <group ref={vanesRef}>
        {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
          <group key={i} rotation={[0, 0, angle]}>
            <mesh position={[0.72, 0, 0]} castShadow>
              <boxGeometry args={[0.08, 0.5, 1.85]} />
              <meshStandardMaterial
                color="#4A3527"
                roughness={0.45}
                metalness={0.85}
                envMapIntensity={0.9}
              />
            </mesh>
          </group>
        ))}
      </group>

      </group>

      {/* Thermal embers rise in world space, outside the tilted drum */}
      <points ref={particlesRef} geometry={particleGeo}>
        <pointsMaterial
          size={0.11}
          map={emberSprite}
          color="#FFB067"
          transparent
          opacity={0.55}
          depthWrite={false}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
