'use client';

import { useContext, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { apis } from '@/apis';
import { SessionContext } from '@/contexts/SessionProvider';
import { ApiError } from '@/types/apis';
import { LoginRequest } from '@/types/auth';

interface LoginProps {
  onError?: (error: ApiError) => void;
  onSuccess?: () => void;
}

export const useLogin = ({ onSuccess, onError }: LoginProps = {}) => {
  const router = useRouter();
  const params = useSearchParams();

  const [isPending, setIsPending] = useState<boolean>(false);

  const { openSession, closeSession } = useContext(SessionContext);

  const mutation = useMutation<unknown, ApiError, LoginRequest>({
    mutationFn: payload => {
      setIsPending(true);
      return apis.auth.login(payload);
    },
    onSuccess: async () => {
      onSuccess?.();
      console.log('aaa');
      try {
        await openSession();
        const refer = params.get('refer');
        router.push(`${refer ?? '/'}`);
        router.refresh();
      } catch {
        closeSession();
        if (onError) {
          const error = { status: 400, message: '세션 연결 실패', code: '' } as ApiError;
          onError(error);
        }
      } finally {
        setIsPending(false);
      }
    },
    onError: error => {
      onError?.(error);
      setIsPending(false);
    },
  });

  return {
    ...mutation,
    isPending,
  };
};
