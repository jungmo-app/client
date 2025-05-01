'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apis } from '@/apis';
import { NotificationType } from '@/types/notification';
import { ApiError } from '@/utils/error';

interface MutateCotextType {
  previous: NotificationType[];
}

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, ApiError, number[], MutateCotextType>({
    mutationFn: id => apis.notification.deleteNotification(id),
    onMutate: id => {
      const previous = queryClient.getQueryData<NotificationType[]>(['notification']);
      queryClient.setQueryData<NotificationType[]>(['notification'], prev =>
        prev ? prev.filter(item => !id.includes(item.notificationId)) : []
      );
      return { previous: previous ?? [] };
    },
    onError: (_err, _variables, context) => {
      alert('알림 삭제에 실패하였습니다');
      if (context?.previous) {
        queryClient.setQueryData(['notification'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notification'] });
    },
  });
};
