import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, CanvasProps } from '@react-three/fiber';
import {
  Environment,
  Lightformer,
  ContactShadows,
  AdaptiveDpr,
  AdaptiveEvents,
} from '@react-three/drei';
import * as THREE from 'three';
import { cached } from './assetCache';

interface Stage3DProps extends Partial<CanvasProps> {
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
  fov?: number;
  /** Y position of the ground contact shadow. `null` disables it. */
  shadowY?: number | null;
  shadowScale?: number;
  shadowOpacity?: number;
  /** Warmth of the key light — "roastery" is fiery, "studio" is neutral cream */
  mood?: 'studio' | 'roastery' | 'cool';
  /** Tone-mapping exposure. Dark subjects (a matte black pouch) need more. */
  exposure?: number;
  /** Distance from the camera that stays sharp; everything else defocuses. */
  focusDistance?: number;
  bokeh?: number;
  className?: string;
  /** Mount above-the-fold scenes without waiting for an intersection callback. */
  eager?: boolean;
  /** Accessible description of what the 3D canvas shows (for SEO / a11y) */
  label?: string;
}

const MOODS = {
  studio: { key: '#FFF1E0', fill: '#E0A76A', rim: '#FFFFFF', keyIntensity: 2.4 },
  roastery: { key: '#FFD3A0', fill: '#FF8A3C', rim: '#FFE2BE', keyIntensity: 2.9 },
  cool: { key: '#F4F8FF', fill: '#A8BEDB', rim: '#FFFFFF', keyIntensity: 2.2 },
} as const;

/** Machines with few cores or no WebGL2 skip the composer entirely. */
function useQualityTier(): 'high' | 'low' {
  const [tier, setTier] = useState<'high' | 'low'>('high');

  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 4;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.matchMedia('(max-width: 640px)').matches;
    setTier(cores <= 4 || reduced || small ? 'low' : 'high');
  }, []);

  return tier;
}

/**
 * Studio lighting rig, rendered once into a cube map.
 *
 * The softboxes are what actually make the props look photographed: a metal or
 * ceramic surface shows the *shape* of the light it reflects, so large soft
 * rectangles with a bright core read as a real studio, while point lights alone
 * read as a cartoon.
 */
/** Vertical studio gradient: bright ceiling, dark floor, warm horizon. */
function backdropTexture(): THREE.Texture {
  return cached('stage:backdrop', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, '#3B2C22');
    g.addColorStop(0.42, '#241811');
    g.addColorStop(0.55, '#1A110C');
    g.addColorStop(1, '#0C0705');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 16, 256);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  });
}

const StudioEnvironment: React.FC<{ mood: keyof typeof MOODS }> = ({ mood }) => {
  const m = MOODS[mood];

  return (
    <Environment resolution={128} frames={1} background={false}>
      {/* Graded backdrop rather than a flat shell, so reflections have a horizon */}
      <mesh scale={60}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshBasicMaterial map={backdropTexture()} side={THREE.BackSide} />
      </mesh>

      {/* Key softbox, high and to camera-right */}
      <Lightformer
        form="rect"
        intensity={5.2}
        color={m.key}
        position={[3.5, 5, 3.5]}
        rotation={[-Math.PI / 2.6, 0.3, 0]}
        scale={[9, 7, 1]}
      />
      {/* Its hot core — gives surfaces a crisp specular shape */}
      <Lightformer
        form="rect"
        intensity={9}
        color="#FFFFFF"
        position={[2.6, 4.2, 3.4]}
        rotation={[-Math.PI / 2.6, 0.3, 0]}
        scale={[2.6, 1.8, 1]}
      />

      {/* Warm bounce card, camera-left */}
      <Lightformer
        form="rect"
        intensity={2.6}
        color={m.fill}
        position={[-5.5, 0.8, 2.5]}
        rotation={[0, Math.PI / 2.3, 0]}
        scale={[7, 6, 1]}
      />

      {/* Rim strip behind the subject for edge separation */}
      <Lightformer
        form="rect"
        intensity={4.2}
        color={m.rim}
        position={[-1.5, 2.2, -6]}
        rotation={[0, Math.PI, 0]}
        scale={[6, 3, 1]}
      />
      <Lightformer
        form="rect"
        intensity={3.4}
        color={m.fill}
        position={[3.5, 0.5, -5]}
        rotation={[0, Math.PI * 0.85, 0]}
        scale={[4, 4, 1]}
      />

      {/* Table bounce, so undersides never crush to black */}
      <Lightformer
        form="rect"
        intensity={1.1}
        color="#7A4E2C"
        position={[0, -4.5, 1]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[10, 10, 1]}
      />

      {/* Small catch-lights */}
      <Lightformer form="circle" intensity={6} color="#FFFFFF" position={[4, 3.5, 4]} scale={1.1} />
      <Lightformer form="ring" intensity={3} color={m.fill} position={[-3.5, -1, 3.5]} scale={1.4} />
    </Environment>
  );
};

