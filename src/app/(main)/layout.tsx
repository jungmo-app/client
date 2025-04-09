import { PropsWithChildren } from 'react';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { apis } from '@/apis';
import { GatheringListResponse } from '@/types/gathering';
import { ApiError } from '@/utils/error';
import QueryClientProvider from './queryProvider';

export default async function Layout({ children }: PropsWithChildren) {
  const queryClient = new QueryClient();

  const date = new Date();

  try {
    await queryClient.fetchQuery<GatheringListResponse[]>({
      queryKey: ['appointments', date.getFullYear(), date.getMonth() + 1, date.getDate()],
      queryFn: () => apis.serverGathering.getList(date, queryClient),
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401 && error.code.startsWith('T')) {
      redirect(`/login?refer=/&date=${Date.now()}`);
    }

    console.error(error);
  }

  const dehydratedState = dehydrate(queryClient);

  return <QueryClientProvider dehydratedState={dehydratedState}>{children}</QueryClientProvider>;
}
