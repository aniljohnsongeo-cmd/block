import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { CAMERA_KEYFRAMES } from '../../utils/constants';

/**
 * Scroll-driven + click-driven camera controller.
 * Uses useFrame (R3F's render loop) to smoothly interpolate camera.
 */
const CameraController = ({ scrollProgress = 0, focusTarget = null, onFocusDone }) => {
  const { camera } = useThree();
  const isFocused = useRef(false);
  const currentPos = useRef(new THREE.Vector3(...CAMERA_KEYFRAMES[0].position));
  const currentLook = useRef(new THREE.Vector3(...CAMERA_KEYFRAMES[0].target));
  const targetPos = useRef(new THREE.Vector3(...CAMERA_KEYFRAMES[0].position));
  const targetLook = useRef(new THREE.Vector3(...CAMERA_KEYFRAMES[0].target));

  // Init camera once
  useEffect(() => {
    camera.fov = 52;
    camera.near = 0.1;
    camera.far = 500;
    camera.updateProjectionMatrix();
  }, [camera]);

  // Building focus: fire a GSAP tween, mark focused
  useEffect(() => {
    if (!focusTarget) {
      isFocused.current = false;
      return;
    }
    const [fx, fy, fz] = focusTarget;
    isFocused.current = true;

    gsap.to(camera.position, {
      x: fx + 8,
      y: fy + 6,
      z: fz + 10,
      duration: 1.4,
      ease: 'power3.inOut',
      onUpdate: () => camera.lookAt(fx, fy, fz),
      onComplete: () => onFocusDone && onFocusDone(),
    });
  }, [focusTarget, camera, onFocusDone]);

  // Every frame: interpolate scroll-driven camera (skip when focused)
  useFrame(() => {
    if (isFocused.current) return;

    const p = Math.max(0, Math.min(1, scrollProgress));
    const kfs = CAMERA_KEYFRAMES;
    const n = kfs.length;
    const segLen = 1 / (n - 1);
    const seg = Math.min(Math.floor(p / segLen), n - 2);
    const t = (p - seg * segLen) / segLen;
    // ease-in-out quad
    const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const a = kfs[seg];
    const b = kfs[seg + 1];

    targetPos.current.set(
      a.position[0] + (b.position[0] - a.position[0]) * eased,
      a.position[1] + (b.position[1] - a.position[1]) * eased,
      a.position[2] + (b.position[2] - a.position[2]) * eased,
    );
    targetLook.current.set(
      a.target[0] + (b.target[0] - a.target[0]) * eased,
      a.target[1] + (b.target[1] - a.target[1]) * eased,
      a.target[2] + (b.target[2] - a.target[2]) * eased,
    );

    currentPos.current.lerp(targetPos.current, 0.06);
    currentLook.current.lerp(targetLook.current, 0.06);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLook.current);
  });

  return null;
};

export default CameraController;
