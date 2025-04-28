'use client';

import { useMutation } from '@tanstack/react-query';
import { apis } from '@/apis';
import { ChangePasswordPayload } from '@/types/auth';
import { ApiError } from '@/utils/error';

interface ChangePasswordProps {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
}

export const useChangePassword = ({ onSuccess, onError }: ChangePasswordProps = {}) => {
  return useMutation<unknown, ApiError, ChangePasswordPayload>({
    mutationFn: (payload: ChangePasswordPayload) => apis.auth.changePassword(payload),
    onSuccess: () => {
      alert('비밀번호를 변경하였습니다');
      onSuccess?.();
    },
    onError: error => {
      onError?.(error);
    },
  });
};
