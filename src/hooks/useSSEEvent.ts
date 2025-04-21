'use client';

import { useCallback } from 'react';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Event } from 'event-source-polyfill';
import { apis } from '@/apis';
import { InviteSSEType } from '@/types/notification';
import { deleteAppointment, updateAppointList, updateAppointment } from '@/utils/updateAppointment';

export const useSSEEvent = () => {
  const queryClient = useQueryClient();

  const parseEvent = (e: Event) => {
    const event = e as MessageEvent;
    const data = JSON.parse(event.data) as InviteSSEType;
    return data;
  };

  const updateNotification = (queryClient: QueryClient) => {
    toast('새로운 알림이 도착했습니다', { duration: 2000 });
    queryClient.fetchQuery({
      queryKey: ['notification'],
      queryFn: apis.notification.getNotification,
    });
  };

  const inviteEvent = useCallback(
    (e: Event) => {
      updateNotification(queryClient);
      const data = parseEvent(e);
      const date = new Date(data.startDate);

      updateAppointList(queryClient, date);

      queryClient.invalidateQueries({
        queryKey: ['appointment', data.gatheringId],
      });
    },
    [queryClient]
  );

  const updateEvent = useCallback(
    (e: Event) => {
      updateNotification(queryClient);
      const data = parseEvent(e);

      updateAppointment(queryClient, data.gatheringId, new Date(data.startDate));
    },
    [queryClient]
  );

  const deleteEvent = useCallback(
    (e: Event) => {
      updateNotification(queryClient);
      const data = parseEvent(e);

      deleteAppointment(queryClient, data.gatheringId);
    },
    [queryClient]
  );

  return { inviteEvent, updateEvent, deleteEvent };
};
