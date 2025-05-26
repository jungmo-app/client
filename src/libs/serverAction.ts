'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const getCookie = async (name: string) => {
  const cookie = cookies().get(name)?.value;
  return cookie;
};

export const getCookieList = async (names: string[]) => {
  const cookieStore = cookies();
  return names.reduce(
    (acc, name) => {
      acc[name] = cookieStore.get(name)?.value;
      return acc;
    },
    {} as Record<string, string | undefined>
  );
};

export const setCookie = async (name: string, value: string, option?: Partial<ResponseCookie>) => {
  cookies().set(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    ...option,
  });
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
