'use server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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
