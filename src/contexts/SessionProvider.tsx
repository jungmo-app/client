'use client';

import { PropsWithChildren, createContext, useCallback, useEffect, useMemo, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
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
      if (retry === 0) {
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
      });
      eventSource.current = newSSE;
    },
    [closeSSE]
  );

  const closeSession = useCallback(() => {
    closeSSE();
    queryClient.removeQueries({ queryKey: ['notification'] });
    queryClient.removeQueries({ queryKey: ['userData'] });
  }, [closeSSE, queryClient]);

  const openSession = useCallback(async () => {
    console.log('session open');
    try {
      await connectSSE();
    } catch {
      console.log('sse error');
    }

    try {
      /* await connectSSE(); */
      await Promise.all([
        queryClient.fetchQuery({ queryKey: ['userData'], queryFn: apis.user.getInfo }),
        queryClient.fetchQuery({ queryKey: ['notification'], queryFn: apis.notification.getNotification }),
      ]);
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

  const value = useMemo(
    () => ({
      openSession,
      closeSession,
    }),
    [openSession, closeSession]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};
