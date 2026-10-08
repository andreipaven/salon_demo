"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import Lighting from "./Lighting";
import useInViewFrameloop from "./useInViewFrameloop";
import { svc, presence, range, lerp, WINDOWS } from "./services-scroll";
import Scissors from "./Scissors";
import Comb from "./Comb";
import Clipper from "./Clipper";
import HairDryer from "./HairDryer";
import Brush from "./Brush";
import Product from "./Product";
import Trimmer from "./Trimmer";

/* Each service's object/group comes FORWARD from depth, holds at the focal
   point while slowly turning, then recedes as the next one advances — the
   objects themselves carry the transition (no plain cross-fade). */
function stageGroup(ref, p, t, { a, b, base, rotY = 1.1, tiltX = 0.12 }) {
  const g = ref.current;
  if (!g) return;
  const pr = presence(p, a, b);
  const s = pr * base;
  g.scale.setScalar(s);
  g.visible = s > 0.002;
  if (!g.visible) return;
  const l = range(p, a, b);
  let z = 0;
  if (l < 0.22) z = lerp(-2.8, 0, l / 0.22);
  else if (l > 0.78) z = lerp(0, -2.8, (l - 0.78) / 0.22);
  g.position.set(0, Math.sin(t * 0.5 + a * 9) * 0.08, z);
  g.rotation.set(tiltX, t * 0.28 + l * Math.PI * rotY, 0);
}

function Content({ mobile }) {
  const cam = useRef();
  const g0 = useRef();
  const g1 = useRef();
  const g2 = useRef();
  const g3 = useRef();
  // keep the object centered and below the text on both layouts
  const rightShift = mobile ? 0 : 0.2;
  const yShift = mobile ? -1.5 : -1.05;
  const m = mobile ? 0.56 : 0.92;

  useFrame((state) => {
    const p = svc.p;
    const t = state.clock.elapsedTime;
    stageGroup(g0, p, t, { a: WINDOWS[0][0], b: WINDOWS[0][1], base: 0.5 * m });
    stageGroup(g1, p, t, { a: WINDOWS[1][0], b: WINDOWS[1][1], base: 0.62 * m, rotY: 1.3 });
    stageGroup(g2, p, t, { a: WINDOWS[2][0], b: WINDOWS[2][1], base: 0.5 * m, rotY: 0.9 });
    stageGroup(g3, p, t, { a: WINDOWS[3][0], b: WINDOWS[3][1], base: 0.68 * m, rotY: 1.4 });

    if (cam.current) {
      cam.current.position.x = Math.sin(p * Math.PI * 2) * 0.22;
      cam.current.position.z = lerp(9, 8.5, p);
      cam.current.position.y = 0.1;
      cam.current.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault fov={mobile ? 36 : 32} position={[0, 0.1, 9]} />

      <group position={[rightShift, yShift, 0]}>
        {/* 01 — scissors + comb */}
        <group ref={g0}>
          <Scissors position={[0, -0.4, 0]} />
          <Comb position={[1.5, -0.8, -0.6]} scale={0.7} />
        </group>
        {/* 02 — clipper */}
        <group ref={g1}>
          <Clipper position={[0, -0.3, 0]} />
        </group>
        {/* 03 — dryer + brush + product */}
        <group ref={g2}>
          <HairDryer position={[0, 0.35, 0]} />
          <Brush position={[-1.7, -0.5, -0.3]} scale={0.8} />
          <Product position={[1.5, -0.5, -0.2]} scale={0.85} />
        </group>
        {/* 04 — trimmer (closer / larger) */}
        <group ref={g3}>
          <Trimmer position={[0, -0.2, 0]} />
        </group>
      </group>
    </>
  );
}

export default function ServicesScene({ mobile = false }) {
  const [wrapRef, frameloop] = useInViewFrameloop();

  useEffect(() => {
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="services-canvas" ref={wrapRef}>
      <Canvas
        frameloop={frameloop}
        shadows={!mobile}
        dpr={mobile ? [1, 1.4] : [1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <Suspense fallback={null}>
          <Lighting mobile={mobile} />
          <Content mobile={mobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}
