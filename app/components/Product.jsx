"use client";

import { graphite, steelDark, chrome, blue } from "./materials";

/* Styling product bottle — graphite body, dark label band with a thin blue
   accent, shoulder + cap. */
export default function Product(props) {
  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.42, 1.5, 28]} />
        <meshStandardMaterial {...graphite} />
      </mesh>
      {/* label band */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.425, 0.425, 0.62, 28]} />
        <meshStandardMaterial color="#0e0f13" metalness={0.2} roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.43, 0.43, 0.07, 28]} />
        <meshStandardMaterial {...blue} />
      </mesh>
      {/* shoulder */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.4, 0.3, 28]} />
        <meshStandardMaterial {...graphite} />
      </mesh>
      {/* cap */}
      <mesh position={[0, 1.13, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.22, 0.32, 28]} />
        <meshStandardMaterial {...steelDark} />
      </mesh>
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.03, 28]} />
        <meshStandardMaterial {...chrome} />
      </mesh>
    </group>
  );
}
