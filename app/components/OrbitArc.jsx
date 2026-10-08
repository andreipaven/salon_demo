"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/* A few very thin, dark strands that flow behind the hero like strands of hair.
   Subtle (low opacity), black, drifting almost imperceptibly. */
function strand(points, radius) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  return new THREE.TubeGeometry(curve, 90, radius, 8, false);
}

export default function OrbitArc() {
  const group = useRef();

  const geos = useMemo(
    () => [
      { g: strand([[-5.0, -2.8, -1.6], [-2.4, -0.7, -1.2], [0.2, 0.9, -1.3], [2.9, 1.9, -1.1], [5.0, 2.9, -1.6]], 0.006), o: 0.2 },
      { g: strand([[5.0, -2.2, -1.4], [1.8, -0.4, -1.1], [-1.1, 1.0, -1.3], [-3.6, 2.3, -1.5], [-5.0, 3.0, -1.8]], 0.005), o: 0.15 },
      { g: strand([[-5.0, 1.7, -1.9], [-1.7, 0.3, -1.6], [1.4, -0.9, -1.6], [4.3, -2.3, -1.9]], 0.0045), o: 0.12 },
    ],
    []
  );

  useFrame((state) => {
    if (group.current) {
      const t = state.clock.elapsedTime;
      group.current.rotation.z = Math.sin(t * 0.05) * 0.03;
      group.current.position.y = Math.sin(t * 0.07) * 0.06;
    }
  });

  return (
    <group ref={group}>
      {geos.map(({ g, o }, i) => (
        <mesh key={i} geometry={g}>
          <meshBasicMaterial color="#0c0d10" transparent opacity={o} />
        </mesh>
      ))}
    </group>
  );
}
