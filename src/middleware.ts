import { NextRequest, NextResponse } from 'next/server';
import { apis } from './apis';
import { verifyToken } from './libs/auth/jwt';
import { logout } from './utils/cookie';
import { parseSetCookie } from './utils/formatText';

export const middleware = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const response = NextResponse.next();

  if (!pathname.startsWith('/login') && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

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

  const api = await apis.auth.refreshToken(refreshToken);
  if (!api) {
    logout(response);
    return response;
  }

  const setCookieHeader = api.headers['set-cookie'];

  if (Array.isArray(setCookieHeader)) {
    setCookieHeader.forEach(cookie => {
      const { name, value, options } = parseSetCookie(cookie);
      response.cookies.set(name, value, options);
    });
  } else if (typeof setCookieHeader === 'string') {
    const { name, value, options } = parseSetCookie(setCookieHeader);
    response.cookies.set(name, value, options);
  }
  return response;
};

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|api).*)',
};
