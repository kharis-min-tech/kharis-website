/** @type {import("next").NextConfig} */
const nextConfig = {
  // KP2 is served at kharis.org/kp2. Next derives asset and route URLs
  // from this, so /kp2/_next/* resolves without a separate assetPrefix.
  basePath: "/kp2",
  images: {
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
    ],
  },
};

export default nextConfig;
