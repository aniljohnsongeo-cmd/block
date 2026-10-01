import React, { useMemo } from 'react';
import * as THREE from 'three';
import { COLORS } from '../../utils/constants';

/**
 * Renders the assembled Deloitte HQ building from stacked LEGO bricks.
 * progress: 0 = fully disassembled/floating, 1 = fully assembled
 */
const LegoBuilding = ({ progress = 1, showLogo = false }) => {
  // Building definition: floors of blocks [x, z, studX, studZ, color, floorY]
  const floors = useMemo(() => {
    const def = [];

    // ── Ground floor base (wide red base plate) ──
    for (let x = -1; x <= 1; x++) {
      def.push({ x: x * 4, z: 0, studX: 4, studZ: 4, color: COLORS.legoRed,   floor: 0 });
    }

    // ── Floor 1 ──
    def.push({ x: -4, z: 0, studX: 4, studZ: 4, color: COLORS.legoBlue,   floor: 1 });
    def.push({ x: 0,  z: 0, studX: 4, studZ: 4, color: COLORS.legoRed,    floor: 1 });
    def.push({ x: 4,  z: 0, studX: 4, studZ: 4, color: COLORS.legoBlue,   floor: 1 });

    // ── Floor 2 ──
    def.push({ x: -4, z: 0, studX: 4, studZ: 4, color: COLORS.legoWhite,  floor: 2 });
    def.push({ x: 0,  z: 0, studX: 4, studZ: 4, color: COLORS.legoWhite,  floor: 2 });
    def.push({ x: 4,  z: 0, studX: 4, studZ: 4, color: COLORS.legoWhite,  floor: 2 });

    // ── Floor 3 ──
    def.push({ x: -4, z: 0, studX: 4, studZ: 4, color: COLORS.legoRed,    floor: 3 });
    def.push({ x: 0,  z: 0, studX: 4, studZ: 4, color: COLORS.legoBlue,   floor: 3 });
    def.push({ x: 4,  z: 0, studX: 4, studZ: 4, color: COLORS.legoRed,    floor: 3 });

    // ── Tower center (floors 4-7, narrowed) ──
    for (let f = 4; f <= 7; f++) {
      const col = f % 2 === 0 ? COLORS.legoWhite : COLORS.legoRed;
      def.push({ x: 0, z: 0, studX: 4, studZ: 4, color: col, floor: f });
    }

    // ── Roof cap ──
    def.push({ x: 0, z: 0, studX: 4, studZ: 4, color: COLORS.legoBlack, floor: 8 });

    return def;
  }, []);

  const brickH = 1.2;
  const unit = 1;
  const studH = 0.22;
  const brickBodyH = brickH + studH;

  return (
    <group>
      {floors.map((brick, i) => {
        const W = brick.studX * unit;
        const D = brick.studZ * unit;
        const targetY = brick.floor * brickBodyH;

        // Assembly: bricks fall from above
        const startY = targetY + 18 + i * 0.8;
        const currentY = THREE.MathUtils.lerp(startY, targetY, Math.min(1, progress * 1.2 - i * 0.015));

        return (
          <group key={i} position={[brick.x, currentY, brick.z]}>
            {/* Body */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[W - 0.08, brickH, D - 0.08]} />
              <meshStandardMaterial
                color={brick.color}
                roughness={0.28}
                metalness={0.04}
              />
            </mesh>
            {/* Studs */}
            {Array.from({ length: brick.studX }).map((_, si) =>
              Array.from({ length: brick.studZ }).map((_, sj) => (
                <mesh
                  key={`${si}-${sj}`}
                  position={[
                    (si - (brick.studX - 1) / 2) * unit,
                    brickH / 2 + 0.11,
                    (sj - (brick.studZ - 1) / 2) * unit,
                  ]}
                  castShadow
                >
                  <cylinderGeometry args={[0.30, 0.30, 0.22, 16]} />
                  <meshStandardMaterial
                    color={brick.color}
                    roughness={0.28}
                    metalness={0.04}
                  />
                </mesh>
              ))
            )}
          </group>
        );
      })}

      {/* Deloitte Logo facade — appears at showLogo */}
      {showLogo && (
        <group position={[0, 4 * brickBodyH + 0.1, 2.1]}>
          {/* Green dot */}
          <mesh>
            <circleGeometry args={[0.55, 32]} />
            <meshStandardMaterial color={COLORS.deloitteGreen} roughness={0.3} metalness={0.0} />
          </mesh>
          {/* "Deloitte" text rendered as extruded block strip */}
          {[-1.8, -0.9, 0, 0.9, 1.8, 2.7, 3.6].map((xOff, idx) => (
            <mesh key={idx} position={[xOff + 1.2, -0.85, 0]}>
              <boxGeometry args={[0.55, 0.28, 0.05]} />
              <meshStandardMaterial color={COLORS.legoBlack} roughness={0.4} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

export default LegoBuilding;
