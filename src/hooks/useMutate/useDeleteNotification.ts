'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apis } from '@/apis';
import { NotificationType } from '@/types/notification';
import { ApiError } from '@/utils/error';

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, ApiError, number[]>({
    mutationFn: id => apis.notification.deleteNotification(id),
    onSuccess: (_, variable) => {
      queryClient.setQueryData<NotificationType[]>(['notification'], prev =>
        prev ? prev.filter(item => !variable.includes(item.notificationId)) : []
      );
    },
    onError: () => {
      alert('알림 삭제에 실패하였습니다');
    },
  });
};
