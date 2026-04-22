import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['netlify.duggydiggytunnel.store'],
  reactStrictMode: true,
  transpilePackages: ['mathjax-full'],
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.raw.py$/i,
      use: 'raw-loader',
    });
    return config;
  },
  turbopack: {
    resolveAlias: {
      '@': './src',
    },
    rules: {
      '*.raw.py': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;