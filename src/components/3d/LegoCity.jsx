import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, CITY_BUILDINGS } from '../../utils/constants';

/**
 * Ambient motion: LEGO cars rolling on roads
 */
const Cars = () => {
  const carGroup = useRef();
  const positions = useMemo(() => [
    { x: -12, z: 0, dir: 1, speed: 1.8, color: COLORS.legoRed   },
    { x:  6,  z: 0, dir: -1, speed: 2.1, color: COLORS.legoBlue  },
    { x:  0,  z: 12, dir: 1, speed: 1.5, color: COLORS.legoYellow},
    { x:  0,  z: -12, dir: -1, speed: 2.0, color: COLORS.legoWhite},
  ], []);

  const carRefs = useRef(positions.map(() => React.createRef()));

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    positions.forEach((car, i) => {
      const ref = carRefs.current[i]?.current;
      if (!ref) return;
      // Horizontal roads: move along X, vertical roads: move along Z
      const isHoriz = car.z === 0;
      const speed = car.speed;
      if (isHoriz) {
        ref.position.x = ((car.x + car.dir * t * speed + 30) % 60) - 30;
      } else {
        ref.position.z = ((car.z + car.dir * t * speed + 30) % 60) - 30;
      }
    });
  });

  return (
    <group ref={carGroup}>
      {positions.map((car, i) => (
        <group
          key={i}
          ref={carRefs.current[i]}
          position={[car.x, 0.3, car.z]}
          rotation={[0, car.z === 0 ? 0 : Math.PI / 2, 0]}
        >
          {/* Car body */}
          <mesh castShadow>
            <boxGeometry args={[1.1, 0.4, 0.6]} />
            <meshStandardMaterial color={car.color} roughness={0.3} metalness={0.05} />
          </mesh>
          {/* Car roof */}
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.7, 0.28, 0.56]} />
            <meshStandardMaterial color={car.color} roughness={0.3} metalness={0.05} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/**
 * Animated pedestrian figures (minimal box humanoids)
 */
const People = () => {
  const paths = useMemo(() => [
    { x: -5, z: 4,   dx:  0.4, dz:  0  },
    { x:  5, z: -4,  dx: -0.3, dz:  0  },
    { x:  3, z:  6,  dx:  0,   dz: -0.5},
    { x: -3, z: -6,  dx:  0,   dz:  0.4},
  ], []);

  const refs = useRef(paths.map(() => React.createRef()));

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    paths.forEach((p, i) => {
      const ref = refs.current[i]?.current;
      if (!ref) return;
      ref.position.x = p.x + Math.sin(t * p.dx * 3) * 2.5;
      ref.position.z = p.z + Math.sin(t * p.dz * 3) * 2.5;
      // Subtle bob
      ref.position.y = 0.5 + Math.abs(Math.sin(t * 3)) * 0.04;
    });
  });

  return (
    <group>
      {paths.map((p, i) => (
        <group key={i} ref={refs.current[i]} position={[p.x, 0.5, p.z]}>
          {/* Body */}
          <mesh>
            <boxGeometry args={[0.18, 0.32, 0.12]} />
            <meshStandardMaterial color={COLORS.legoDarkGray} roughness={0.5} />
          </mesh>
          {/* Head */}
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.14, 0.14, 0.14]} />
            <meshStandardMaterial color="#E8C8A8" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/**
 * Animated water surface (gentle ripple via vertex displacement)
 */
const Water = () => {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const pos = meshRef.current.geometry.attributes.position;
    const t = clock.getElapsedTime();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, Math.sin(x * 1.2 + t * 1.5) * 0.04 + Math.cos(z * 1.0 + t * 1.2) * 0.04);
    }
    pos.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} position={[14, 0.01, 14]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[6, 6, 24, 24]} />
      <meshStandardMaterial
        color="#A8C8E0"
        roughness={0.05}
        metalness={0.2}
        transparent
        opacity={0.75}
      />
    </mesh>
  );
};

/**
 * LEGO City — a grid of supporting buildings, roads, trees, and ambient motion.
 * Visible only when cityVisible prop is true.
 */
