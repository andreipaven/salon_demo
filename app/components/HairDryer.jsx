"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { graphite, steelDark, chrome, blue } from "./materials";

/* Hair dryer: a lathed barrel (nice rounded profile) with a cone nozzle, a blue
   accent ring, a concentric back grille and an angled handle. */
export default function HairDryer(props) {
  const barrelGeo = useMemo(() => {
    const pts = [
      [0.0, -0.95], [0.4, -0.95], [0.52, -0.8], [0.54, -0.2],
      [0.54, 0.55], [0.5, 0.78], [0.38, 0.9], [0.0, 0.92],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const g = new THREE.LatheGeometry(pts, 36);
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <group {...props} dispose={null}>
      {/* barrel laid horizontally (nozzle toward +X) */}
      <group rotation={[0, 0, -Math.PI / 2]}>
        <mesh geometry={barrelGeo} castShadow receiveShadow>
          <meshStandardMaterial {...graphite} />
        </mesh>
        {/* front blue accent ring */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <torusGeometry args={[0.46, 0.05, 14, 32]} />
          <meshStandardMaterial {...blue} />
        </mesh>
        {/* nozzle */}
        <mesh position={[0, 1.08, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.5, 0.36, 32]} />
          <meshStandardMaterial {...steelDark} />
        </mesh>
        {/* back grille rings */}
        {[0.18, 0.32, 0.44].map((r) => (
          <mesh key={r} position={[0, -0.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r, 0.015, 8, 24]} />
            <meshStandardMaterial {...steelDark} />
          </mesh>
        ))}
      </group>

      {/* handle */}
      <group position={[-0.1, -0.95, 0]} rotation={[0, 0, 0.12]}>
        <RoundedBox args={[0.44, 1.5, 0.5]} radius={0.16} smoothness={6} castShadow>
          <meshStandardMaterial {...graphite} />
        </RoundedBox>
        {/* chrome ferrule */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.26, 0.26, 0.14, 24]} />
          <meshStandardMaterial {...chrome} />
        </mesh>
        {/* button */}
        <RoundedBox args={[0.22, 0.34, 0.08]} radius={0.04} smoothness={4} position={[0, 0.1, 0.27]}>
          <meshStandardMaterial {...blue} />
        </RoundedBox>
      </group>
    </group>
  );
}
