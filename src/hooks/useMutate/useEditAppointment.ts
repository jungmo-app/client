'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apis } from '@/apis';
import { CreateGatheringRequest, DetailGatheringType } from '@/types/gathering';
import { updateAppointment } from '@/utils/updateAppointment';

interface CreateGatheringType extends Omit<CreateGatheringRequest, 'meetingLocation'> {
  meetingLocation: {
    placeId: string;
    placeName: string | undefined;
    placeAddress: string | undefined;
    point: google.maps.places.PlaceGeometry | undefined;
  };
}

export const useEditAppointment = (appointmentId: number, onSuccess?: () => void, onError?: () => void) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: CreateGatheringType) =>
      apis.gathering.edit(appointmentId, {
        ...formData,
        meetingLocation: { placeId: formData.meetingLocation.placeId },
      }),
    onSuccess: (_, variable) => {
      const { title, startDate, endDate, startTime, meetingLocation, memo, userIds } = variable;

      const prevData = queryClient.getQueryData<DetailGatheringType>(['appointment', appointmentId]);
      const updateData = prevData
        ? ({ ...prevData, title, startDate, endDate, startTime, meetingLocation, memo, userIds } as DetailGatheringType)
        : undefined;

      updateAppointment(queryClient, appointmentId, new Date(variable.startDate), updateData);

      onSuccess?.();
    },
    onError: () => {
      alert('수정에 실패하였습니다');
      onError?.();
      router.refresh();
    },
  });
};
