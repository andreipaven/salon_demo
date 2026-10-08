"use client";

import { useEffect, useRef, useState } from "react";

/* Returns [ref, near]. `near` flips true once (and stays) when the element gets
   within rootMargin of the viewport — used to DEFER mounting a 3D <Canvas> until
   the user approaches it, so the initial load only pays for the hero. */
export default function useMountNear(rootMargin = "500px") {
  const ref = useRef(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near, rootMargin]);

  return [ref, near];
}
