'use server';

import { errors, jwtVerify } from 'jose';

const encodedKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

/**
 * JWT 검증하고 블랙된 토큰인지 확인=> true: 이상 없음, false: 재발급 가능, undefined: 재발급 불가(삭제)
 */
export const verifyToken = async (accessToken: string) => {
  try {
    await jwtVerify(accessToken, encodedKey, {
      algorithms: ['HS256'],
    });
    return true;
  } catch (error) {
    if (error instanceof errors.JWTExpired || (error as { code?: string })?.code === 'ERR_JWT_EXPIRED') {
      return false;
    }
    /* console.log('* 검증 실패'); */
    return undefined;
  }
};
