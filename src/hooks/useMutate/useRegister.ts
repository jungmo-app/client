'use client';

import { useContext } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apis } from '@/apis';
import { SessionContext } from '@/contexts/SessionProvider';
import { SignupFormValues } from '@/types/auth';
import { ApiError } from '@/utils/error';

export const useRegister = () => {
  const router = useRouter();
  const { openSession, closeSession } = useContext(SessionContext);
  return useMutation<unknown, ApiError, SignupFormValues>({
    mutationFn: payload => apis.auth.register(payload),
    onSuccess: async () => {
      try {
        await openSession();
        alert('회원가입에 성공하였습니다.');
        router.push('/');
      } catch {
        closeSession();
        alert('회원가입에 실패하였습니다.');
      }
    },
    onError: () => {
      alert('회원가입에 실패하였습니다.');
    },
  });
};
