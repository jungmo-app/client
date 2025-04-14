'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apis } from '@/apis';
import { GOOGLE_MAP_FIELD } from '@/constants/place';

export const useLocation = (id: string, LocationQuery?: (typeof GOOGLE_MAP_FIELD)[number][]) => {
  const queryClient = useQueryClient();
  const query = Array.from(new Set([...(LocationQuery ?? [])])) as (typeof GOOGLE_MAP_FIELD)[number][];
  return useQuery<google.maps.places.PlaceResult | null>({
    queryKey: ['location', id, ...query],
    queryFn: () => apis.place.getDetail(String(id), query, queryClient),
    enabled: id.length > 0,
  });
};
