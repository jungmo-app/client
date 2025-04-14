'use  client';

import { PropsWithChildren } from 'react';
import { HydrationBoundary } from '@tanstack/react-query';

interface QueryClientProviderProps extends PropsWithChildren {
  dehydratedState: unknown;
}

export default function QueryClientProvider({ children, dehydratedState }: QueryClientProviderProps) {
  return <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>;
}
