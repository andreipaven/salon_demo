"use client";

import { Environment, Lightformer, ContactShadows } from "@react-three/drei";

/* White-studio lighting: soft key + cool fill + rim, plus a procedural
   environment (Lightformers — no network HDRI) for believable metal reflections,
   and very discreet contact shadows. */
export default function Lighting({ mobile = false }) {
  return (
    <>
      <ambientLight intensity={0.55} />

      {/* key */}
      <directionalLight
        position={[5, 8, 6]}
        intensity={2.3}
        castShadow={!mobile}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0004}
      />
      {/* cool fill */}
      <directionalLight position={[-7, 2, 4]} intensity={0.5} color="#cfe0ff" />
      {/* rim from behind-top */}
      <directionalLight position={[0, 5, -7]} intensity={0.9} color="#ffffff" />

      <Environment resolution={mobile ? 128 : 256} frames={1}>
        <color attach="background" args={["#111318"]} />
        <Lightformer intensity={2.4} position={[0, 4, -4]} scale={[12, 5, 1]} color="#ffffff" />
        <Lightformer intensity={1.5} position={[-6, 1, 2]} scale={[5, 8, 1]} color="#eaf1ff" />
        <Lightformer intensity={1.3} position={[6, 0, 2]} scale={[5, 8, 1]} color="#dfe9ff" />
        <Lightformer intensity={1} form="ring" position={[3, 3, -2]} scale={3} color="#9fc0ff" />
        <Lightformer intensity={0.7} position={[0, -5, 2]} scale={[12, 4, 1]} color="#ffffff" />
      </Environment>

      {!mobile && (
        <ContactShadows
          position={[0, -3.1, 0]}
          opacity={0.14}
          scale={26}
          blur={3.2}
          far={7}
          frames={1}
          resolution={256}
          color="#1a2740"
        />
      )}
    </>
  );
}
