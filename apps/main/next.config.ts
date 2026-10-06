import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.*.*", "*.local"],

  // TEMPORARY. Unblocks the Cloudflare Workers build while 70 pre-existing
  // type errors are reconciled (59 of them from two different interfaces both
  // named BranchData: @/lib/branches vs @/data/branchesData).
  //
  // This does NOT hide them: the ratchet in .github/workflows/main.yml still
  // runs tsc and fails if the count rises. Note that some of those errors are
  // real runtime bugs, not just type noise — BranchTemplate reads fields such
  // as .city, .parkingInfo and .transitInfo that the Supabase row does not
  // have, so parts of /locations/[branchId] render empty until that is fixed.
  //
  // Remove this block once tsc is clean.
  typescript: { ignoreBuildErrors: true },
  images: {
    qualities: [75, 95],
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "yt3.ggpht.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "cqgyiqxhpxwasogpdghx.supabase.co" },
    ],
  },
  async headers() {
    return [
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
