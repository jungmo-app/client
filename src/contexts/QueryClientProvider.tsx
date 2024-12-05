'use client';

import { useState } from 'react';
import { QueryClientProvider as BaseQueryClientProvider, QueryClient, QueryClientConfig } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictPropsWithChildren } from '@/types/common';

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

const QueryClientProvider = ({ children }: StrictPropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient(queryClientOption));

  return (
    <BaseQueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </BaseQueryClientProvider>
  );
};

export { QueryClientProvider };
