'use server';

import { jwtVerify } from 'jose';
import { JWTExpired } from 'jose/errors';
import { SessionType } from '@/stores/user';

const encodedKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

/**
 * JWT 검증하고 유효한 경우 페이로드를 반환 (만료시간도 같이 검증)
 */
export const verifyToken = async (session: string | undefined = '') => {
  try {
    const { payload } = await jwtVerify<SessionType>(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    if (error instanceof JWTExpired) {
      /* console.log('* 만료'); */
      return 'expired';
    }
    /* console.log('* 검증 실패'); */
    return null;
  }
};
