'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apis } from '@/apis';
import { DetailGatheringType } from '@/types/gathering';

export const useAppointment = (id: number) => {
  const queryClient = useQueryClient();

  return useQuery<DetailGatheringType | null | undefined>({
    queryKey: ['appointment', id],
    queryFn: () => apis.gathering.getDetail(id, queryClient),
    enabled: false,
  });
};
