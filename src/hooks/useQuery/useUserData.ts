import { useQuery } from '@tanstack/react-query';
import { apis } from '@/apis';
import { UserInfoResponse } from '@/types/user';

export const useUserData = () => {
  return useQuery<UserInfoResponse>({
    queryKey: ['userData'],
    queryFn: apis.user.getInfo,
    staleTime: 5 * 60 * 1000,
  });
};
