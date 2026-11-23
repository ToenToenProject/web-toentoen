import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/supervisor/:path*",
        destination: "/login/admin/supervisor/:path*",
      },
    ];
  },
};

export default nextConfig;
