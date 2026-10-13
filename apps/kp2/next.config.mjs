/** @type {import("next").NextConfig} */
const nextConfig = {
  // KP2 is served at kharis.org/kp2. Next derives asset and route URLs
  // from this, so /kp2/_next/* resolves without a separate assetPrefix.
  basePath: "/kp2",
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
