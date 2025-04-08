import { NextResponse } from 'next/server';
import { logout } from '@/utils/cookie';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const refer = searchParams.get('refer');

  const nextURL = `/login${refer && `?refer=${refer}&date=${Date.now()}`}`;
  const res = NextResponse.redirect(new URL(nextURL, request.url));
  logout(res);
  return res;
}
