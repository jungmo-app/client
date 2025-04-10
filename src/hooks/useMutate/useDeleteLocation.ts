'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apis } from '@/apis';
import { DetailGatheringType } from '@/types/gathering';
import { ApiError } from '@/utils/error';

export const useDeleteLocation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, number>({
    mutationFn: placeId => apis.gathering.deleteLocation(id, placeId),
    onSuccess: (_, variable) => {
      queryClient.setQueryData<DetailGatheringType>(['appointment', id], prev =>
        prev ? { ...prev, locations: prev.locations.filter(location => location.id !== variable) } : undefined
      );
    },
    onError: () => {
      alert('장소를 삭제할 수 없습니다');
    },
  });
};
