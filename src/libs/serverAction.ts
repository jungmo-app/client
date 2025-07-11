'use server';

import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';

export const getCookie = async (name: string) => {
  const cookie = cookies().get(name)?.value;
  return cookie;
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
