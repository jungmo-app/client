'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apis } from '@/apis';
import { CreateGatheringRequest, DetailGatheringType } from '@/types/gathering';
import { ApiError } from '@/utils/error';
import { updateAppointment } from '@/utils/updateAppointment';

interface CreateGatheringType extends Omit<CreateGatheringRequest, 'meetingLocation'> {
  meetingLocation: {
    placeId: string;
    placeName: string | undefined;
    placeAddress: string | undefined;
    point: google.maps.places.PlaceGeometry | undefined;
  };
}

interface EditAppointmentType {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
}

export const useEditAppointment = (appointmentId: number, option: EditAppointmentType = {}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, CreateGatheringType>({
    mutationFn: async formData =>
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

      option.onSuccess?.();
    },
    onError: error => {
      if (error.code === 'G001') {
        alert('해당 일정이 존재하지 않습니다');
        router.push('/');
        return;
      }

      if (error.code === 'G002') {
        alert('모임을 수정할 권한이 없습니다');
        router.refresh();
        return;
      }

      if (error.code === 'G003') {
        alert('이미 삭제된 모임입니다.');
        router.push('/');
        return;
      }
      option.onError?.(error);
    },
  });
};
