'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apis } from '@/apis';
import { deleteAppointment } from '@/utils/updateAppointment';

export const useDeleteAppointment = (id: number, date: Date, onSuccess?: () => void, onError?: () => void) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => apis.gathering.delete(id),
    onSuccess: () => {
      deleteAppointment(queryClient, id);

      if (onSuccess) {
        onSuccess();
      }
      router.push('/');
    },
    onError: error => {
      console.error(error);
      alert('삭제에 실패하였습니다');
      if (onError) {
        onError();
      }
    },
  });
};
