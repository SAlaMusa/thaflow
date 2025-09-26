import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove output: 'export' for Vercel - it supports full Next.js features
  trailingSlash: true,
  images: {
    // Vercel supports optimized images, but keep unoptimized for compatibility
    unoptimized: true
  },
  // Remove basePath and assetPrefix - not needed for Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
