import { QueryClient } from '@tanstack/react-query';
import { DetailGatheringType, GatheringListResponse } from '@/types/gathering';
import { isSameDay } from './date';

export const updateAppointList = (queryClient: QueryClient, date: Date) => {
  queryClient.invalidateQueries({
    queryKey: ['appointments', date.getFullYear(), date.getMonth() + 1, date.getDate()],
  });
};

export const deletePrevAppointList = (queryClient: QueryClient, appointmentId: number, date?: string) => {
  const prevDate = date ?? queryClient.getQueryData<DetailGatheringType>(['appointment', appointmentId])?.startDate;
  if (!prevDate) {
    return;
  }

  const updateDate = new Date(prevDate);

  queryClient.setQueryData<GatheringListResponse[]>(
    ['appointments', updateDate.getFullYear(), updateDate.getMonth() + 1, updateDate.getDate()],
    prev => (prev ? [...prev.filter(item => item.id !== appointmentId)] : undefined)
  );
};

export const addAppointment = (queryClient: QueryClient, addDate: Date, addData?: DetailGatheringType) => {
  updateAppointList(queryClient, addDate);
  if (addData) {
    queryClient.setQueryData<DetailGatheringType>(['appointment', addData.id], addData);
  }
};

export const updateAppointment = (
  queryClient: QueryClient,
  id: number,
  updateDate?: Date,
  updateData?: DetailGatheringType
) => {
  const prevData = queryClient.getQueryData<DetailGatheringType>(['appointment', id]);

  if (updateDate) {
    if (prevData && !isSameDay(new Date(prevData.startDate), updateDate)) {
      deletePrevAppointList(queryClient, id, prevData.startDate);
    }
    updateAppointList(queryClient, updateDate);
    queryClient.setQueryData<DetailGatheringType>(['appointment', id], updateData);
    return;
  }

  queryClient.invalidateQueries({
    queryKey: ['appointment', id],
  });
};

export const deleteAppointment = (queryClient: QueryClient, id: number, date?: string) => {
  deletePrevAppointList(queryClient, id, date);
  queryClient.removeQueries({ queryKey: ['appointment', id] });
};