/**
 * Delays creating the WebGL context until the route transition has settled.
 *
 * Mounting a canvas builds its environment cube map and compiles shaders — a
 * few hundred milliseconds of main-thread work. Doing that in the middle of a
 * route transition is exactly what made the curtain stutter.
 */
function useIdleMount(enabled: boolean): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled || ready) return;

    // A real timeout is intentional here. requestIdleCallback can be postponed
    // indefinitely on animation-heavy pages and is not consistently scheduled
    // by headless browsers, leaving an empty scene card.
    const handle = window.setTimeout(() => setReady(true), 380);
    return () => window.clearTimeout(handle);
  }, [enabled, ready]);

  return ready;
}

export const Stage3D: React.FC<Stage3DProps> = ({
  children,
  cameraPosition = [0, 0, 4.2],
  fov = 45,
  shadowY = -1.35,
  shadowScale = 9,
  shadowOpacity = 0.5,
  mood = 'studio',
  exposure = 1.15,
  focusDistance = 0.015,
  bokeh = 2.2,
  className = '',
  eager = false,
  label,
  ...rest
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(eager);
  const tier = useQualityTier();
  const deferredMount = useIdleMount(inView);
  const mounted = eager || deferredMount;

  useEffect(() => {
    if (eager) {
      setInView(true);
      return;
    }

    const el = wrapperRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: '200px',
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [eager]);

  return (
    <div
      ref={wrapperRef}
      className={`h-full w-full ${className}`}
      aria-label={label}
      role={label ? 'img' : undefined}
    >
      {mounted && (
        <Canvas
          frameloop={inView ? 'always' : 'never'}
          camera={{ position: cameraPosition, fov, near: 0.1, far: 100 }}
          dpr={[1, tier === 'high' ? 1.6 : 1.25]}
          shadows="soft"
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: exposure,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          {...rest}
        >
          <Suspense fallback={null}>
            <StudioEnvironment mood={mood} />

            <directionalLight
              position={[4.5, 7, 5]}
              intensity={MOODS[mood].keyIntensity}
              color={MOODS[mood].key}
              castShadow
              shadow-mapSize={[tier === 'high' ? 1024 : 512, tier === 'high' ? 1024 : 512]}
              shadow-bias={-0.0004}
              shadow-normalBias={0.02}
            >
              <orthographicCamera attach="shadow-camera" args={[-6, 6, 6, -6, 0.1, 25]} />
            </directionalLight>

            {/* Cool counter-light: pure warm light from every side flattens form */}
            <directionalLight position={[-5, 1.5, -3]} intensity={0.5} color="#9FB3CC" />

            <hemisphereLight args={['#FFF4E5', '#142A25', 1.15]} />
            <ambientLight intensity={0.34} color="#E8CDAE" />

            {children}

            {shadowY !== null && (
              <ContactShadows
                position={[0, shadowY, 0]}
                opacity={shadowOpacity}
                scale={shadowScale}
                blur={2.4}
                far={5}
                resolution={tier === 'high' ? 512 : 256}
                color="#0B0603"
              />
            )}

            <AdaptiveDpr pixelated={false} />
            <AdaptiveEvents />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};
