import { NextRequest, NextResponse } from 'next/server';
import { apis } from '@/apis';
import { verifyToken } from '@/libs/auth/jwt';
import { parseSetCookie } from '@/utils/formatText';
import { resetCookie } from './utils/cookie';

export const middleware = async (request: NextRequest) => {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const response = NextResponse.next();

  if (!accessToken) {
    if (refreshToken) {
      resetCookie(response, 'refreshToken');
    }
    return response;
  }

  if (!refreshToken) {
    resetCookie(response, 'accessToken');
    return response;
  }

  try {
    const result = await verifyToken(accessToken);
    if (result === 'expired') {
      try {
        const api = await apis.auth.refreshToken(accessToken, refreshToken);
        const cookies = api.headers.getSetCookie();
        cookies.forEach(cookie => {
          const { name, value, options } = parseSetCookie(cookie);
          response.cookies.set(name, value, options);
        });
        return response;
      } catch (e) {
        throw new Error('failed refresh token');
      }
    }
    if (result) {
      return response;
    }
    throw new Error('invalid token');
  } catch (e) {
    console.error(e);
    resetCookie(response, 'accessToken');
    resetCookie(response, 'refreshToken');
    return response;
  }
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$).*)',
  ],
};
