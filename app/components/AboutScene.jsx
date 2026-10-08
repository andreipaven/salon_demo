"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import Lighting from "./Lighting";
import Chair from "./Chair";
import useInViewFrameloop from "./useInViewFrameloop";

/* About composition: a single salon chair the visitor can rotate by dragging
   (mouse or finger). Same studio lighting / materials as the hero. It turns
   slowly on its own when idle; grabbing it takes over, then the slow spin
   resumes. No zoom / no pan so page scrolling stays natural. */
export default function AboutScene({ mobile = false }) {
  const [wrapRef, frameloop] = useInViewFrameloop();

  useEffect(() => {
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="about-canvas" style={{ cursor: "grab" }} ref={wrapRef}>
      <Canvas
        frameloop={frameloop}
        shadows={!mobile}
        dpr={mobile ? [1, 1.4] : [1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <PerspectiveCamera makeDefault fov={34} position={[0, 0.2, 9]} />
        <Suspense fallback={null}>
          <Lighting mobile={mobile} />
          <group scale={mobile ? 0.82 : 0.92} position={[0, -0.1, 0]}>
            <Chair />
          </group>
        </Suspense>
        <OrbitControls
          makeDefault
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          autoRotate
          autoRotateSpeed={0.9}
          rotateSpeed={0.7}
          minPolarAngle={Math.PI * 0.3}
          maxPolarAngle={Math.PI * 0.62}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
