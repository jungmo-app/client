'use client';

import { ReactNode, useState } from 'react';
import {
  QueryClientProvider as BaseQueryClientProvider,
  HydrationBoundary,
  QueryClient,
  QueryClientConfig,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface QueryClientProviderProps {
  children: ReactNode;
  dehydratedState: unknown;
}

const queryClientOption: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      networkMode: 'always',
    },
    mutations: {
      networkMode: 'always',
    },
  },
};

const QueryClientProvider = ({ children, dehydratedState }: QueryClientProviderProps) => {
  const [queryClient] = useState(() => new QueryClient(queryClientOption));

  return (
    <BaseQueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>

      <ReactQueryDevtools initialIsOpen={false} />
    </BaseQueryClientProvider>
  );
};

export { QueryClientProvider };
