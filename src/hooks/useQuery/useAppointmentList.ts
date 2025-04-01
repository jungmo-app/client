'use client';

import { useQuery } from '@tanstack/react-query';
import { apis } from '@/apis';
import { useDateStore } from '@/store/appointmentStore';
import { GatheringListResponse } from '@/types/gathering';

export const useAppointmentList = (initialData: GatheringListResponse[]) => {
  const date = useDateStore(state => state.date);

  return useQuery({
    queryKey: ['appointments', date.getFullYear(), date.getMonth() + 1, date.getDate()],
    initialData: initialData,
    queryFn: () => apis.gathering.getList(date),
    enabled: false,
  });
};
