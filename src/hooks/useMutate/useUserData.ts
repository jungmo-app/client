import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apis } from '@/apis';
import { UserInfoResponse } from '@/types/auth';
import { ApiError } from '@/utils/error';

export const useUserData = () => {
  const queryClient = useQueryClient();

  return useMutation<UserInfoResponse, ApiError>({
    mutationFn: apis.user.getInfo,
    onSuccess: data => {
      queryClient.setQueryData<UserInfoResponse>(['userData'], data);
    },
  });
};
