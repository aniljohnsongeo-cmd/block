import * as THREE from 'three';

/**
 * Lerp utility between two values
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Map a value from one range to another, clamped 0..1
 */
export function mapRange(value, inMin, inMax, outMin, outMax) {
  if (inMax === inMin) return outMin;
  const t = Math.max(0, Math.min(1, (value - inMin) / (inMax - inMin)));
  return outMin + (outMax - outMin) * t;
}
