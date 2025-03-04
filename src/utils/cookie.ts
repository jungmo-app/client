import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export const resetCookie = (res: NextResponse, name: string) => {
  res.cookies.set(name, '', {
    maxAge: 0,
    path: '/',
    domain: '.jungmoserver.shop',
    httpOnly: true,
    secure: true,
  });
};

export const redirectLogin = () => {
  const accessToken = cookies().get('accessToken')?.value;
  if (!accessToken) {
    redirect('login');
  }
};

export const redirectMain = () => {
  const accessToken = cookies().get('accessToken')?.value;
  if (accessToken) {
    redirect('/');
  }
};
