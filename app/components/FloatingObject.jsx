"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { intro as introState, easeOutCubic, clamp01 } from "./intro";

/* Autonomous, mouse-free motion for a hero instrument: a slow continuous
   rotation + gentle vertical float + a tiny elliptical orbital drift, each with
   its own phase/speed so nothing moves in sync. Orbit radii are small so objects
   never wander into the central text safe-zone.

   When `intro` is set, the object scales in from 0 after the preloader reveal
   (stamped in intro.startedAt), with an optional per-object `appearDelay` (ms),
   so the 3D objects appear progressively. */
export default function FloatingObject({
  position = [0, 0, 0],
  baseRotation = [0, 0, 0],
  rotSpeed = [0, 0.12, 0],
  floatAmp = 0.14,
  floatSpeed = 0.5,
  orbitRadius = 0.16,
  orbitSpeed = 0.18,
  phase = 0,
  scale = 1,
  intro = false,
  appearDelay = 0,
  children,
}) {
  const ref = useRef();

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime + phase;

    g.position.x = position[0] + Math.cos(t * orbitSpeed) * orbitRadius;
    g.position.y =
      position[1] +
      Math.sin(t * floatSpeed) * floatAmp +
      Math.sin(t * orbitSpeed * 0.9) * orbitRadius * 0.4;
    g.position.z = position[2] + Math.sin(t * orbitSpeed * 0.7 + 1.3) * orbitRadius * 0.7;

    g.rotation.x = baseRotation[0] + t * rotSpeed[0];
    g.rotation.y = baseRotation[1] + t * rotSpeed[1];
    g.rotation.z = baseRotation[2] + t * rotSpeed[2];

    if (intro) {
      const st = introState.startedAt;
      const a = st ? easeOutCubic(clamp01((performance.now() - st - appearDelay) / 750)) : 0;
      g.scale.setScalar(scale * a);
    }
  });

  return (
    <group ref={ref} scale={intro ? 0 : scale} dispose={null}>
      {children}
    </group>
  );
}
