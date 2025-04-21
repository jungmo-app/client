'use client';

import { useQuery } from '@tanstack/react-query';
import { apis } from '@/apis';
import { NotificationType } from '@/types/notification';

export const useNotification = () => {
  return useQuery<NotificationType[]>({ queryKey: ['notification'], queryFn: apis.notification.getNotification });
};
