'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apis } from '@/apis';
import { revalidateData, revalidatePage } from '@/libs/serverAction';
import { CreateGatheringRequest, GatheringListResponse } from '@/types/gathering';

interface CreateGatheringType extends Omit<CreateGatheringRequest, 'meetingLocation'> {
  meetingLocation: {
    placeId: string;
    placeName: string | undefined;
  };
}

export const useEditAppointment = (id: number, prevDate: Date, onSuccess?: () => void, onError?: () => void) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: CreateGatheringType) => {
      const requestData = { ...formData, meetingLocation: { placeId: formData.meetingLocation.placeId } };
      apis.gathering.edit(id, requestData);
    },
    onSuccess: (_, variable) => {
      queryClient.setQueryData<GatheringListResponse[]>(
        ['appointments', prevDate.getFullYear(), prevDate.getMonth() + 1, prevDate.getDate()],
        prev => {
          if (!prev) {
            return [];
          }
          return prev.map(item =>
            item.id === id
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
      );
      revalidateData(`gathering-${id}`);
      revalidatePage(`/appointment/${id}`);
      console.log(variable);
      queryClient.setQueryData(['appointment', id], variable);
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
