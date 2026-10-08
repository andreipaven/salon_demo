"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { RoundedBox } from "@react-three/drei";
import { plastic, blue } from "./materials";

/* Barber comb: beveled spine + individual tapered teeth (fine half / wide half),
   premium dark charcoal plastic. All teeth merged into ONE geometry. */
export default function Comb(props) {
  const teethGeo = useMemo(() => {
    const geos = [];
    const fine = 24;
    const wide = 11;
    for (let i = 0; i < fine; i++) {
      const x = -1.5 + (i / (fine - 1)) * 1.42;
      const g = new THREE.BoxGeometry(0.035, 0.95, 0.08);
      g.translate(x, -0.12, 0);
      geos.push(g);
    }
    for (let i = 0; i < wide; i++) {
      const x = 0.1 + (i / (wide - 1)) * 1.4;
      const g = new THREE.BoxGeometry(0.055, 1.05, 0.09);
      g.translate(x, -0.18, 0);
      geos.push(g);
    }
    return mergeGeometries(geos);
  }, []);

  return (
    <group {...props} dispose={null}>
      <RoundedBox args={[3.1, 0.26, 0.11]} radius={0.05} smoothness={4} position={[0, 0.42, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...plastic} />
      </RoundedBox>
      <mesh geometry={teethGeo} castShadow>
        <meshPhysicalMaterial {...plastic} />
      </mesh>
      <mesh position={[0, 0.56, 0.055]}>
        <boxGeometry args={[3.1, 0.035, 0.015]} />
        <meshStandardMaterial {...blue} />
      </mesh>
    </group>
  );
}
