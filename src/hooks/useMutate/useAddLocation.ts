'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apis } from '@/apis';
import { DetailGatheringType } from '@/types/gathering';
import { ApiError } from '@/utils/error';
import { updateAppointment } from '@/utils/updateAppointment';

interface AddLocationOptionType {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
}

export const useAddLocation = (id: number, option: AddLocationOptionType = {}) => {
  const queryClient = useQueryClient();

  return useMutation<number, ApiError, google.maps.places.PlaceResult>({
    mutationFn: value => apis.gathering.addLocation(id, value.place_id ?? ''),
    onSuccess: (placeId, variable) => {
      const prevData = queryClient.getQueryData<DetailGatheringType>(['appointment', id]);
      const updateData = prevData
        ? ({ ...prevData, location: [...prevData.locations, { ...variable, id: placeId }] } as DetailGatheringType)
        : undefined;
      updateAppointment(queryClient, id, undefined, updateData);
      option.onSuccess?.();
    },
    onError: error => {
      option.onError?.(error);
    },
  });
};
