'use client';

import { useCallback } from 'react';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Event } from 'event-source-polyfill';
import { apis } from '@/apis';
import { NotificationType, SSEDataType } from '@/types/notification';
import { deleteAppointment, updateAppointList, updateAppointment } from '@/utils/updateAppointment';

export const useSSEEvent = () => {
  const queryClient = useQueryClient();

  const parseEvent = (e: Event) => {
    const event = e as MessageEvent;
    const data = JSON.parse(event.data) as SSEDataType;
    return data;
  };

  const updateNotification = (queryClient: QueryClient, notification: NotificationType) => {
    toast('새로운 알림이 도착했습니다', { duration: 2000 });
    queryClient.setQueryData<NotificationType[]>(['notification'], prev =>
      prev ? [notification, ...prev] : [notification]
    );
    queryClient.fetchQuery({
      queryKey: ['notification'],
      queryFn: apis.notification.getNotification,
    });
  };

  const inviteEvent = useCallback(
    (e: Event) => {
      const { startDate, ...notification } = parseEvent(e);
      const date = new Date(startDate);

      updateNotification(queryClient, notification);
      updateAppointList(queryClient, date);

      queryClient.invalidateQueries({
        queryKey: ['appointment', notification.gatheringId],
      });
    },
    [queryClient]
  );

  const updateEvent = useCallback(
    (e: Event) => {
      const { startDate, ...notification } = parseEvent(e);

      updateNotification(queryClient, notification);
      updateAppointment(queryClient, notification.gatheringId, new Date(startDate));
    },
    [queryClient]
  );

  const deleteEvent = useCallback(
    (e: Event) => {
      const { startDate: startDate, ...notification } = parseEvent(e);

      updateNotification(queryClient, notification);
      deleteAppointment(queryClient, notification.gatheringId, startDate);
    },
    [queryClient]
  );

  return { inviteEvent, updateEvent, deleteEvent };
};
