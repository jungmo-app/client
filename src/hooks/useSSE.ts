'use client';

import { useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { apis } from '@/apis';
import { apiPaths } from '@/constants/apis';
import createSSEEventHandlers from '@/handlers/createSSEEventHandlers';
import { getCookie } from '@/libs/serverAction';

export const useSSE = () => {
  const queryClient = useQueryClient();
  const eventSource = useRef<EventSource | null>(null);
  const handlersRef = useRef(createSSEEventHandlers(queryClient));
  const { inviteEvent, deleteEvent, updateEvent } = handlersRef.current;

  const closeSSE = useCallback(() => {
    eventSource.current?.close();
    eventSource.current = null;
  }, []);

  const connectSSE = useCallback(
    async (retry = 2) => {
      if (eventSource.current || retry === 0) {
        return;
      }

      const accessToken = await getCookie('accessToken');

      if (!accessToken) {
        return;
      }

      const newSSE = new EventSourcePolyfill(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${apiPaths.notification.subscribe.slice(1)}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'text/event-stream',
          },
          heartbeatTimeout: 60 * 60 * 1000,
        }
      );

      newSSE.addEventListener('error', async error => {
        closeSSE();
        const err = error as Event & { status: number };
        if (err.status === 401) {
          const response = await apis.auth.refreshToken();
          if (response) {
            await connectSSE(retry - 1);
          }
          return;
        }

        setTimeout(() => {
          connectSSE();
        }, 3000);
      });

      newSSE.addEventListener('invite', inviteEvent);
      newSSE.addEventListener('update', updateEvent);
      newSSE.addEventListener('delete', deleteEvent);
      newSSE.addEventListener('remove', deleteEvent);

      eventSource.current = newSSE;
    },
    [closeSSE, inviteEvent, updateEvent, deleteEvent]
  );

  return { closeSSE, connectSSE };
};
