import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['mathjax-full'],
  images: {
    unoptimized: false,
  },

};

export default nextConfig;