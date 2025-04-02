import { cookies } from 'next/headers';
import { apis } from '@/apis';
import GlobalErrorBoundary from '@/components/ErrorBoundary/GlobalErrorBoundary';
import { verifyToken } from '@/libs/auth/jwt';
import { StrictPropsWithChildren } from '@/types/common';
import { QueryClientProvider } from './QueryClientProvider';
import { SessionContextProvider } from './SessionProvider';
import { ThemeProvider } from './ThemeProvider';

export default async function Providers({ children }: StrictPropsWithChildren) {
  const notificationProps = {
    initialNotification: [],
    accessToken: null,
    initialUserData: null,
  };

  const accessToken = cookies().get('accessToken')?.value;
  if (accessToken) {
    const isValidToken = await verifyToken(accessToken);
    if (isValidToken) {
      const userData = await apis.serverUser.getInfo();
      const notification = await apis.serverNotification.getNotification();

      Object.assign(notificationProps, {
        initialNotification: notification?.data ?? [],
        accessToken,
        initialUserData: userData?.data ?? null,
      });
    }
  }
  return (
    <ThemeProvider>
      <GlobalErrorBoundary>
        <QueryClientProvider>
          <SessionContextProvider {...notificationProps}>{children}</SessionContextProvider>
        </QueryClientProvider>
      </GlobalErrorBoundary>
    </ThemeProvider>
  );
}
