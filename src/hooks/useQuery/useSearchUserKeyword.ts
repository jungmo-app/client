'use client';

import { useQuery } from '@tanstack/react-query';
import { apis } from '@/apis';

export const useSearchUserKeyword = (keyword: string) => {
  return useQuery({
    queryKey: ['searchUser', keyword],
    queryFn: () => apis.user.search(keyword),
    enabled: !!keyword,
    staleTime: 1000 * 60,
  });
};
