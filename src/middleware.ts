import { NextRequest, NextResponse } from 'next/server';
import { apis } from './apis';
import { verifyToken } from './libs/auth/jwt';
import { logout } from './libs/serverAction';

export const middleware = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isStaticAsset = /\.(js|css|png|jpg|jpeg|svg|webp|ico|woff2?)$/.test(pathname);
  const isInternal = pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico');

  console.log(pathname);

  if (isStaticAsset || isInternal) {
    return NextResponse.next();
  }

  const isLoginPage =
    pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('reset-password');
  const refer = searchParams.get('refer');
  const now = Date.now();

  const redirectToLogin = () => {
    const url = new URL('/login', request.url);
    url.searchParams.set('refer', refer ?? '/');
    url.searchParams.set('date', now.toString());
    const response = NextResponse.redirect(url);
    logout(response);
    return response;
  };

  const redirectToRefer = () => {
    const url = new URL(refer ?? '/', request.url);
    url.searchParams.set('date', now.toString());
    return NextResponse.redirect(url);
  };

  if (!accessToken || !refreshToken) {
    const response = isLoginPage ? NextResponse.next() : redirectToLogin();
    logout(response);
    return response;
  }

  const isValid = await verifyToken(accessToken);

  if (isValid) {
    return isLoginPage ? redirectToRefer() : NextResponse.next();
  }

  if (isValid === false) {
    try {
      console.log('token refresh');
      const response = redirectToRefer();
      const api = await apis.auth.refreshToken();
      const setCookieHeader = api.headers['set-cookie'];
      const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
      cookies.forEach(cookie => {
        if (!cookie) {
          return;
        }
        response.headers.append('set-cookie', cookie);
      });
      return response;
    } catch {
      const response = isLoginPage ? NextResponse.next() : redirectToLogin();
      logout(response);
      return response;
    }
  }

  console.log('token invalid');

  const response = isLoginPage ? NextResponse.next() : redirectToLogin();
  logout(response);
  return response;
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
