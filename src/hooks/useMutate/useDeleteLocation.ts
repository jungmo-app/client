'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apis } from '@/apis';
import { DetailGatheringType } from '@/types/gathering';
import { ApiError } from '@/utils/error';
import { updateAppointment } from '@/utils/updateAppointment';

export const useDeleteLocation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, number>({
    mutationFn: placeId => apis.gathering.deleteLocation(id, placeId),
    onSuccess: (_, variable) => {
      const prevData = queryClient.getQueryData<DetailGatheringType>(['appointment', id]);
      const updateData = prevData
        ? ({
            ...prevData,
            locations: prevData.locations.filter(location => location.id !== variable),
          } as DetailGatheringType)
        : undefined;

      updateAppointment(queryClient, id, undefined, updateData);
    },
    onError: () => {
      alert('장소를 삭제할 수 없습니다');
    },
  });
};
