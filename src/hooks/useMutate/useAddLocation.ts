'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apis } from '@/apis';
import { DetailGatheringType } from '@/types/gathering';
import { ApiError } from '@/utils/error';

export const useAddLocation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<number, ApiError, google.maps.places.PlaceResult>({
    mutationFn: value => apis.gathering.addLocation(id, value.place_id ?? ''),
    onSuccess: (placeId, variable) => {
      queryClient.setQueryData<DetailGatheringType>(['appointment', id], prev =>
        prev ? { ...prev, locations: [...prev.locations, { ...variable, id: placeId }] } : undefined
      );
    },
    onError: () => {
      alert('장소를 추가할 수 없습니다');
    },
  });
};
