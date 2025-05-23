import { PropsWithChildren } from 'react';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { apis } from '@/apis';
import QueryClientProvider from '@/components/common/queryProvider';
import { ButtonContextProvider } from '@/contexts/ButtonClickProvider';
import { UserDataResponse } from '@/types/auth';

export default async function Layout({ children }: PropsWithChildren) {
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery<UserDataResponse>({
      queryKey: ['userData'],
      queryFn: apis.serverUser.getInfo,
    });
  } catch (error) {
    console.error(error);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <QueryClientProvider dehydratedState={dehydratedState}>
      <ButtonContextProvider>{children}</ButtonContextProvider>
    </QueryClientProvider>
  );
}
