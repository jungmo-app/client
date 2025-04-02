'use client';

import { ReactNode, createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { apis } from '@/apis';
import { apiPaths } from '@/constants/apis';
import { getCookie } from '@/libs/serverAction';
import { InviteSSEType, NotificationType } from '@/types/notification';
import { UserInfoResponse } from '@/types/user';

interface SessionContextType {
  isLogin: boolean;
  notification: NotificationType[];
  userData: UserInfoResponse | null;
  connectSession: () => Promise<void>;
  closeSession: () => void;
  changeNotification: React.Dispatch<React.SetStateAction<NotificationType[]>>;
  changeUserData: React.Dispatch<React.SetStateAction<UserInfoResponse | null>>;
}

interface SessionContextProviderProps {
  children: ReactNode;
  accessToken: string | null;
  initialNotification: NotificationType[];
  initialUserData: UserInfoResponse | null;
}

export const SessionContext = createContext<SessionContextType>({
  isLogin: false,
  notification: [],
  userData: null,
  connectSession: async () => {},
  closeSession: () => {},
  changeNotification: () => {},
  changeUserData: () => {},
});

export function SessionContextProvider({
  children,
  accessToken,
  initialNotification,
  initialUserData,
}: SessionContextProviderProps) {
  const eventSource = useRef<EventSource | null>(null);
  const isInitial = useRef<boolean>(true);

  const [notification, setNotification] = useState<NotificationType[]>(initialNotification);
  const [userData, setUserData] = useState<UserInfoResponse | null>(initialUserData);
  const [isLogin, setIsLogin] = useState(Boolean(accessToken));

  const changeNotification = useCallback((value: React.SetStateAction<NotificationType[]>) => {
    setNotification(value);
  }, []);

  const changeUserData = useCallback((value: React.SetStateAction<UserInfoResponse | null>) => {
    setUserData(value);
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
    setUserData(null);
    setIsLogin(false);
  }, [closeSSE]);

  const connectSession = useCallback(async () => {
    const token = await getCookie('accessToken');
    if (!token) {
      return;
    }
    closeSession();

    const notification = await apis.notification.getNotification();
    const user = await apis.user.getInfo();

    setNotification(notification?.data ?? []);
    setUserData(user);

    await connectSSE(token);
    setIsLogin(true);
  }, [closeSession, connectSSE]);

  useEffect(() => {
    const getInitialConnetSession = async () => {
      if (!accessToken) {
        return;
      }
      setIsLogin(true);

      if (!userData) {
        const user = await apis.user.getInfo();
        setUserData(user);
      }
      await connectSSE(accessToken);
    };
    if (isInitial.current) {
      getInitialConnetSession();
    }
    isInitial.current = false;
  }, [connectSSE, userData, accessToken]);

  const value = useMemo(
    () => ({
      isLogin,
      notification,
      userData,
      connectSession,
      closeSession,
      changeNotification,
      changeUserData,
    }),
    [isLogin, notification, userData, connectSession, closeSession, changeNotification, changeUserData]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
