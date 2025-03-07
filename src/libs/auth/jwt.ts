'use server';

import { jwtVerify } from 'jose';
import { JWTExpired } from 'jose/errors';
import { apis } from '@/apis';
import { SessionType } from '@/stores/user';

const encodedKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

/**
 * JWT 검증하고 블랙된 토큰인지 확인=> true: 이상 없음, false: 재발급 가능, undefined: 재발급 불가(삭제)
 */
export const verifyToken = async (accessToken: string) => {
  try {
    await jwtVerify<SessionType>(accessToken, encodedKey, {
      algorithms: ['HS256'],
    });
    const isBlacklist = await apis.auth.checkBlacklist(accessToken);
    if (isBlacklist) {
      return undefined;
    }
    return true;
  } catch (error) {
    if (error instanceof JWTExpired) {
      const isBlacklist = await apis.auth.checkBlacklist(accessToken);
      if (isBlacklist) {
        return undefined;
      }
      return false;
    }
    /* console.log('* 검증 실패'); */
    return undefined;
  }
};
