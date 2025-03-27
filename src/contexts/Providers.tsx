import { cookies } from 'next/headers';
import { apis } from '@/apis';
import GlobalErrorBoundary from '@/components/ErrorBoundary/GlobalErrorBoundary';
import { StrictPropsWithChildren } from '@/types/common';
import { NotificationContextProvider } from './NotificationProvider';
import { QueryClientProvider } from './QueryClientProvider';
import { ThemeProvider } from './ThemeProvider';

export default async function Providers({ children }: StrictPropsWithChildren) {
  const accessToken = cookies().get('accessToken')?.value;
  const notification = accessToken ? ((await apis.serverNotification.getNotification())?.data ?? []) : [];
  return (
    <ThemeProvider>
      <GlobalErrorBoundary>
        <QueryClientProvider>
          <NotificationContextProvider initialNotification={notification}>{children}</NotificationContextProvider>
        </QueryClientProvider>
      </GlobalErrorBoundary>
    </ThemeProvider>
  );
}
