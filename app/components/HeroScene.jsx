"use client";

import { Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import useInViewFrameloop from "./useInViewFrameloop";
import Lighting from "./Lighting";
import FloatingObject from "./FloatingObject";
import OrbitArc from "./OrbitArc";
import Scissors from "./Scissors";
import Clipper from "./Clipper";
import Comb from "./Comb";
import Trimmer from "./Trimmer";
import HairDryer from "./HairDryer";
import Brush from "./Brush";

/* Each entry: component, world position (outside the central text safe-zone),
   a per-model recenter offset (+ scale) so visual centers sit on the origin,
   and individual motion params so nothing animates in sync. */
// A 3D frame hugging the CORNERS + far sides of the central text rectangle.
// Organic & slightly asymmetric; every object stays well outside the center and
// has a small, controlled motion range (tiny orbit + gentle float) so it never
// drifts over the text. Top: scissors (TL) + clipper (TR). Bottom: comb (BL) +
// hair dryer (BR). Far sides: trimmer (right) + brush (left).
const DESKTOP = [
  // top-left corner
  { C: Scissors, pos: [-3.5, 1.55, 0.35], scale: 0.5, off: [0, -0.4, 0], rot: [0.12, 0, 0.18],
    p: { rotSpeed: [0.016, 0.09, 0], floatAmp: 0.13, floatSpeed: 0.5, orbitRadius: 0.1, orbitSpeed: 0.16, phase: 0 } },
  // top-right corner
  { C: Clipper, pos: [3.5, 1.5, 0.1], scale: 0.6, off: [0, -0.3, 0], rot: [0.1, -0.35, -0.12],
    p: { rotSpeed: [0, 0.085, 0], floatAmp: 0.13, floatSpeed: 0.44, orbitRadius: 0.1, orbitSpeed: 0.14, phase: 1.1 } },
  // bottom-left corner
  { C: Comb, pos: [-3.7, -1.9, -0.25], scale: 0.7, off: [0, 0.05, 0], rot: [0.14, 0.22, -0.2],
    p: { rotSpeed: [0.01, 0.07, 0.015], floatAmp: 0.14, floatSpeed: 0.47, orbitRadius: 0.1, orbitSpeed: 0.12, phase: 4.2 } },
  // bottom-right corner
  { C: HairDryer, pos: [3.75, -1.85, -0.8], scale: 0.7, off: [0, 0.55, 0], rot: [0.08, 0.55, 0.04],
    p: { rotSpeed: [0, 0.06, 0.012], floatAmp: 0.13, floatSpeed: 0.4, orbitRadius: 0.1, orbitSpeed: 0.13, phase: 2.5 } },
  // far-right side accent (mid height, pushed out — stays on-screen down to ~1.55 aspect)
  { C: Trimmer, pos: [4.2, 0.3, 0.3], scale: 0.52, off: [0, -0.2, 0], rot: [0.1, 0.3, 0.14],
    p: { rotSpeed: [0, 0.09, 0.01], floatAmp: 0.12, floatSpeed: 0.58, orbitRadius: 0.09, orbitSpeed: 0.2, phase: 3.4 } },
  // far-left side accent (mid height, pushed out)
  { C: Brush, pos: [-4.25, -0.35, -0.55], scale: 0.62, off: [0, -0.45, 0], rot: [0.2, 0, 0.22],
    p: { rotSpeed: [0.012, 0.08, 0], floatAmp: 0.13, floatSpeed: 0.52, orbitRadius: 0.09, orbitSpeed: 0.15, phase: 5.3 } },
];

// Mobile (portrait): four small instruments framing the four corners, pulled in
// close to the text (small scale, modest |x|/|y|).
const MOBILE = [
  // top-left (scissors) — small, close to the title
  { C: Scissors, pos: [-1.15, 1.95, 0.2], scale: 0.26, off: [0, -0.4, 0], rot: [0.12, 0, 0.16],
    p: { rotSpeed: [0.015, 0.09, 0], floatAmp: 0.08, floatSpeed: 0.5, orbitRadius: 0.05, orbitSpeed: 0.16, phase: 0 } },
  // top-right (clipper) — small, close to the title
  { C: Clipper, pos: [1.2, 2.05, 0], scale: 0.32, off: [0, -0.3, 0], rot: [0.1, -0.35, -0.12],
    p: { rotSpeed: [0, 0.085, 0], floatAmp: 0.08, floatSpeed: 0.44, orbitRadius: 0.05, orbitSpeed: 0.14, phase: 1.1 } },
  /* The bottom pair sits in the band where the hero overlaps the top of About
     (the section is pulled up by -20vh). They must stay clear of the canvas'
     bottom edge, which crops anything that reaches it — at y -2.55 both were
     sliced flat in half. */
  // bottom-left
  { C: Comb, pos: [-1.12, -1.88, -0.2], scale: 0.32, off: [0, 0.05, 0], rot: [0.14, 0.22, -0.2],
    p: { rotSpeed: [0.01, 0.07, 0.015], floatAmp: 0.1, floatSpeed: 0.47, orbitRadius: 0.06, orbitSpeed: 0.12, phase: 4.2 } },
  // bottom-right
  { C: HairDryer, pos: [1.16, -1.95, -0.3], scale: 0.34, off: [0, 0.55, 0], rot: [0.08, 0.55, 0.04],
    p: { rotSpeed: [0, 0.06, 0.012], floatAmp: 0.1, floatSpeed: 0.4, orbitRadius: 0.06, orbitSpeed: 0.13, phase: 2.5 } },
];

// Fires once, on the hero scene's first rendered frame, so the preloader knows
// the 3D is actually ready (not just the HTML).
let heroSignaled = false;
function Ready() {
  useFrame(() => {
    if (!heroSignaled) {
      heroSignaled = true;
      window.dispatchEvent(new Event("hero-ready"));
    }
  });
  return null;
}

function CameraRig() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.1) * 0.12;
    state.camera.position.y = Math.cos(t * 0.08) * 0.08;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene({ mobile = false }) {
  const [wrapRef, frameloop] = useInViewFrameloop();

  // R3F sometimes measures the fixed container as 0 at mount -> nudge a re-measure.
  useEffect(() => {
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    return () => cancelAnimationFrame(id);
  }, []);

  const objects = mobile ? MOBILE : DESKTOP;

  return (
    <div className="hero-canvas" ref={wrapRef}>
      <Canvas
        frameloop={frameloop}
        shadows={!mobile}
        dpr={mobile ? [1, 1.4] : [1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={() => window.dispatchEvent(new Event("hero-ready"))}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <PerspectiveCamera makeDefault fov={32} position={[0, 0, 10]} />
        <CameraRig />
        <Suspense fallback={null}>
          <Ready />
          <Lighting mobile={mobile} />
          <OrbitArc />
          {objects.map(({ C, pos, scale, off, rot, p }, i) => (
            <FloatingObject key={i} position={pos} scale={scale} baseRotation={rot} intro appearDelay={300 + i * 150} {...p}>
              <C position={off} />
            </FloatingObject>
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}
