'use server';

import { cookies } from 'next/headers';
import { verifyToken } from './jwt';

const cookieName = 'accessToken';

export const getSession = async () => {
  const cookie = cookies().get(cookieName)?.value;
  console.log(cookie);
  return cookie;
};

/**
 * JWT 검증하고 유효한 경우 페이로드를 반환
 */
export const verifySession = async () => {
  const cookie = await getSession();
  const session = await verifyToken(cookie);

  if (!session) {
    console.log('* 세션 없음');
    return;
  }

  console.log('* 세션 있음');
  return session;
};
