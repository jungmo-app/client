import GlobalErrorBoundary from '@/components/ErrorBoundary/GlobalErrorBoundary';
import { StrictPropsWithChildren } from '@/types/common';
import { NotificationContextProvider } from './NotificationProvider';
import { QueryClientProvider } from './QueryClientProvider';
import { ThemeProvider } from './ThemeProvider';

const Providers = ({ children }: StrictPropsWithChildren) => {
  return (
    <ThemeProvider>
      <GlobalErrorBoundary>
        <QueryClientProvider>
          <NotificationContextProvider>{children}</NotificationContextProvider>
        </QueryClientProvider>
      </GlobalErrorBoundary>
    </ThemeProvider>
  );
};

export default Providers;
