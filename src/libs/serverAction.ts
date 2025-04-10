'use server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export const getCookie = async (name: string) => {
  const cookie = cookies().get(name)?.value;
  return cookie;
};

export const redirectPath = (url: string) => {
  redirect(url);
};

export const revalidatePage = (url: string) => {
  revalidatePath(url);
};

export const revalidateData = (tag: string) => {
  revalidateTag(tag);
};

export const resetCookie = (res: NextResponse, name: string) => {
  res.cookies.set(name, '', {
    maxAge: 0,
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

export const redirectLogin = () => {
  const accessToken = cookies().get('accessToken')?.value;
  if (!accessToken) {
    redirect('/login');
  }
};

export const redirectMain = () => {
  const accessToken = cookies().get('accessToken')?.value;
  if (accessToken) {
    redirect('/');
  }
};
