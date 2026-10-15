import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.*.*", "*.local"],

  images: {
    // AVIF encoding of large photos at quality 95 can take over a minute, so the
    // browser gives up and the tile stays empty. WebP is near-instant.
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    qualities: [75, 90, 95],
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "yt3.ggpht.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "cqgyiqxhpxwasogpdghx.supabase.co" },
      { protocol: "https", hostname: "kharis.org" },
      { protocol: "https", hostname: "www.kharis.org" },
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "content.kharis.org" },
      { protocol: "https", hostname: "images.kharis.org" },
      { protocol: "http", hostname: "localhost", port: "3002", pathname: "/api/media/**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=2592000",
          },
        ],
      },
      {
        source: "/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          { key: "Accept-Ranges", value: "bytes" },
        ],
      },
    ];
  },
};

export default nextConfig;
