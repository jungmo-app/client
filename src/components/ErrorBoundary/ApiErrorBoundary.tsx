'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from '@suspensive/react';
import { usePathname } from 'next/navigation';
import { StrictPropsWithChildren } from '@/types/common';
import ErrorBoundaryFallback from './ErrorBoundaryFallback';

const ApiErrorBoundary = ({ children }: StrictPropsWithChildren) => {
  const pathname = usePathname();

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary resetKeys={[pathname]} fallback={ErrorBoundaryFallback} onReset={reset}>
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default ApiErrorBoundary;
