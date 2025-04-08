'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { apis } from '@/apis';

export const useSearchUserKeyword = (keyword: string) => {
  return useQuery({
    queryKey: ['searchUser', keyword],
    queryFn: () => apis.user.search(keyword),
    placeholderData: keepPreviousData,
    enabled: !!keyword,
    staleTime: 1000 * 60,
  });
};
