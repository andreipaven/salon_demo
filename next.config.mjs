const isProd = process.env.NODE_ENV === "production";

/* Content-Security-Policy, adapted to what this site actually loads: everything
   comes from our own origin. next/font self-hosts the Google fonts at build
   time, the 3D scenes are generated in code (no HDRI or model downloads), there
   are no third-party scripts, images or embeds. The social links in Contact are
   outgoing navigation, not subresources, so they need no entry here.
   Dev additionally needs eval and a websocket for hot reload. */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  // React renders inline style attributes (the --d reveal delays) and Next
  // injects its own <style> tags
  "style-src 'self' 'unsafe-inline'",
  // Next's hydration/RSC bootstrap is an inline script. Replacing
  // 'unsafe-inline' with a per-request nonce needs middleware and forces every
  // page to render dynamically — see the note in the project README/CLAUDE.md.
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
  `connect-src 'self'${isProd ? "" : " ws: wss:"}`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "media-src 'self'",
  ...(isProd ? ["upgrade-insecure-requests"] : []),
].join("; ");

/* Browser capabilities this site does not use are switched off outright. */
const permissionsPolicy = [
  "accelerometer=()",
  "autoplay=()",
  "camera=()",
  "display-capture=()",
  "encrypted-media=()",
  "fullscreen=()",
  "geolocation=()",
  "gyroscope=()",
  "magnetometer=()",
  "microphone=()",
  "midi=()",
  "payment=()",
  "picture-in-picture=()",
  "publickey-credentials-get=()",
  "screen-wake-lock=()",
  "usb=()",
  "xr-spatial-tracking=()",
].join(", ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: permissionsPolicy },
  // Production only: the site must be served exclusively over HTTPS for this to
  // be safe. Browsers ignore it on plain http anyway.
  ...(isProd
    ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
    : []),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // do not advertise the framework
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

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
