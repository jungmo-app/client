import nextConfigs from './nextConfigs/index.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'maps.googleapis.com' },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async rewrites() {
    return nextConfigs.rewrites;
  },
  async redirects() {
    return nextConfigs.redirects;
  },
};
export default nextConfig;
