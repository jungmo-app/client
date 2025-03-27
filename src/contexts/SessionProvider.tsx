'use client';

import { ReactNode, createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { apis } from '@/apis';
import { apiPaths } from '@/constants/apis';
import { getCookie } from '@/libs/serverAction';
import { InviteSSEType, NotificationType } from '@/types/notification';

interface SessionContextType {
  isLogin: boolean;
  notification: NotificationType[];
  connectSession: () => Promise<void>;
  closeSession: () => void;
  changeNotification: React.Dispatch<React.SetStateAction<NotificationType[]>>;
}

interface SessionContextProviderProps {
  children: ReactNode;
  accessToken?: string;
  initialNotification: NotificationType[];
}

export const SessionContext = createContext<SessionContextType>({
  isLogin: false,
  notification: [],
  connectSession: async () => {},
  closeSession: () => {},
  changeNotification: () => {},
});

export function SessionContextProvider({ children, accessToken, initialNotification }: SessionContextProviderProps) {
  const eventSource = useRef<EventSource | null>(null);
  const [notification, setNotification] = useState<NotificationType[]>(initialNotification);
  const [isLogin, setIsLogin] = useState(Boolean(accessToken));

  const changeNotification = useCallback((value: React.SetStateAction<NotificationType[]>) => {
    setNotification(value);
  }, []);

  const closeSSE = useCallback(() => {
    eventSource.current?.close();
    eventSource.current = null;
  }, []);

  const connectSSE = useCallback(
    async (accessToken: string, retry = 2) => {
      if (retry === 0) {
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
          const refreshToken = await getCookie('refreshToken');
          const response = await apis.auth.refreshToken(accessToken, refreshToken ?? '');
          const token = await getCookie('accessToken');
          if (response && token) {
            await connectSSE(token, retry - 1);
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
    setNotification([]);
    setIsLogin(false);
  }, [closeSSE]);

  const connectSession = useCallback(async () => {
    const token = await getCookie('accessToken');
    if (!token) {
      return;
    }
    closeSession();
    const notification = await apis.notification.getNotification();
    setNotification(notification?.data ?? []);
    await connectSSE(token);
    setIsLogin(true);
  }, [closeSession, connectSSE]);

  useEffect(() => {
    if (accessToken) {
      connectSession();
    }
  }, [connectSession, accessToken]);

  const value = useMemo(
    () => ({
      isLogin,
      notification,
      connectSession,
      closeSession,
      changeNotification,
    }),
    [isLogin, notification, connectSession, closeSession, changeNotification]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
