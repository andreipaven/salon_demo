// Render-free scroll state for the Services section. The DOM writes `target`
// (0..1 across the four services); a rAF loop eases `p` toward it; the R3F scene
// reads `p` inside useFrame so scroll drives the 3D with no React re-renders.
export const svc = { p: 0, target: 0 };

export const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const lerp = (a, b, t) => a + (b - a) * t;
export const range = (p, a, b) => clamp01((p - a) / (b - a));

// Presence bump: 0 outside [a,b], 1 across the middle, with soft fades.
export function presence(p, a, b, f = 0.07) {
  if (p <= a - f || p >= b + f) return 0;
  const up = range(p, a - f, a + f);
  const dn = 1 - range(p, b - f, b + f);
  return clamp01(Math.min(up, dn));
}

// Window (and info-swap center) for each of the four services.
export const WINDOWS = [
  [0.0, 0.3],
  [0.26, 0.55],
  [0.51, 0.8],
  [0.76, 1.02],
];
