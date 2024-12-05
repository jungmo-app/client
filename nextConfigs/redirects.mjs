const BASE_URL = 'https://kauth.kakao.com/oauth/authorize?response_type=code';
const CLIENT_ID = process.env.KAKAO_AUTH_CLIENT_ID;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/kakaoauth`;

const KAKAO_AUTH_URL = `${BASE_URL}&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;

/**
 * 리다이렉션
 */
const redirects = [
  {
    source: '/auth/kakao/callback',
    destination: KAKAO_AUTH_URL,
    permanent: false,
  },
];

export default redirects;
