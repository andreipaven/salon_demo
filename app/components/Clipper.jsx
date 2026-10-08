"use client";

import { RoundedBox } from "@react-three/drei";
import { graphite, graphiteSoft, steel, steelDark, chrome, blueEmissive } from "./materials";

export default function Clipper(props) {
  return (
    <group {...props} dispose={null}>
      {/* main ergonomic body */}
      <RoundedBox args={[0.92, 2.1, 0.62]} radius={0.2} smoothness={6} castShadow receiveShadow>
        <meshStandardMaterial {...graphite} />
      </RoundedBox>

      {/* tapered neck toward the blade */}
      <RoundedBox args={[0.78, 0.45, 0.52]} radius={0.12} smoothness={5} position={[0, 1.2, 0.03]} castShadow>
        <meshStandardMaterial {...steelDark} />
      </RoundedBox>

      {/* blade base */}
      <mesh position={[0, 1.5, 0.12]} castShadow>
        <boxGeometry args={[0.8, 0.22, 0.42]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      {/* blade teeth */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh key={i} position={[-0.36 + (i / 14) * 0.72, 1.68, 0.3]} castShadow>
          <boxGeometry args={[0.028, 0.12, 0.12]} />
          <meshStandardMaterial {...chrome} />
        </mesh>
      ))}

      {/* taper lever (blue accent) */}
      <RoundedBox args={[0.34, 0.5, 0.12]} radius={0.05} smoothness={4} position={[0, 0.55, 0.34]} castShadow>
        <meshStandardMaterial {...blueEmissive} />
      </RoundedBox>

      {/* grip ribs */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[0, -0.25 - i * 0.22, 0.33]}>
          <boxGeometry args={[0.6, 0.05, 0.03]} />
          <meshStandardMaterial {...graphiteSoft} />
        </mesh>
      ))}

      {/* power dot */}
      <mesh position={[0, 0.0, 0.34]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.04, 12]} />
        <meshStandardMaterial color="#9ec1ff" emissive="#2f6bff" emissiveIntensity={0.9} />
      </mesh>

      {/* chrome base cap */}
      <mesh position={[0, -1.08, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.34, 0.12, 24]} />
        <meshStandardMaterial {...chrome} />
      </mesh>
    </group>
  );
}
