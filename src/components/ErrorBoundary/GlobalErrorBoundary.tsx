'use client';

import { ErrorBoundary } from '@suspensive/react';
import { usePathname } from 'next/navigation';
import { StrictPropsWithChildren } from '@/types/common';
import ErrorBoundaryFallback from './ErrorBoundaryFallback';

const GlobalErrorBoundary = ({ children }: StrictPropsWithChildren) => {
  const pathname = usePathname();

  return (
    <ErrorBoundary resetKeys={[pathname]} fallback={ErrorBoundaryFallback}>
      {children}
    </ErrorBoundary>
  );
};

export default GlobalErrorBoundary;
