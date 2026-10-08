"use client";

import { useEffect, useRef, useState } from "react";

/* Returns [ref, frameloop]. Attach ref to the canvas wrapper; frameloop is
   "always" while the wrapper is near/in the viewport and "never" otherwise, so
   an off-screen R3F <Canvas> stops rendering entirely (big GPU/CPU saving when
   a page has more than one scene). */
export default function useInViewFrameloop(rootMargin = "250px") {
  const ref = useRef(null);
  const [frameloop, setFrameloop] = useState("always");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setFrameloop(entry.isIntersecting ? "always" : "never"),
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return [ref, frameloop];
}
