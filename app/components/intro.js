// Shared intro state: when the preloader starts revealing the hero it stamps
// `startedAt` (performance.now); the hero's FloatingObjects read it to ramp their
// scale in — so the 3D objects appear progressively after the reveal.
export const intro = { startedAt: 0 };

export const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
