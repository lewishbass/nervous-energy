import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['mathjax-full'],
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['react-icons'],
  },

};

export default nextConfig;