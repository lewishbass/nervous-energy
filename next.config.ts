import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['xmldom-sre', 'mathjax-full'],
};

export default nextConfig;