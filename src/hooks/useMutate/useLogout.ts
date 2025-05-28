'use client';

import { useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apis } from '@/apis';
import { SessionContext } from '@/contexts/SessionProvider';
import { setCookie } from '@/libs/serverAction';
import { ApiError } from '@/utils/error';

export const useLogout = (onSuccess?: () => void, onError?: () => void) => {
  const { closeSession } = useContext(SessionContext);
  const queryClient = useQueryClient();

  const handleSuccessLogout = async () => {
    await setCookie('accessToken', '', {
      maxAge: 0,
      expires: new Date(),
    });
    await setCookie('refreshToken', '', {
      maxAge: 0,
      expires: new Date(),
    });
    closeSession();
    if (onSuccess) {
      onSuccess();
    }
    alert('로그아웃 되었습니다');
    queryClient.clear();
    window.location.replace('/login');
  };

  const handleErrorLogout = (error: ApiError) => {
    if (error.code === 'C006' || error.code.startsWith('T')) {
      handleSuccessLogout();
      return;
    }

    onError?.();
    alert('로그아웃에 실패하였습니다');
  };

  return useMutation({
    mutationFn: apis.auth.logout,
    onSuccess: handleSuccessLogout,
    onError: () => handleErrorLogout,
  });
};
