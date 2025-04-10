'use client';

import { useState } from 'react';
import {
  QueryClientProvider as BaseQueryClientProvider,
  HydrationBoundary,
  QueryClient,
  QueryClientConfig,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProviderProps } from '@/types/common';

const queryClientOption: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      networkMode: 'always',
      staleTime: 0,
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
