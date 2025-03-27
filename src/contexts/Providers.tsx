import { apis } from '@/apis';
import GlobalErrorBoundary from '@/components/ErrorBoundary/GlobalErrorBoundary';
import { StrictPropsWithChildren } from '@/types/common';
import { NotificationContextProvider } from './NotificationProvider';
import { QueryClientProvider } from './QueryClientProvider';
import { ThemeProvider } from './ThemeProvider';

export default async function Providers({ children }: StrictPropsWithChildren) {
  const notification = await apis.serverNotification.getNotification();
  const initialNotification = notification?.data ?? [];
  return (
    <ThemeProvider>
      <GlobalErrorBoundary>
        <QueryClientProvider>
          <NotificationContextProvider initialNotification={initialNotification}>
            {children}
          </NotificationContextProvider>
        </QueryClientProvider>
      </GlobalErrorBoundary>
    </ThemeProvider>
  );
}
