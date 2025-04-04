'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apis } from '@/apis';
import { useDateStore } from '@/store/appointmentStore';

export const useAppointmentList = () => {
  const date = useDateStore(state => state.date);
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['appointments', date.getFullYear(), date.getMonth() + 1, date.getDate()],
    queryFn: () => apis.gathering.getList(date, queryClient),
  });
};
