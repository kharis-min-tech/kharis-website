import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Served at content.kharis.org — the hostname is the mount point, so there
  // is no basePath. apps/kp2 is the one that uses basePath "/kp2".
  allowedDevOrigins: ["192.168.*.*", "*.local", "content.kharis.org"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cqgyiqxhpxwasogpdghx.supabase.co" }],
  },
  // The docs are static VitePress pages in public/documentation, built by `npm run build`.
  async redirects() {
    return [
      { source: "/documentation", destination: "/documentation/index.html", permanent: false },
    ];
  },
};

export default nextConfig;
