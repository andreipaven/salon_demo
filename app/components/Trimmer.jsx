"use client";

import { RoundedBox } from "@react-three/drei";
import { graphite, steel, chrome, steelDark, blueEmissive } from "./materials";

/* Slim detail trimmer: narrow graphite body, fine T-blade, small button. */
export default function Trimmer(props) {
  return (
    <group {...props} dispose={null}>
      <RoundedBox args={[0.5, 1.9, 0.44]} radius={0.16} smoothness={6} castShadow receiveShadow>
        <meshStandardMaterial {...graphite} />
      </RoundedBox>

      {/* blade neck */}
      <RoundedBox args={[0.44, 0.3, 0.38]} radius={0.08} smoothness={4} position={[0, 1.08, 0.02]} castShadow>
        <meshStandardMaterial {...steelDark} />
      </RoundedBox>
      {/* T-blade */}
      <mesh position={[0, 1.3, 0.1]} castShadow>
        <boxGeometry args={[0.52, 0.12, 0.3]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      {Array.from({ length: 11 }).map((_, i) => (
        <mesh key={i} position={[-0.24 + (i / 10) * 0.48, 1.42, 0.22]} castShadow>
          <boxGeometry args={[0.022, 0.08, 0.1]} />
          <meshStandardMaterial {...chrome} />
        </mesh>
      ))}

      {/* button */}
      <RoundedBox args={[0.2, 0.3, 0.08]} radius={0.04} smoothness={4} position={[0, 0.3, 0.25]} castShadow>
        <meshStandardMaterial {...blueEmissive} />
      </RoundedBox>

      {/* chrome tail */}
      <mesh position={[0, -1.0, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.18, 0.1, 18]} />
        <meshStandardMaterial {...chrome} />
      </mesh>
    </group>
  );
}
