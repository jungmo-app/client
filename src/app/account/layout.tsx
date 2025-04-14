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

  try {
    await queryClient.prefetchQuery<UserDataResponse>({
      queryKey: ['userData'],
      queryFn: apis.serverUser.getInfo,
    });
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
