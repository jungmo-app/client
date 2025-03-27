'use client';

import { ReactNode, createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { apis } from '@/apis';
import { apiPaths } from '@/constants/apis';
import { getCookie } from '@/libs/serverAction';
import { InviteSSEType, NotificationType } from '@/types/notification';

interface NotificationContextType {
  eventSource: null | EventSource;
  notification: NotificationType[];
  changeNotification: React.Dispatch<React.SetStateAction<NotificationType[]>>;
  connectSSE: () => void;
  closeSSE: () => void;
}

interface NotificationContextProviderProps {
  children: ReactNode;
  initialNotification: NotificationType[];
}

export const NotificationContext = createContext<NotificationContextType>({
  eventSource: null,
  notification: [],
  changeNotification: () => {},
  connectSSE: () => {},
  closeSSE: () => {},
});

export function NotificationContextProvider({ children, initialNotification }: NotificationContextProviderProps) {
  const [eventSource, setEventSource] = useState<null | EventSource>(null);
  const [notification, setNotification] = useState<NotificationType[]>(initialNotification);

  const changeNotification = useCallback((value: React.SetStateAction<NotificationType[]>) => {
    setNotification(value);
  }, []);

  const closeSSE = useCallback(() => {
    setEventSource(prev => {
      prev?.close();
      return null;
    });
  }, []);

  const connectSSE = useCallback(async () => {
    const accessToken = await getCookie('accessToken');
    if (!accessToken) {
      return;
    }

    closeSSE();

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
        if (response) {
          await connectSSE();
        }
      }
    });

    newSSE.addEventListener('sse', e => {
      const event = e as MessageEvent;
      console.log('event');
      const data: InviteSSEType = JSON.parse(event.data);
      console.log(data);
    });
    setEventSource(newSSE);
  }, [closeSSE]);

  useEffect(() => {
    connectSSE();
    window.addEventListener('beforeunload', closeSSE);
    return () => {
      closeSSE();
      window.removeEventListener('beforeunload', closeSSE);
    };
  }, [connectSSE, closeSSE]);

  const value = useMemo(
    () => ({
      eventSource,
      connectSSE,
      notification,
      changeNotification,
      closeSSE,
    }),
    [notification, changeNotification, connectSSE, closeSSE, eventSource]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
