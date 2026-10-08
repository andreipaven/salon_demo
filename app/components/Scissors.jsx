"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { steel, steelDark, chrome, blueEmissive } from "./materials";

export default function Scissors(props) {
  const bladeGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0.0, 0.0);
    s.lineTo(0.12, 0.14);
    s.lineTo(0.1, 1.5);
    s.lineTo(0.05, 2.0);
    s.lineTo(0.0, 2.3); // tip
    s.lineTo(-0.03, 2.0);
    s.lineTo(-0.055, 0.14);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.07,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.022,
      bevelSegments: 3,
      steps: 1,
    });
    g.translate(0, 0, -0.035);
    g.computeVertexNormals();
    return g;
  }, []);

  const shankGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.02, 0),
      new THREE.Vector3(0.14, -0.45, 0),
      new THREE.Vector3(0.3, -0.9, 0),
      new THREE.Vector3(0.33, -1.3, 0),
    ]);
    return new THREE.TubeGeometry(curve, 16, 0.05, 8, false);
  }, []);

  return (
    <group {...props} dispose={null}>
      {/* blades (crossed) */}
      <group rotation={[0, 0, 0.1]} position={[0.03, 0, 0.04]}>
        <mesh geometry={bladeGeo} castShadow receiveShadow>
          <meshStandardMaterial {...steel} />
        </mesh>
        {/* cutting-edge highlight */}
        <mesh position={[-0.05, 1.1, 0.04]}>
          <boxGeometry args={[0.018, 2.0, 0.02]} />
          <meshStandardMaterial {...chrome} />
        </mesh>
      </group>
      <group rotation={[0, 0, -0.1]} position={[-0.03, 0, -0.04]} scale={[-1, 1, 1]}>
        <mesh geometry={bladeGeo} castShadow receiveShadow>
          <meshStandardMaterial {...steel} />
        </mesh>
        <mesh position={[-0.05, 1.1, 0.04]}>
          <boxGeometry args={[0.018, 2.0, 0.02]} />
          <meshStandardMaterial {...chrome} />
        </mesh>
      </group>

      {/* shanks */}
      <mesh geometry={shankGeo} castShadow>
        <meshStandardMaterial {...steelDark} />
      </mesh>
      <mesh geometry={shankGeo} scale={[-1, 1, 1]} castShadow>
        <meshStandardMaterial {...steelDark} />
      </mesh>

      {/* finger rings */}
      {[1, -1].map((d) => (
        <mesh key={d} position={[d * 0.33, -1.52, 0]} castShadow>
          <torusGeometry args={[0.27, 0.06, 12, 24]} />
          <meshStandardMaterial {...steelDark} />
        </mesh>
      ))}

      {/* central screw (blue accent) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.11, 0.2, 16]} />
        <meshStandardMaterial {...blueEmissive} />
      </mesh>
      <mesh position={[0, 0, 0.11]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.04, 12]} />
        <meshStandardMaterial {...chrome} />
      </mesh>
    </group>
  );
}
