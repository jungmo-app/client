'use client';

import { PropsWithChildren, createContext, useCallback, useEffect, useMemo, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { apis } from '@/apis';
import { apiPaths } from '@/constants/apis';
import { useSSEEvent } from '@/hooks/useSSEEvent';
import { getCookie } from '@/libs/serverAction';

interface SessionContextType {
  openSession: () => Promise<void>;
  closeSession: () => void;
}

export const SessionContext = createContext<SessionContextType>({
  openSession: async () => {},
  closeSession: () => {},
});

export const SessionContextProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const eventSource = useRef<EventSource | null>(null);

  const { inviteEvent, updateEvent, deleteEvent } = useSSEEvent();

  const closeSSE = useCallback(() => {
    eventSource.current?.close();
    eventSource.current?.removeEventListener('invite', inviteEvent);
    eventSource.current?.removeEventListener('delete', deleteEvent);
    eventSource.current?.removeEventListener('update', updateEvent);
    eventSource.current?.removeEventListener('remove', deleteEvent);
    eventSource.current = null;
  }, [inviteEvent, deleteEvent, updateEvent]);

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

  const closeSession = useCallback(() => {
    closeSSE();
    queryClient.removeQueries({ queryKey: ['notification'] });
  }, [closeSSE, queryClient]);

  const openSession = useCallback(async () => {
    try {
      await queryClient.fetchQuery({ queryKey: ['notification'], queryFn: apis.notification.getNotification });
      await connectSSE();
    } catch (error) {
      console.log(error);
      closeSSE();
      throw new Error('로그인 오류');
    }
  }, [connectSSE, closeSSE, queryClient]);

  useEffect(() => {
    const getInitialConnetSession = async () => {
      const accessToken = await getCookie('accessToken');
      if (accessToken) {
        await connectSSE();
      }
    };
    getInitialConnetSession();
  }, [connectSSE]);

  useEffect(() => {
    window.addEventListener('beforeunload', closeSSE);
    return () => {
      closeSSE();
      window.removeEventListener('beforeunload', closeSSE);
    };
  }, [closeSSE]);

  const value = useMemo(
    () => ({
      openSession,
      closeSession,
    }),
    [openSession, closeSession]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};
