import { QueryClient } from '@tanstack/react-query';
import { DetailGatheringRespose, GatheringListResponse } from '@/types/gathering';
import { isSameDay } from './date';

export const updateAppointList = (queryClient: QueryClient, date: Date) => {
  queryClient.invalidateQueries({
    queryKey: ['appointments', date.getFullYear(), date.getMonth() + 1, date.getDate()],
  });
};

export const deletePrevAppointList = (
  queryClient: QueryClient,
  appointmentId: number,
  data?: DetailGatheringRespose
) => {
  const prevData = data ?? queryClient.getQueryData<DetailGatheringRespose>(['appointment', appointmentId]);
  if (!prevData) {
    return;
  }

  const prevDate = new Date(prevData.startDate);

  queryClient.setQueryData<GatheringListResponse[]>(
    ['appointments', prevDate.getFullYear(), prevDate.getMonth() + 1, prevDate.getDate()],
    prev => (prev ? [...prev.filter(item => item.id !== appointmentId)] : undefined)
  );
};

export const addAppointment = (addDate: Date, queryClient: QueryClient, addData?: DetailGatheringRespose) => {
  updateAppointList(queryClient, addDate);
  if (addData) {
    queryClient.setQueryData<DetailGatheringRespose>(['appointment', addData.id], addData);
  }
};

export const updateAppointment = (
  queryClient: QueryClient,
  id: number,
  updateDate: Date,
  updateData?: DetailGatheringRespose
) => {
  const prevData = queryClient.getQueryData<DetailGatheringRespose>(['appointment', id]);
  if (prevData && !isSameDay(new Date(prevData.startDate), updateDate)) {
    deletePrevAppointList(queryClient, id, prevData);
  }

  updateAppointList(queryClient, updateDate);

  if (updateData) {
    queryClient.setQueryData<DetailGatheringRespose>(['appointment', id], updateData);
    return;
  }

  queryClient.invalidateQueries({
    queryKey: ['appointment', id],
  });
};

export const deleteAppointment = (queryClient: QueryClient, id: number) => {
  deletePrevAppointList(queryClient, id);
  queryClient.removeQueries({ queryKey: ['appointment', id] });
};
