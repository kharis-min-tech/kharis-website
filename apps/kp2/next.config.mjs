/** @type {import("next").NextConfig} */
const nextConfig = {
  // KP2 is served at kharis.org/kp2. Next derives asset and route URLs
  // from this, so /kp2/_next/* resolves without a separate assetPrefix.
  basePath: "/kp2",
  // Next 16 builds with Turbopack by default. The webpack hook is only a
  // local dev escape hatch, so an empty Turbopack config keeps that build valid.
  turbopack: {},
  webpack: (config, { dev }) => {
    // The filesystem cache fills a nearly full disk and the dev server then 500s.
    if (dev && process.env.KP2_NO_WEBPACK_CACHE === "1") config.cache = false;
    return config;
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "imgs.search.brave.com",
      },
      {
        protocol: "https",
        hostname: "cqgyiqxhpxwasogpdghx.supabase.co",
      },
      {
        protocol: "https",
        hostname: "kharis.org",
      },
      {
        protocol: "https",
        hostname: "www.kharis.org",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      {
        protocol: "https",
        hostname: "content.kharis.org",
      },
      {
        protocol: "https",
        hostname: "images.kharis.org",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=2592000",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
