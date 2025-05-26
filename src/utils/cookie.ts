import { parse } from 'cookie';
import { NextResponse } from 'next/server';

export const splitCookiesString = (cookiesHeader: string): string[] => {
  const cookies: string[] = [];
  let start = 0;
  let inExpires = false;

  for (let i = 0; i < cookiesHeader.length; i++) {
    const char = cookiesHeader[i];
    if (char === ',') {
      const slice = cookiesHeader.slice(start, i);
      if (/Expires=/i.test(slice)) {
        inExpires = true;
      } else if (inExpires) {
        inExpires = false;
      } else {
        cookies.push(cookiesHeader.slice(start, i).trim());
        start = i + 1;
      }
    }
  }

  cookies.push(cookiesHeader.slice(start).trim());
  return cookies;
};

export const setRawCookie = (rawCookie: string, response: NextResponse) => {
  const cookies = splitCookiesString(rawCookie);

  cookies.forEach(cookie => {
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
};

export const resetCookie = (res: NextResponse, name: string) => {
  res.cookies.set(name, '', {
    maxAge: 0,
    expires: new Date(),
    path: '/',
    domain: '.jungmoserver.shop',
    httpOnly: true,
    secure: true,
  });
};

export const logout = (res: NextResponse) => {
  resetCookie(res, 'accessToken');
  resetCookie(res, 'refreshToken');
};
