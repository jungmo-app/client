'use client';

import { PropsWithChildren, createContext, useCallback, useEffect, useMemo, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { apis } from '@/apis';
import { apiPaths } from '@/constants/apis';
import { getCookie } from '@/libs/serverAction';
import { InviteSSEType } from '@/types/notification';

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
          heartbeatTimeout: 60 * 30 * 1000,
        }
      );

      newSSE.addEventListener('error', async error => {
        closeSSE();
        const err = error as Event & { status: number };
        if (err.status === 401) {
          console.log('sse error');
          const response = await apis.auth.refreshToken();
          if (response) {
            await connectSSE(retry - 1);
          }
        }
      });

      newSSE.addEventListener('sse', e => {
        const event = e as MessageEvent;
        console.log('event');
        const data: InviteSSEType = JSON.parse(event.data);
        /* revalidateData */
        console.log(data);
        queryClient.fetchQuery({
          queryKey: ['notification'],
          queryFn: apis.notification.getNotification,
        });

        const date = new Date(data.startDate);
        queryClient.invalidateQueries({
          queryKey: ['appointments', date.getMonth(), date.getMonth() + 1, date.getDate()],
        });
        queryClient.invalidateQueries({
          queryKey: ['appointment', data.gatheringId],
        });
        toast('새로운 알림이 도착했습니다', { duration: 2000 });
      });
      eventSource.current = newSSE;
    },
    [closeSSE, queryClient]
  );

  const closeSession = useCallback(() => {
    closeSSE();
    queryClient.removeQueries({ queryKey: ['notification'] });
  }, [closeSSE, queryClient]);

  const openSession = useCallback(async () => {
    console.log('session open');

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
