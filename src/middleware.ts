import { NextRequest, NextResponse } from 'next/server';
import { apis } from './apis';
import { verifyToken } from './libs/auth/jwt';

export const middleware = async (request: NextRequest) => {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const response = NextResponse.next();

  if (!accessToken) {
    if (refreshToken) {
      response.cookies.delete('refreshToken');
    }
    return response;
  }

  if (!refreshToken) {
    response.cookies.delete('accessToken');
    return response;
  }

  try {
    const result = await verifyToken(accessToken);
    if (result === 'expired' && refreshToken) {
      await apis.auth.refreshToken(refreshToken);
      return response;
    }

    if (result && result !== 'expired') {
      return response;
    }
    throw new Error('failed jwt verify');
  } catch {
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
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
