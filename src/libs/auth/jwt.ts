'use server';

import { jwtVerify } from 'jose';
import { JWTExpired } from 'jose/errors';
import { apis } from '@/apis';
import { SessionType } from '@/stores/user';

const encodedKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

/**
 * JWT 검증하고 유효한 경우 페이로드를 반환 (만료시간도 같이 검증)
 */
export const verifyToken = async (accessToken: string) => {
  try {
    await jwtVerify<SessionType>(accessToken, encodedKey, {
      algorithms: ['HS256'],
    });
    const isBlacklist = await apis.auth.checkBlacklist(accessToken);
    return !isBlacklist;
  } catch (error) {
    if (error instanceof JWTExpired) {
      const isBlacklist = await apis.auth.checkBlacklist(accessToken);
      return !isBlacklist;
    }
    /* console.log('* 검증 실패'); */
    return false;
  }
};
