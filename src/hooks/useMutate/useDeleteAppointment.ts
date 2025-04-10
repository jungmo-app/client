'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apis } from '@/apis';
import { GatheringListResponse } from '@/types/gathering';

export const useDeleteAppointment = (id: number, date: Date, onSuccess?: () => void, onError?: () => void) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => apis.gathering.delete(id),
    onSuccess: () => {
      queryClient.setQueryData<GatheringListResponse[]>(
        ['appointments', date.getFullYear(), date.getMonth() + 1, date.getDate()],
        prev => {
          if (!prev) {
            return [];
          }
          return prev.filter(item => item.id !== id);
        }
      );

      if (onSuccess) {
        onSuccess();
      }
      router.push('/');
    },
    onError: error => {
      console.log(error);
      alert('삭제에 실패하였습니다');
      if (onError) {
        onError();
      }
    },
  });
};
