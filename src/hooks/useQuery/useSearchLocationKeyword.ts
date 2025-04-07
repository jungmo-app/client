'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { apis } from '@/apis';

export const useSearchLocationKeyword = (keyword: string) => {
  return useQuery({
    queryKey: ['search', keyword],
    queryFn: () => apis.place.getSearchKeyword(keyword),
    placeholderData: keepPreviousData,
    enabled: !!keyword,
  });
};
