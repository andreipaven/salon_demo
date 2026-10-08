"use client";

import { RoundedBox } from "@react-three/drei";
import { plastic, graphite, steelDark, chrome, blue } from "./materials";

/* A clean, modern salon / barber chair — dark leather seat & back, chrome
   column + round hydraulic base, armrests and a footrest, with a subtle blue
   piping accent. Centered on the origin so it rotates nicely under OrbitControls. */
export default function Chair(props) {
  return (
    <group {...props} dispose={null}>
      {/* seat cushion */}
      <RoundedBox args={[1.5, 0.4, 1.45]} radius={0.16} smoothness={6} position={[0, 0, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...plastic} />
      </RoundedBox>
      {/* seat front piping (blue accent) */}
      <mesh position={[0, 0, 0.72]}>
        <boxGeometry args={[1.42, 0.05, 0.03]} />
        <meshStandardMaterial {...blue} />
      </mesh>

      {/* under-seat apron */}
      <RoundedBox args={[1.3, 0.3, 1.28]} radius={0.1} smoothness={5} position={[0, -0.3, 0]} castShadow>
        <meshStandardMaterial {...graphite} />
      </RoundedBox>

      {/* backrest (slightly reclined) */}
      <group position={[0, 1.05, -0.5]} rotation={[-0.1, 0, 0]}>
        <RoundedBox args={[1.5, 1.95, 0.4]} radius={0.22} smoothness={6} castShadow receiveShadow>
          <meshPhysicalMaterial {...plastic} />
        </RoundedBox>
        {/* vertical seam (blue) */}
        <mesh position={[0, 0, 0.21]}>
          <boxGeometry args={[0.06, 1.5, 0.02]} />
          <meshStandardMaterial {...blue} />
        </mesh>
        {/* channel tufting lines */}
        {[-0.45, 0.45].map((x) => (
          <mesh key={x} position={[x, 0, 0.2]}>
            <boxGeometry args={[0.03, 1.4, 0.02]} />
            <meshStandardMaterial color="#0a0b0e" metalness={0.2} roughness={0.7} />
          </mesh>
        ))}
        {/* headrest */}
        <RoundedBox args={[0.95, 0.45, 0.34]} radius={0.12} smoothness={5} position={[0, 1.15, 0.02]} castShadow>
          <meshPhysicalMaterial {...plastic} />
        </RoundedBox>
      </group>

      {/* armrests + chrome supports */}
      {[-1, 1].map((d) => (
        <group key={d}>
          <RoundedBox args={[0.34, 0.2, 1.2]} radius={0.09} smoothness={5} position={[d * 0.84, 0.5, 0.08]} castShadow>
            <meshPhysicalMaterial {...plastic} />
          </RoundedBox>
          <mesh position={[d * 0.84, 0.18, 0.5]} rotation={[0.2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.055, 0.055, 0.7, 14]} />
            <meshStandardMaterial {...chrome} />
          </mesh>
        </group>
      ))}

      {/* hydraulic column */}
      <mesh position={[0, -0.6, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.5, 20]} />
        <meshStandardMaterial {...steelDark} />
      </mesh>
      <mesh position={[0, -1.15, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.2, 0.9, 24]} />
        <meshStandardMaterial {...chrome} />
      </mesh>

      {/* round base */}
      <mesh position={[0, -1.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 1.05, 0.16, 28]} />
        <meshStandardMaterial {...chrome} />
      </mesh>
      <mesh position={[0, -1.46, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.14, 20]} />
        <meshStandardMaterial {...steelDark} />
      </mesh>

      {/* footrest: chrome bar + support */}
      <mesh position={[0, -0.78, 0.95]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.9, 14]} />
        <meshStandardMaterial {...chrome} />
      </mesh>
      <mesh position={[0, -0.95, 0.6]} rotation={[0.9, 0, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.8, 12]} />
        <meshStandardMaterial {...chrome} />
      </mesh>
    </group>
  );
}
