import { NextURL } from 'next/dist/server/web/next-url';
import { NextRequest, NextResponse } from 'next/server';
import { apis } from './apis';
import { verifyToken } from './libs/auth/jwt';
import { logout } from './utils/cookie';
import { parseSetCookie } from './utils/formatText';

const setResponseCookies = (response: NextResponse, setCookieHeader: string[] | string | undefined) => {
  if (!setCookieHeader) return;

  const cookieArray = Array.isArray(setCookieHeader) ? [...setCookieHeader] : [setCookieHeader];
  cookieArray.forEach(cookie => {
    const { name, value, options } = parseSetCookie(cookie);
    response.cookies.set(name, value, options);
  });
};

const redirectTo = (refer: string | null, baseUrl: NextURL) => {
  const safePath = refer ?? '/';
  const finalUrl = `${baseUrl.origin}${safePath}`;
  return NextResponse.redirect(finalUrl);
};

export const middleware = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isLoginPage = pathname.startsWith('/login');

  const isStaticAsset = /\.(js|css|png|jpg|jpeg|svg|webp|ico|woff2?)$/.test(pathname);
  const isInternal = pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico');

  if (isStaticAsset || isInternal) {
    return NextResponse.next();
  }

  if (isLoginPage) {
    const next = NextResponse.next();

    if (accessToken && refreshToken) {
      const isValid = await verifyToken(accessToken);

      if (isValid === false) {
        const api = await apis.auth.refreshToken();
        if (api) {
          const response = redirectTo(searchParams.get('refer'), request.nextUrl);
          setResponseCookies(response, api.headers['set-cookie']);
          return response;
        }
      }

      if (isValid === true) {
        return redirectTo(searchParams.get('refer'), request.nextUrl);
      }

      logout(next);
    }

    return next;
  }

  if (!accessToken || !refreshToken) {
    const redirectUrl = new URL(`/login?refer=${pathname}`, request.url);
    const response = NextResponse.redirect(redirectUrl);
    logout(response);
    return response;
  }

  const isValid = await verifyToken(accessToken);

  if (isValid === true) {
    const response = NextResponse.next();
    return response;
  }

  if (isValid === undefined) {
    const redirectUrl = new URL(`/login?refer=${pathname}`, request.url);
    const response = NextResponse.redirect(redirectUrl);
    logout(response);
    return response;
  }

  const api = await apis.auth.refreshToken();
  if (!api) {
    const redirectUrl = new URL(`/login?refer=${pathname}`, request.url);
    const response = NextResponse.redirect(redirectUrl);
    logout(response);
    return response;
  }

  const response = NextResponse.next();
  setResponseCookies(response, api.headers['set-cookie']);
  return response;
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
