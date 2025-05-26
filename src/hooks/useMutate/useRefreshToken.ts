import { useMutation } from '@tanstack/react-query';
import { apis } from '@/apis';
import { setCookie } from '@/libs/serverAction';
import { RefreshTokenResponse } from '@/types/auth';
import { ApiError } from '@/utils/error';

interface RefreshProps {
  onError?: (error: ApiError) => void;
  onSuccess?: () => Promise<void>;
}

export const useRefreshToken = ({ onSuccess, onError }: RefreshProps = {}) => {
  return useMutation<RefreshTokenResponse, ApiError>({
    mutationFn: apis.auth.refreshToken,
    onSuccess: async ({ accessToken }) => {
      console.log(accessToken);
      await setCookie('accessToken', accessToken, {
        maxAge: 60 * 60 * 24 * 7,
      });
      await onSuccess?.();
    },
    onError: error => {
      onError?.(error);
    },
  });
};
