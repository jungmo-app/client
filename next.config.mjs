/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'maps.googleapis.com' },
      { protocol: 'https', hostname: 'jungmobucket.s3.amazonaws.com' },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};
export default nextConfig;
