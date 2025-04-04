/* 'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apis } from '@/apis';
import { ApiError } from '@/types/apis';

export const useAddLocation = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation<unknown, ApiError, google.maps.places.PlaceResult>({
    mutationFn: value => apis.gathering.addLocation(id, value.place_id ?? ''),
    onSuccess: () => {
      queryClient.setQueryData(['appointment', id], prev => );
    },
  });
};
 */
