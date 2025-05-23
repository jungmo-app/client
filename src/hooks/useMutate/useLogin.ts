'use client';

import { useContext, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { apis } from '@/apis';
import { SessionContext } from '@/contexts/SessionProvider';
import { setCookie } from '@/libs/serverAction';
import { LoginRequest, LoginResponse } from '@/types/auth';
import { ApiError } from '@/utils/error';

interface LoginProps {
  onError?: (error: ApiError) => void;
  onSuccess?: () => void;
}

export const useLogin = ({ onSuccess, onError }: LoginProps = {}) => {
  const router = useRouter();
  const params = useSearchParams();
  const QueryClient = useQueryClient();

  const [isPending, setIsPending] = useState<boolean>(false);

  const { openSession, closeSession } = useContext(SessionContext);

  const mutation = useMutation<LoginResponse, ApiError, LoginRequest>({
    mutationFn: payload => {
      setIsPending(true);
      return apis.auth.login(payload);
    },
    onSuccess: async ({ accessToken, ...userData }) => {
      await setCookie('accessToken', accessToken, {
        maxAge: 60 * 60 * 24 * 7,
      });

      onSuccess?.();
      try {
        QueryClient.setQueryData(['userData'], userData);
        await openSession(accessToken);
        console.log('success');
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
