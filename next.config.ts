import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['mathjax-full'],
  images: {
    unoptimized: true,
  },

};

export default nextConfig;