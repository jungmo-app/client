'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apis } from '@/apis';
import { NotificationType } from '@/types/notification';
import { ApiError } from '@/utils/error';

interface useDeleteNotificationProps {
  onSuccess?: () => void;
  onError?: () => void;
}

export const useReadNotification = ({ onSuccess, onError }: useDeleteNotificationProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, number[] | number>({
    mutationFn: id => apis.notification.readNotification(typeof id === 'number' ? [id] : id),
    onSuccess: (_, variables) => {
      queryClient.setQueryData<NotificationType[]>(['notification'], prev =>
        prev
          ? prev.map(item =>
              (typeof variables === 'number' ? [variables] : [...variables]).includes(item.notificationId)
                ? { ...item, read: true }
                : item
            )
          : []
      );
      onSuccess?.();
    },
    onError: () => {
      onError?.();
    },
  });
};
