'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { apis } from '@/apis';

export const useSearchLocationKeyword = (keyword: string, latestKeyword?: string) => {
  return useQuery({
    queryKey: ['searchLocation', keyword],
    queryFn: () => apis.place.getSearchKeyword(keyword),
    placeholderData: keepPreviousData,
    select: data => (latestKeyword && latestKeyword !== keyword ? [] : data),
    enabled: !!keyword,
  });
};
