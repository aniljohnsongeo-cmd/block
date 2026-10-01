import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, DISCIPLINES, SCROLL_PHASES } from '../../utils/constants';
import { mapRange } from '../../utils/legoGeometry';
import LegoBuilding from './LegoBuilding';
import LegoCity from './LegoCity';
import CameraController from './CameraController';

const brickH = 1.2 + 0.22; // body + stud height

/**
 * Master scene orchestrator.
 * scrollProgress: 0..1
 * focusTarget / selectedBuilding for city interaction
 */
const LegoScene = ({
  scrollProgress = 0,
  focusTarget,
  onFocusDone,
  onBuildingClick,
  onBuildingHover,
  selectedBuilding,
}) => {
  const { SINGLE_BLOCK, BLOCKS_ARRIVE, ASSEMBLY, BUILDING, ZOOM_OUT, CITY_REVEAL } = SCROLL_PHASES;

  // ── Phase helpers ──
  const singleBlockOpacity = mapRange(scrollProgress, 0, 0.08, 1, 1);

  // Each discipline block's animation
  const disciplines = useMemo(() => [
    { ...DISCIPLINES[0], startPos: [-14, 12, -6],  finalPos: [-4, 0, 0], studX: 2, studZ: 4 },
    { ...DISCIPLINES[1], startPos: [ 14, 16, -4],  finalPos: [-4, brickH, 0], studX: 2, studZ: 4 },
    { ...DISCIPLINES[2], startPos: [  0, 20,  14], finalPos: [ 0, 0, 0], studX: 4, studZ: 2 },
    { ...DISCIPLINES[3], startPos: [-12,  8, 14],  finalPos: [ 0, brickH, 0], studX: 4, studZ: 2 },
    { ...DISCIPLINES[4], startPos: [ 12, 18, 6],   finalPos: [ 4, 0, 0], studX: 2, studZ: 4 },
  ], []);

  // Arrival progress: BLOCKS_ARRIVE phase
  const arriveP = mapRange(scrollProgress, BLOCKS_ARRIVE.start, BLOCKS_ARRIVE.end, 0, 1);
  // Assembly progress: ASSEMBLY phase
  const assembleP = mapRange(scrollProgress, ASSEMBLY.start, ASSEMBLY.end, 0, 1);
  // Building phase
  const buildingP = mapRange(scrollProgress, BUILDING.start, BUILDING.end, 0, 1);
  // City visible
  const cityP = mapRange(scrollProgress, CITY_REVEAL.start, CITY_REVEAL.end, 0, 1);

  const showBuilding = scrollProgress >= ASSEMBLY.start;
  const showCity = scrollProgress >= ZOOM_OUT.start;
  const showDeloitteLogo = scrollProgress >= BUILDING.start + 0.05;

  return (
    <>
      {/* Camera control */}
      <CameraController
        scrollProgress={scrollProgress}
        focusTarget={focusTarget}
        onFocusDone={onFocusDone}
      />

      {/* Scene fog for depth */}
      <fog attach="fog" args={['#FFFFFF', 40, 130]} />

      {/* Premium white-theme lighting */}
      <ambientLight intensity={1.0} color="#FFFFFF" />
      <directionalLight
        position={[12, 22, 14]}
        intensity={2.0}
        color="#FFFFFF"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-35}
        shadow-camera-right={35}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
        shadow-bias={-0.0001}
      />
      {/* Warm fill from opposite side */}
      <directionalLight position={[-10, 14, -8]} intensity={0.5} color="#FFF5E8" />
      {/* Cool rim from back */}
      <directionalLight position={[0, 8, -20]} intensity={0.3} color="#E8F0FF" />
      <hemisphereLight skyColor="#FFFFFF" groundColor="#F0F0F0" intensity={0.6} />

      {/* Ground — pure white plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.95} metalness={0} />
      </mesh>

      {/* ── Phase 0: Single hero block ── */}
      {scrollProgress < BLOCKS_ARRIVE.end && (
        <SingleHeroBlock opacity={1} />
      )}

      {/* ── Phase 1: Discipline blocks arrive ── */}
      {scrollProgress >= BLOCKS_ARRIVE.start && disciplines.map((d, i) => {
        const stagger = i * 0.14;
        const localP = mapRange(arriveP, stagger, 1, 0, 1);
        const easedP = easeOutBack(Math.min(1, localP));

        // After assembly phase: continue to assemblePos
        const phase2P = assembleP;
        const currentX = THREE.MathUtils.lerp(
          THREE.MathUtils.lerp(d.startPos[0], d.finalPos[0], easedP),
          0, phase2P
        );
        const currentY = THREE.MathUtils.lerp(
          THREE.MathUtils.lerp(d.startPos[1], d.finalPos[1], easedP),
          d.finalPos[1], phase2P
        );
        const currentZ = THREE.MathUtils.lerp(
          THREE.MathUtils.lerp(d.startPos[2], d.finalPos[2], easedP),
          0, phase2P
        );

        return (
          <DisciplineBlock
            key={d.id}
            color={d.color}
            position={[currentX, currentY, currentZ]}
            studX={d.studX}
            studZ={d.studZ}
            label={d.label}
            opacity={1}
          />
        );
      })}

      {/* ── Phase 2+: Assembled building ── */}
      {showBuilding && (
        <LegoBuilding progress={assembleP * 1.4} showLogo={showDeloitteLogo} />
      )}

      {/* ── Phase 4+: Full city ── */}
      {showCity && (
        <LegoCity
          cityVisible={showCity}
          onBuildingClick={onBuildingClick}
          onBuildingHover={onBuildingHover}
        />
      )}
    </>
  );
};

