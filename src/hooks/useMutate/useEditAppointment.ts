'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apis } from '@/apis';
import { CreateGatheringRequest, DetailGatheringType, GatheringListResponse } from '@/types/gathering';

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
    onSuccess: (i, variable) => {
      /* 날짜 변경시킨 경우에는? */
      const prevData = queryClient
        .getQueryData<
          GatheringListResponse[]
        >(['appointments', prevDate.getFullYear(), prevDate.getMonth() + 1, prevDate.getDate()])
        ?.find(item => item.id === appointmentId);
      const prevStartDate = prevData?.startDate;

      if (!prevData) {
        return;
      }

      queryClient.setQueryData<GatheringListResponse[]>(
        ['appointments', prevDate.getFullYear(), prevDate.getMonth() + 1, prevDate.getDate()],
        prev => {
          if (!prev) {
            return [];
          }
          if (variable.startDate === prevStartDate) {
            return prev.map((item: GatheringListResponse) =>
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
            );
          }
          return prev.filter((item: GatheringListResponse) => item.id !== appointmentId);
        }
      );

      if (variable.startDate !== prevStartDate) {
        const newDate = new Date(variable.startDate);
        queryClient.setQueryData<GatheringListResponse[]>(
          ['appointments', newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate()],
          prev =>
            prev
              ? [
                  ...prev,
                  {
                    ...prevData,
                    title: variable.title,
                    startDate: variable.startDate,
                    endDate: variable.startDate,
                    startTime: variable.startTime,
                    meetingLocation: variable.meetingLocation.placeName ?? '',
                  },
                ]
              : undefined
        );
      }

      queryClient.setQueryData<DetailGatheringType>(['appointment', appointmentId], prev => {
        if (!prev) {
          return undefined;
        }
        const { title, startDate, endDate, startTime, meetingLocation, memo, userIds } = variable;
        return { ...prev, title, startDate, endDate, startTime, meetingLocation, memo, userIds };
      });
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: () => {
      alert('수정에 실패하였습니다');
      if (onError) {
        onError();
      }
      router.refresh();
    },
  });
};
