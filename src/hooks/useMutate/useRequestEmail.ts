'use client';

import { useMutation } from '@tanstack/react-query';
import { apis } from '@/apis';
import { SetPasswordFormValues } from '@/types/auth';
import { ApiError } from '@/utils/error';

interface RequestEmailProps {
  onSuccess?: () => void;
  onError?: (error?: ApiError) => void;
}

export const useRequestEmail = ({ onSuccess, onError }: RequestEmailProps = {}) => {
  return useMutation<unknown, ApiError, SetPasswordFormValues>({
    mutationFn: payload => apis.auth.setPassword(payload),
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: error => {
      if (onError) {
        onError(error);
      }
      alert(error.message ?? '인증 이메일 요청에 실패하였습니다');
    },
  });
};
