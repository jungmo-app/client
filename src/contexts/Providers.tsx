import { QueryClient, dehydrate } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apis } from '@/apis';
import QueryClientProvider from '@/components/common/queryProvider';
import GlobalErrorBoundary from '@/components/ErrorBoundary/GlobalErrorBoundary';
import { verifyToken } from '@/libs/auth/jwt';
import { StrictPropsWithChildren } from '@/types/common';
import { ApiError } from '@/utils/error';
import { QueryClientBaseProvider } from './QueryClientBaseProvider';
import { SessionContextProvider } from './SessionProvider';
import { ThemeProvider } from './ThemeProvider';

export default async function Providers({ children }: StrictPropsWithChildren) {
  const queryClient = new QueryClient();

  const accessToken = cookies().get('accessToken')?.value;

  if (accessToken) {
    const isValidToken = await verifyToken(accessToken);
    if (isValidToken) {
      try {
        await queryClient.prefetchQuery({
          queryKey: ['notification'],
          queryFn: apis.serverNotification.getNotification,
        });
      } catch (error) {
        if (error instanceof ApiError && error.status === 401 && error.code.startsWith('T')) {
          redirect(`/login?date=${Date.now()}`);
        }
        console.error(error);
      }
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
