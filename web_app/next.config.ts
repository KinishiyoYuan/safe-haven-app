import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {},
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;