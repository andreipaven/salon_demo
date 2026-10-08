"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { graphite, steelDark, chrome, blue } from "./materials";

/* Round styling brush: barrel core with radiating bristles. All bristles are
   merged into ONE geometry (1 draw call instead of ~60). */
export default function Brush(props) {
  const bristleGeo = useMemo(() => {
    const rings = [0.5, 0.74, 0.98, 1.22];
    const per = 14;
    const rCore = 0.14;
    const bLen = 0.26;
    const geos = [];
    for (const h of rings) {
      for (let i = 0; i < per; i++) {
        const a = (i / per) * Math.PI * 2;
        const g = new THREE.CylinderGeometry(0.012, 0.016, bLen, 5);
        const m = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0, -a, Math.PI / 2));
        const rc = rCore + bLen / 2;
        m.setPosition(Math.cos(a) * rc, h, Math.sin(a) * rc);
        g.applyMatrix4(m);
        geos.push(g);
      }
    }
    return mergeGeometries(geos);
  }, []);

  return (
    <group {...props} dispose={null}>
      <mesh position={[0, 0.86, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.14, 1.0, 16]} />
        <meshStandardMaterial {...steelDark} />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.14, 16, 12]} />
        <meshStandardMaterial {...chrome} />
      </mesh>
      <mesh geometry={bristleGeo} castShadow>
        <meshStandardMaterial {...graphite} />
      </mesh>
      <mesh position={[0, -0.1, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.13, 1.1, 18]} />
        <meshStandardMaterial {...graphite} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.135, 0.135, 0.1, 18]} />
        <meshStandardMaterial {...blue} />
      </mesh>
    </group>
  );
}
