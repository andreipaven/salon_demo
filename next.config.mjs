/** @type {import('next').NextConfig} */
const nextConfig = {
  // react-three-fiber's custom reconciler + useFrame loops don't play well with
  // the React Compiler, so keep it off.
  reactCompiler: false,

  experimental: {
    // drei is a large barrel export; this makes Next pull in only the few
    // components we actually use instead of the whole package.
    optimizePackageImports: ["@react-three/drei"],
  },

  // next-intl setup without `createNextIntlPlugin`: that plugin eagerly requires
  // `@swc/core` (for an opt-in message extractor we don't use), which fails to
  // load in this environment. The plugin's only essential job is to alias
  // `next-intl/config` to our request-config module, so we do that directly.
  turbopack: {
    resolveAlias: {
      "next-intl/config": "./i18n/request.js",
    },
  },

  // Same alias for webpack, in case a build falls back from Turbopack.
  webpack: (config) => {
    config.resolve.alias["next-intl/config"] = new URL(
      "./i18n/request.js",
      import.meta.url
    ).pathname.replace(/^\/([A-Za-z]:)/, "$1");
    return config;
  },
};

export default nextConfig;
