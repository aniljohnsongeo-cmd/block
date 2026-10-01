import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * A single solid matte LEGO brick rendered with primitives.
 * studX = columns, studZ = rows
 */
const LegoBlock = React.forwardRef(function LegoBlock(
  {
    color = '#E3000B',
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1,
    studX = 2,
    studZ = 4,
    opacity = 1,
    castShadow = true,
    receiveShadow = true,
    onClick,
    onPointerEnter,
    onPointerLeave,
    hoverLift = false,
  },
  ref
) {
  const groupRef = useRef();
  const liftY = useRef(0);

  const setRef = (node) => {
    groupRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetY = hoverLift ? 0.35 : 0;
    liftY.current = THREE.MathUtils.lerp(liftY.current, targetY, delta * 8);
    groupRef.current.position.y = position[1] + liftY.current;
  });

  const unit = 1;
  const W = studX * unit;
  const D = studZ * unit;
  const brickH = 1.2;
  const matProps = {
    color,
    roughness: 0.28,
    metalness: 0.04,
    transparent: opacity < 1,
    opacity,
  };

  return (
    <group
      ref={setRef}
      position={[position[0], position[1], position[2]]}
      rotation={rotation}
      scale={typeof scale === 'number' ? [scale, scale, scale] : scale}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {/* Body */}
      <mesh castShadow={castShadow} receiveShadow={receiveShadow}>
        <boxGeometry args={[W - 0.08, brickH, D - 0.08]} />
        <meshStandardMaterial {...matProps} />
      </mesh>
      {/* Studs */}
      {Array.from({ length: studX }).map((_, si) =>
        Array.from({ length: studZ }).map((_, sj) => (
          <mesh
            key={`${si}-${sj}`}
            position={[
              (si - (studX - 1) / 2) * unit,
              brickH / 2 + 0.11,
              (sj - (studZ - 1) / 2) * unit,
            ]}
            castShadow={castShadow}
          >
            <cylinderGeometry args={[0.28, 0.28, 0.22, 14]} />
            <meshStandardMaterial {...matProps} />
          </mesh>
        ))
      )}
    </group>
  );
});

export default LegoBlock;
