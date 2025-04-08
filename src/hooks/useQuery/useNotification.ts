'use client';

import { useQuery } from '@tanstack/react-query';
import { apis } from '@/apis';

export const useNotification = () => {
  return useQuery({ queryKey: ['notification'], queryFn: apis.notification.getNotification });
};
