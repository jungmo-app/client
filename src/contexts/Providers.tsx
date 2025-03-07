import { Provider as JotaiProvider } from 'jotai';
import GlobalErrorBoundary from '@/components/ErrorBoundary/GlobalErrorBoundary';
import { StrictPropsWithChildren } from '@/types/common';
import { QueryClientProvider } from './QueryClientProvider';
import { ThemeProvider } from './ThemeProvider';

const Providers = ({ children }: StrictPropsWithChildren) => {
  return (
    <ThemeProvider>
      <GlobalErrorBoundary>
        <JotaiProvider>
          <QueryClientProvider>{children}</QueryClientProvider>
        </JotaiProvider>
      </GlobalErrorBoundary>
    </ThemeProvider>
  );
};

export default Providers;
