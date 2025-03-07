import GlobalErrorBoundary from '@/components/ErrorBoundary/GlobalErrorBoundary';
import { StrictPropsWithChildren } from '@/types/common';
import { QueryClientProvider } from './QueryClientProvider';
import { ThemeProvider } from './ThemeProvider';

const Providers = ({ children }: StrictPropsWithChildren) => {
  return (
    <ThemeProvider>
      <GlobalErrorBoundary>
        <QueryClientProvider>{children}</QueryClientProvider>
      </GlobalErrorBoundary>
    </ThemeProvider>
  );
};

export default Providers;
