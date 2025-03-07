'use server';

import { revalidateTag } from 'next/cache';

export const revalidateTagData = (tag: string) => {
  revalidateTag(tag);
};