const LegoCity = ({ cityVisible = false, onBuildingClick, onBuildingHover }) => {
  const opacity = cityVisible ? 1 : 0;

  // Supporting city buildings (non-interactive background)
  const bgBuildings = [
    { x: -14, z:  0, w: 2, h: 3.5, d: 2, color: COLORS.legoLightGray },
    { x:  14, z:  0, w: 2, h: 2.5, d: 2, color: COLORS.legoLightGray },
    { x:   0, z: -14, w: 2, h: 4.0, d: 2, color: COLORS.legoLightGray },
    { x:   0, z:  14, w: 2, h: 2.0, d: 2, color: COLORS.legoLightGray },
    { x: -10, z: -10, w: 2, h: 3.0, d: 2, color: COLORS.legoLightGray },
    { x:  10, z:  10, w: 2, h: 2.5, d: 2, color: COLORS.legoLightGray },
    { x: -16, z: -8,  w: 1.5, h: 1.5, d: 1.5, color: COLORS.legoLightGray },
    { x:  16, z:  8,  w: 1.5, h: 2.0, d: 1.5, color: COLORS.legoLightGray },
  ];

  if (!cityVisible) return null;

  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#FAFAFA" roughness={0.95} metalness={0} />
      </mesh>

      {/* Road grid — horizontal */}
      {[-1, 0, 1].map((row) => (
        <mesh key={`h${row}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, row * 13]}>
          <planeGeometry args={[80, 2.8]} />
          <meshStandardMaterial color="#E8E8E8" roughness={0.9} />
        </mesh>
      ))}
      {/* Road grid — vertical */}
      {[-1, 0, 1].map((col) => (
        <mesh key={`v${col}`} rotation={[-Math.PI / 2, 0, 0]} position={[col * 13, 0.02, 0]}>
          <planeGeometry args={[2.8, 80]} />
          <meshStandardMaterial color="#E8E8E8" roughness={0.9} />
        </mesh>
      ))}

      {/* Background (non-interactive) buildings */}
      {bgBuildings.map((b, i) => (
        <group key={i} position={[b.x, b.h / 2, b.z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color={b.color} roughness={0.5} metalness={0} />
          </mesh>
        </group>
      ))}

      {/* Interactive landmark buildings */}
      {CITY_BUILDINGS.map((building) => (
        <InteractiveBuilding
          key={building.id}
          building={building}
          onClick={() => onBuildingClick && onBuildingClick(building)}
          onHover={(hov) => onBuildingHover && onBuildingHover(building, hov)}
        />
      ))}

      {/* Ambient motion */}
      <Cars />
      <People />
      <Water />

      {/* Minimal LEGO trees (green cylinders on stubs) */}
      {[[-6, 5], [6, -5], [-5, -6], [5, 6], [-11, 5], [11, -5]].map(([tx, tz], i) => (
        <group key={i} position={[tx, 0, tz]}>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.8, 8]} />
            <meshStandardMaterial color="#8B6914" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <cylinderGeometry args={[0.55, 0.7, 0.9, 8]} />
            <meshStandardMaterial color={COLORS.legoGreen} roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.75, 0]}>
            <cylinderGeometry args={[0.3, 0.5, 0.7, 8]} />
            <meshStandardMaterial color={COLORS.legoGreen} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/**
 * A hoverable + clickable landmark building
 */
const InteractiveBuilding = ({ building, onClick, onHover }) => {
  const groupRef = useRef();
  const hovered = useRef(false);
  const liftY = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetLift = hovered.current ? 0.4 : 0;
    liftY.current = THREE.MathUtils.lerp(liftY.current, targetLift, delta * 8);
    groupRef.current.position.y = liftY.current;
  });

  const { size, color, position } = building;
  const brickH = 1.2;
  const floors = Math.round(size.h / brickH);

  return (
    <group
      ref={groupRef}
      position={[position[0], 0, position[2]]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerEnter={(e) => { e.stopPropagation(); hovered.current = true; onHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerLeave={(e) => { e.stopPropagation(); hovered.current = false; onHover(false); document.body.style.cursor = 'default'; }}
    >
      {/* Building floors */}
      {Array.from({ length: floors }).map((_, f) => {
        const fc = f % 2 === 0 ? color : lightenHex(color);
        return (
          <group key={f} position={[0, f * (brickH + 0.22) + brickH / 2, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[size.w - 0.08, brickH, size.d - 0.08]} />
              <meshStandardMaterial color={fc} roughness={0.28} metalness={0.04} />
            </mesh>
            {/* Top stud row */}
            {Array.from({ length: Math.floor(size.w) }).map((_, si) =>
              Array.from({ length: Math.floor(size.d) }).map((_, sj) => (
                <mesh key={`${si}-${sj}`} position={[
                  (si - (Math.floor(size.w) - 1) / 2),
                  brickH / 2 + 0.11,
                  (sj - (Math.floor(size.d) - 1) / 2),
                ]} castShadow>
                  <cylinderGeometry args={[0.28, 0.28, 0.22, 12]} />
                  <meshStandardMaterial color={fc} roughness={0.28} metalness={0.04} />
                </mesh>
              ))
            )}
          </group>
        );
      })}
    </group>
  );
};

/** Lighten a hex color slightly for alternating floors */
function lightenHex(hex) {
  const c = new THREE.Color(hex);
  c.multiplyScalar(1.18);
  return `#${c.getHexString()}`;
}

export default LegoCity;
