'use client';

import { useQuery } from '@tanstack/react-query';
import { apis } from '@/apis';
import { GOOGLE_MAP_FIELD } from '@/constants/place';

export const useLocation = (id: string) => {
  const query = [
    'name',
    'formatted_address',
    'icon_background_color',
    'geometry',
    'photo',
    'type',
    'place_id',
  ] as (typeof GOOGLE_MAP_FIELD)[number][];
  return useQuery({
    queryKey: ['location', id, ...query],
    queryFn: () => apis.serverPlace.getDetail(String(id), query),
  });
};
