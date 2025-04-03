import { PropsWithChildren } from 'react';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apis } from '@/apis';
import { GatheringListResponse } from '@/types/gathering';
import QueryClientProvider from './queryProvider';

export default async function Layout({ children }: PropsWithChildren) {
  const queryClient = new QueryClient();
  const accessToken = cookies().get('accessToken')?.value;

  const date = new Date();

  if (!accessToken) {
    redirect(`/login?refer=/&date=${Date.now()}`);
  }

  try {
    await queryClient.fetchQuery<GatheringListResponse[]>({
      queryKey: ['appointments', date.getFullYear(), date.getMonth() + 1, date.getDate()],
      queryFn: () => apis.serverGathering.getList(date),
    });
  } catch {
    redirect(`/login?refer=/&date=${Date.now()}`);
  }

  const dehydratedState = dehydrate(queryClient);

  return <QueryClientProvider dehydratedState={dehydratedState}>{children}</QueryClientProvider>;
}
