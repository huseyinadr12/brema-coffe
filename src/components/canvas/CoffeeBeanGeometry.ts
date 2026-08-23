import * as THREE from 'three';

/**
 * Creates an anatomically authentic, photorealistic 3D Specialty Arabica coffee bean geometry.
 * Features:
 * - Natural asymmetric dorsal arch and flattened ventral face
 * - Sigmoid S-curved ventral fissure with deep internal cleft
 * - Tapered micropyle and chalaza ends
 * - Micro-pore surface displacement for physical realism
 */
export function createRealisticBeanGeometry(
  width = 1.0,
  length = 1.5,
  height = 0.85,
  segments = 120
): THREE.BufferGeometry {
  const geometry = new THREE.SphereGeometry(1, segments, segments);
  const position = geometry.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < position.count; i++) {
    v.fromBufferAttribute(position, i);

    // Normalized coordinates
    const x = v.x;
    const y = v.y; // Along the longitudinal axis of the bean
    const z = v.z;

    // 1. Asymmetric oval bean elongation & end tapering
    const yNorm = Math.abs(y);
    const endTaper = 1.0 - Math.pow(yNorm, 2.2) * 0.42; // Tapering towards the ends
    const asymmetryFactor = 1.0 + x * 0.12; // Natural organic side asymmetry

    let newX = x * width * endTaper * asymmetryFactor;
    let newY = y * length;
    let newZ = z * height * endTaper;

    // 2. Flatten ventral face (inner side where beans meet inside cherry)
    if (newZ < 0) {
      newZ *= 0.65; // Ventral side is distinctly flatter
      newZ -= Math.pow(Math.abs(newX), 1.8) * 0.15; // Gentle concave tuck
    } else {
      // Dorsal side has a rich rounded dome
      newZ *= 1.15;
      newZ += (1.0 - Math.pow(yNorm, 2)) * 0.12;
    }

    // 3. Sigmoid S-curve ventral fissure (crease)
    const sOffset = Math.sin(y * 2.8) * 0.08 * (1.0 - yNorm * 0.5);
    const distToCenterCrease = Math.abs(newX - sOffset);

    // Deep organic cleft on the ventral face
    if (newZ <= 0.12) {
      const creaseWidth = 0.24 * (1.0 - Math.pow(yNorm, 1.8) * 0.3);
      if (distToCenterCrease < creaseWidth) {
        const cleftFactor = Math.cos((distToCenterCrease / creaseWidth) * (Math.PI / 2));
        // Deep inward groove with steep inner lips
        newZ -= Math.pow(cleftFactor, 1.4) * 0.45;
        
        // Slight lip ridge on either side of the crease
        newZ += Math.sin((distToCenterCrease / creaseWidth) * Math.PI) * 0.06;
      }
    }

    // 4. Natural micro-pore and cellular surface displacement
    const microNoise =
      Math.sin(newX * 32.0 + newY * 24.0) *
      Math.cos(newY * 36.0 + newZ * 28.0) *
      0.008;

    newX += microNoise;
    newY += microNoise;
    newZ += microNoise;

    position.setXYZ(i, newX, newY, newZ);
  }

  geometry.computeVertexNormals();
  return geometry;
}
