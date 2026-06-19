import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/claude-app-sample',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
