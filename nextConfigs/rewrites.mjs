/**
 * API 요청 리다이렉션
 */
const rewrites = [
  {
    source: '/api/:path*',
    destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`,
  },
];

export default rewrites;
