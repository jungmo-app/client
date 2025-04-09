'use client';

import { useContext, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { apis } from '@/apis';
import { SessionContext } from '@/contexts/SessionProvider';
import { LoginRequest } from '@/types/auth';
import { ApiError } from '@/utils/error';

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
      try {
        await openSession();
        const refer = params.get('refer');
        router.push(`${refer ?? '/'}`);
        router.refresh();
      } catch (error) {
        closeSession();
        if (onError) {
          if (error instanceof ApiError) {
            onError(error);
          } else {
            onError(new ApiError(500, 'F001'));
          }
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
