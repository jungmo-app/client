import { NextRequest, NextResponse } from 'next/server';
import { apis } from './apis';
import { verifyToken } from './libs/auth/jwt';
import { logout } from './utils/cookie';
import { parseSetCookie } from './utils/formatText';

export const middleware = async (request: NextRequest) => {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const response = NextResponse.next();

  if (!accessToken || !refreshToken) {
    logout(response);
    return response;
  }
  const isValidToken = await verifyToken(accessToken);

  if (isValidToken) {
    return response;
  }

  if (isValidToken === undefined) {
    logout(response);
    return response;
  }

  const api = await apis.auth.refreshToken(accessToken, refreshToken);
  if (!api) {
    logout(response);
    return response;
  }

  const cookies = (api.headers as unknown as Headers & { getSetCookie: () => string[] }).getSetCookie();
  cookies.forEach(cookie => {
    const { name, value, options } = parseSetCookie(cookie);
    response.cookies.set(name, value, options);
  });
  return response;
};

export const config = {
  matcher: '/login/:path*',
};
