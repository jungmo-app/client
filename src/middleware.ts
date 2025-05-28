import { NextRequest, NextResponse } from 'next/server';
import { apiPaths } from './constants/apis';
import { verifyToken } from './libs/auth/jwt';
import { logout, setRawCookie } from './utils/cookie';

export const middleware = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;
  const refer = searchParams.get('refer');
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isStaticAsset = /\.(js|css|png|jpg|jpeg|svg|webp|ico|woff2?)$/.test(pathname);
  const isInternal = pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico');
  const isPageNavigation = request.headers.get('accept')?.includes('text/html');

  if (isStaticAsset || isInternal || !isPageNavigation) {
    return NextResponse.next();
  }

  const now = Date.now();
  const isLoginPage =
    pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/reset-password');

  const redirectToLogin = () => {
    const url = new URL('/login', request.url);
    url.searchParams.set('refer', pathname);
    url.searchParams.set('date', now.toString());
    const response = isLoginPage ? NextResponse.next() : NextResponse.redirect(url);
    logout(response);
    return response;
  };

  const redirectToRefer = () => {
    if (pathname.startsWith('/login/oauth2')) {
      return NextResponse.next();
    }
    const url = new URL(refer ?? '/', request.url);
    url.searchParams.set('date', now.toString());
    return NextResponse.redirect(url);
  };

  if (!refreshToken) {
    return redirectToLogin();
  }

  const isValid = accessToken ? await verifyToken(accessToken) : false;

  if (isValid === true) {
    if (isLoginPage) {
      return redirectToRefer();
    }
    return NextResponse.next();
  }

  if (isValid !== undefined) {
    try {
      const response = isLoginPage ? redirectToRefer() : NextResponse.next();
      const api = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiPaths.auth.refreshToken.slice(1)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `refreshToken=${refreshToken}`,
        },
      });

      const rawSetCookie = api.headers.get('set-cookie');

      if (rawSetCookie) {
        setRawCookie(rawSetCookie, response);
      }

      const result = await api.json();

      response.cookies.set('accessToken', result.data.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    } catch (error) {
      return redirectToLogin();
    }
  }

  return redirectToLogin();
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
