import nextConfigs from './nextConfigs/index.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  async rewrites() {
    return nextConfigs.rewrites;
  },

  async redirects() {
    return nextConfigs.redirects;
  },
};

export default nextConfig;
