'use  client';

import { HydrationBoundary } from '@tanstack/react-query';
import { QueryClientProviderProps } from '@/types/common';

export default function QueryClientProvider({ children, dehydratedState }: QueryClientProviderProps) {
  return <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>;
}
