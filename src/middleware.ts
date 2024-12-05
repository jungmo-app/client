import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line unused-imports/no-unused-vars
export const middleware = async (request: NextRequest) => {
  // const { pathname } = request.nextUrl;
  // const isPublicRoute = BASE_URL === pathname || PUBLIC_ROUTES.includes(pathname);

  // const cookie = await getSession();
  // const session = await verifyToken(cookie);

  // // 퍼블릭 경로가 아닌데 세션이 없는 경우
  // if (!isPublicRoute && !session) {
  //   return NextResponse.redirect(new URL(BASE_URL, request.url));
  // }

  return NextResponse.next();
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
