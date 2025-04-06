'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apis } from '@/apis';
import { CreateGatheringRequest, DetailGatheringType, GatheringListResponse } from '@/types/gathering';
import { isSameDay } from '@/utils/date';

interface CreateGatheringType extends Omit<CreateGatheringRequest, 'meetingLocation'> {
  meetingLocation: {
    placeId: string;
    placeName: string | undefined;
    placeAddress: string | undefined;
    point: google.maps.places.PlaceGeometry | undefined;
  };
}

export const useEditAppointment = (
  appointmentId: number,
  prevDate: Date,
  onSuccess?: () => void,
  onError?: () => void
) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: CreateGatheringType) =>
      apis.gathering.edit(appointmentId, {
        ...formData,
        meetingLocation: { placeId: formData.meetingLocation.placeId },
      }),
    onSuccess: (_, variable) => {
      const newDate = new Date(variable.startDate);
      const isSameDate = isSameDay(prevDate, new Date(variable.startDate));

      const prevData = queryClient
        .getQueryData<
          GatheringListResponse[]
        >(['appointments', prevDate.getFullYear(), prevDate.getMonth() + 1, prevDate.getDate()])
        ?.find(item => item.id === appointmentId);

      queryClient.setQueryData<DetailGatheringType>(['appointment', appointmentId], prev => {
        if (!prev) return undefined;
        const { title, startDate, endDate, startTime, meetingLocation, memo, userIds } = variable;
        return { ...prev, title, startDate, endDate, startTime, meetingLocation, memo, userIds };
      });

      if (prevData) {
        if (isSameDate) {
          queryClient.setQueryData<GatheringListResponse[]>(
            ['appointments', prevDate.getFullYear(), prevDate.getMonth() + 1, prevDate.getDate()],
            prev =>
              prev?.map(item =>
                item.id === appointmentId
                  ? {
                      ...item,
                      title: variable.title,
                      startDate: variable.startDate,
                      endDate: variable.startDate,
                      startTime: variable.startTime,
                      meetingLocation: variable.meetingLocation.placeName ?? '',
                    }
                  : item
              )
          );
        } else {
          // 이전 리스트에서 제거
          queryClient.setQueryData<GatheringListResponse[]>(
            ['appointments', prevDate.getFullYear(), prevDate.getMonth() + 1, prevDate.getDate()],
            prev => prev?.filter(item => item.id !== appointmentId)
          );

          // 새 리스트에 추가
          queryClient.setQueryData<GatheringListResponse[]>(
            ['appointments', newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate()],
            prev => [
              ...(prev ?? []),
              {
                ...prevData,
                title: variable.title,
                startDate: variable.startDate,
                endDate: variable.startDate,
                startTime: variable.startTime,
                meetingLocation: variable.meetingLocation.placeName ?? '',
              },
            ]
          );
        }
      }

      queryClient.invalidateQueries({ queryKey: ['appointment', appointmentId] });
      queryClient.invalidateQueries({
        queryKey: ['appointments', prevDate.getFullYear(), prevDate.getMonth() + 1, prevDate.getDate()],
      });

      if (!isSameDate) {
        queryClient.invalidateQueries({
          queryKey: ['appointments', newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate()],
        });
      }

      onSuccess?.();
    },
    onError: () => {
      alert('수정에 실패하였습니다');
      onError?.();
      router.refresh();
    },
  });
};
