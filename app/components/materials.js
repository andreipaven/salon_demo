// Shared premium materials for the hero instruments.
// Spread into <meshStandardMaterial {...steel} /> (plastic -> meshPhysicalMaterial).

export const steel = { color: "#d0d4da", metalness: 1, roughness: 0.16, envMapIntensity: 1.4 };
export const steelDark = { color: "#9ca2ab", metalness: 1, roughness: 0.3, envMapIntensity: 1.2 };
export const chrome = { color: "#eceff3", metalness: 1, roughness: 0.07, envMapIntensity: 1.6 };
export const graphite = { color: "#23262c", metalness: 0.85, roughness: 0.32, envMapIntensity: 1.05 };
export const graphiteSoft = { color: "#2e323a", metalness: 0.55, roughness: 0.42, envMapIntensity: 0.95 };
export const plastic = { color: "#14161b", metalness: 0.05, roughness: 0.5, clearcoat: 1, clearcoatRoughness: 0.3 };
export const blue = { color: "#2f6bff", metalness: 0.4, roughness: 0.25, envMapIntensity: 1.2 };
export const blueEmissive = { color: "#2f6bff", metalness: 0.4, roughness: 0.25, emissive: "#1b3fae", emissiveIntensity: 0.35 };
