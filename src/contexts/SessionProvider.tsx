'use client';

import { PropsWithChildren, createContext, useCallback, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apis } from '@/apis';
import { useSSE } from '@/hooks/useSSE';
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
  const { connectSSE, closeSSE } = useSSE();

  const closeSession = useCallback(() => {
    closeSSE();
    queryClient.removeQueries({ queryKey: ['notification'] });
  }, [closeSSE, queryClient]);

  const openSession = useCallback(async () => {
    try {
      await Promise.all([
        queryClient.fetchQuery({ queryKey: ['notification'], queryFn: apis.notification.getNotification }),
        connectSSE(),
      ]);
    } catch (error) {
      console.error(error);
      closeSSE();
      throw new Error('로그인 오류');
    }
  }, [connectSSE, closeSSE, queryClient]);

  useEffect(() => {
    const getInitialConnetSession = async () => {
      const accessToken = await getCookie('accessToken');
      if (accessToken) {
        await Promise.all([
          connectSSE(),
          queryClient.fetchQuery({ queryKey: ['userData'], queryFn: apis.user.getInfo }),
        ]);
      }
    };
    getInitialConnetSession();
  }, [connectSSE, queryClient]);

  useEffect(() => {
    window.addEventListener('beforeunload', closeSSE);
    return () => {
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
