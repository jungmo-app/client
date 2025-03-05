'use server';

import { revalidatePath } from 'next/cache';

export const revalidatePage = (url: string) => {
  revalidatePath(url);
};
