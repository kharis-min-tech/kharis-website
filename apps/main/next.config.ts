import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.*.*", "*.local"],

  images: {
    // AVIF was off because encoding a large photo at quality 95 was said to
    // take over a minute, leaving the tile empty. Re-measured on 2026-11-22
    // against hero/impartation-celebration.jpg at w=1920: 2.0s at q80, 1.8s at
    // q90, 1.6s at q95 - so whatever caused that is not present on this
    // version. The saving is large enough to be worth having: that photograph
    // is 52KB as AVIF q80 against 220KB as WebP q95, which is what the site
    // served before. If a tile ever does render empty, this is the first
    // setting to suspect.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    // Every quality any call site asks for has to be listed here or the request
    // is rejected. 80 is SiteImage's default; the rest are explicit overrides.
    qualities: [75, 80, 90, 95],
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
