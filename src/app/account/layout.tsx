import { PropsWithChildren } from 'react';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { apis } from '@/apis';
import QueryClientProvider from '@/components/common/queryProvider';
import { ButtonContextProvider } from '@/contexts/ButtonClickProvider';
import { UserDataResponse } from '@/types/user';
import { ApiError } from '@/utils/error';

export default async function Layout({ children }: PropsWithChildren) {
  const queryClient = new QueryClient();
  const userProfile = {};

  try {
    const userData = await queryClient.fetchQuery<UserDataResponse>({
      queryKey: ['userData'],
      queryFn: apis.serverUser.getInfo,
    });
    Object.assign(userProfile, { profileImage: userData.profileImage || '/samlpe.jpg' });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401 && error.code.startsWith('T')) {
      redirect(`/login?refer=/account&date=${Date.now()}`);
    }
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <QueryClientProvider dehydratedState={dehydratedState}>
      <ButtonContextProvider>{children}</ButtonContextProvider>
    </QueryClientProvider>
  );
}
