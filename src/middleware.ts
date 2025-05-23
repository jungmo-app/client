import { parse } from 'cookie';
import { NextRequest, NextResponse } from 'next/server';
import { apiPaths } from './constants/apis';
import { verifyToken } from './libs/auth/jwt';
import { baseAxios } from './libs/baseAxios';
import { logout } from './libs/serverAction';

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
    const url = new URL(refer ?? '/', request.url);
    url.searchParams.set('date', now.toString());
    return NextResponse.redirect(url);
  };

  if (!accessToken || !refreshToken) {
    return redirectToLogin();
  }

  const isValid = await verifyToken(accessToken);

  if (isValid === true) {
    if (isLoginPage) {
      return redirectToRefer();
    }
    return NextResponse.next();
  }

  if (isValid !== undefined) {
    try {
      const response = isLoginPage ? redirectToRefer() : NextResponse.next();
      const api = await baseAxios(apiPaths.auth.refreshToken, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `refreshToken=${refreshToken}`,
        },
      });

      const setCookieHeader = api.headers['set-cookie'];
      const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
      cookies.forEach(cookie => {
        if (!cookie) {
          return;
        }
        const parsed = parse(cookie);

        const name = Object.keys(parsed)[0];
        const value = parsed[name];

        if (!value) {
          return;
        }

        response.cookies.set(name, value, {
          httpOnly: cookie.includes('HttpOnly'),
          secure: cookie.includes('Secure'),
          sameSite: cookie.includes('SameSite=None') ? 'none' : cookie.includes('SameSite=Strict') ? 'strict' : 'lax',
          path: '/',
          maxAge: cookie.match(/Max-Age=(\d+)/)?.[1] ? Number(cookie.match(/Max-Age=(\d+)/)![1]) : undefined,
          domain: cookie.match(/Domain=([^;]+)/)?.[1],
        });
      });

      console.log(api.data.data);
      response.cookies.set('accessToken', api.data.data.accessToken, {
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