/* ── Single hero brick on landing ── */
const SingleHeroBlock = () => {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.7) * 0.06 + 0.6;
    }
  });

  return (
    <group ref={meshRef} position={[0, 0.6, 0]}>
      {/* Brick body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.9, 1.2, 1.9]} />
        <meshStandardMaterial color={COLORS.legoRed} roughness={0.25} metalness={0.04} />
      </mesh>
      {/* 2×4 studs */}
      {[0, 1].map((si) =>
        [0, 1, 2, 3].map((sj) => (
          <mesh key={`${si}-${sj}`} position={[(si - 0.5) * 1.0, 0.71, (sj - 1.5) * 1.0]} castShadow>
            <cylinderGeometry args={[0.28, 0.28, 0.22, 16]} />
            <meshStandardMaterial color={COLORS.legoRed} roughness={0.25} metalness={0.04} />
          </mesh>
        ))
      )}
    </group>
  );
};

/* ── Discipline block with label ── */
const DisciplineBlock = ({ color, position, studX, studZ, label, opacity = 1 }) => {
  const unit = 1;
  const W = studX * unit;
  const D = studZ * unit;
  const bBody = 1.2;

  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[W - 0.08, bBody, D - 0.08]} />
        <meshStandardMaterial
          color={color}
          roughness={0.28}
          metalness={0.04}
          transparent={opacity < 1}
          opacity={opacity}
        />
      </mesh>
      {Array.from({ length: studX }).map((_, si) =>
        Array.from({ length: studZ }).map((_, sj) => (
          <mesh
            key={`${si}-${sj}`}
            position={[
              (si - (studX - 1) / 2) * unit,
              bBody / 2 + 0.11,
              (sj - (studZ - 1) / 2) * unit,
            ]}
            castShadow
          >
            <cylinderGeometry args={[0.28, 0.28, 0.22, 14]} />
            <meshStandardMaterial
              color={color}
              roughness={0.28}
              metalness={0.04}
              transparent={opacity < 1}
              opacity={opacity}
            />
          </mesh>
        ))
      )}
    </group>
  );
};

/* easeOutBack */
function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export default LegoScene;
