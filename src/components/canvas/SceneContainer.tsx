import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CoffeeBean3D } from './CoffeeBean3D';
import { CoffeeCherry3D } from './CoffeeCherry3D';
import { EarthGlobe3D } from './EarthGlobe3D';
import { RoasterDrum3D } from './RoasterDrum3D';
import { GrinderParticles3D } from './GrinderParticles3D';
import { EspressoPortafilter3D } from './EspressoPortafilter3D';
import { EspressoCup3D } from './EspressoCup3D';
import { ProductPouch3D } from './ProductPouch3D';
import { OriginData, ProductItem, RoastStage } from '../../types';

interface SceneContainerProps {
  scrollProgress: number;
  activeChapter: number;
  selectedOrigin?: OriginData;
  onSelectOrigin?: (origin: OriginData) => void;
  activeProduct: ProductItem;
  activeRoastStage: RoastStage;
}

const CameraRig: React.FC<{
  scrollProgress: number;
  activeChapter: number;
}> = ({ scrollProgress }) => {
  const currentPos = useRef(new THREE.Vector3(0, 0, 4.5));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const p = Math.max(0, Math.min(1, scrollProgress));
    const targetPos = new THREE.Vector3(0, 0, 4.5);
    const targetLookAt = new THREE.Vector3(0, 0, 0);

    const mouse = state.pointer;
    targetPos.x += mouse.x * 0.25;
    targetPos.y += mouse.y * 0.18;

    currentPos.current.lerp(targetPos, delta * 3.5);
    currentLookAt.current.lerp(targetLookAt, delta * 3.5);

    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(currentLookAt.current);
  });

  return null;
};

export const SceneContainer: React.FC<SceneContainerProps> = ({
  scrollProgress,
  activeChapter,
  selectedOrigin,
  onSelectOrigin,
  activeProduct,
  activeRoastStage,
}) => {
  const p = Math.max(0, Math.min(1, scrollProgress));

  const showHeroBean = p < 0.20;
  const showCherry = p >= 0.12 && p < 0.25;
  const showGlobe = p >= 0.22 && p < 0.38;
  const showRoaster = p >= 0.36 && p < 0.50;
  const showRoastLabBean = p >= 0.48 && p < 0.62;
  const showGrinder = p >= 0.60 && p < 0.72;
  const showPortafilter = p >= 0.70 && p < 0.82;
  const showProductPouch = p >= 0.80 && p < 0.92;
  const showFinalCup = p >= 0.90;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-auto z-0 overflow-hidden bg-[#F9F6F0]">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.8} />
        <spotLight
          position={[5, 8, 5]}
          angle={0.45}
          penumbra={0.8}
          intensity={2.8}
          color="#FFE2C2"
        />
        <pointLight position={[-6, -4, -4]} intensity={1.2} color="#D9A066" />
        <CameraRig scrollProgress={p} activeChapter={activeChapter} />

        {showHeroBean && (
          <CoffeeBean3D
            scale={1.3}
            position={[0, 0, 0]}
            roastColor="#4A2C1A"
            roughness={0.38}
            metalness={0.12}
            interactive={true}
          />
        )}

        {showCherry && <CoffeeCherry3D position={[0, 0, 0]} scale={1.2} />}

        {showGlobe && (
          <EarthGlobe3D
            selectedOrigin={selectedOrigin}
            onSelectOrigin={onSelectOrigin}
            scale={1.0}
            position={[0, 0, 0]}
          />
        )}

        {showRoaster && <RoasterDrum3D intensity={1.2} scale={1.1} position={[0, 0, 0]} />}

        {showRoastLabBean && (
          <CoffeeBean3D
            scale={1.4}
            position={[0, 0, 0]}
            roastColor={activeRoastStage.beanColor}
            roughness={activeStageRoughness(activeRoastStage)}
            metalness={activeRoastStage.beanGloss * 0.3}
            interactive={true}
          />
        )}

        {showGrinder && <GrinderParticles3D scale={1.1} position={[0, 0, 0]} />}
        {showPortafilter && <EspressoPortafilter3D scale={1.1} position={[0, 0.4, 0]} />}
        {showProductPouch && <ProductPouch3D product={activeProduct} scale={1.1} position={[0, 0, 0]} />}
        {showFinalCup && <EspressoCup3D scale={1.15} position={[0, -0.3, 0]} />}
      </Canvas>
    </div>
  );
};

function activeStageRoughness(stage: RoastStage): number {
  return stage.beanRoughness || 0.4;
}
