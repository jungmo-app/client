import { QueryClient, dehydrate } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { apis } from '@/apis';
import QueryClientProvider from '@/components/common/queryProvider';
import GlobalErrorBoundary from '@/components/ErrorBoundary/GlobalErrorBoundary';
import { StrictPropsWithChildren } from '@/types/common';
import { QueryClientBaseProvider } from './QueryClientBaseProvider';
import { SessionContextProvider } from './SessionProvider';
import { ThemeProvider } from './ThemeProvider';

export default async function Providers({ children }: StrictPropsWithChildren) {
  const queryClient = new QueryClient();

  const accessToken = cookies().get('accessToken')?.value;

  if (accessToken) {
    try {
      await queryClient.prefetchQuery({
        queryKey: ['notification'],
        queryFn: apis.serverNotification.getNotification,
      });
    } catch (error) {
      console.error(error);
    }
  }

  const dehydratedState = dehydrate(queryClient);
  return (
    <ThemeProvider>
      <GlobalErrorBoundary>
        <QueryClientBaseProvider>
          <QueryClientProvider dehydratedState={dehydratedState}>
            <SessionContextProvider>{children}</SessionContextProvider>
          </QueryClientProvider>
        </QueryClientBaseProvider>
      </GlobalErrorBoundary>
    </ThemeProvider>
  );
}
