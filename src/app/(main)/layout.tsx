import { PropsWithChildren } from 'react';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { apis } from '@/apis';
import QueryClientProvider from '@/components/common/queryProvider';
import { GatheringListResponse } from '@/types/gathering';

export default async function Layout({ children }: PropsWithChildren) {
  const queryClient = new QueryClient();

  const date = new Date();

  try {
    await queryClient.fetchQuery<GatheringListResponse[]>({
      queryKey: ['appointments', date.getFullYear(), date.getMonth() + 1, date.getDate()],
      queryFn: () => apis.serverGathering.getList(date, queryClient),
    });
  } catch (error) {
    console.error(error);
  }

  const dehydratedState = dehydrate(queryClient);

  return <QueryClientProvider dehydratedState={dehydratedState}>{children}</QueryClientProvider>;
}
