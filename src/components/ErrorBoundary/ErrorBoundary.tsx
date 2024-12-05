import { Suspense } from 'react';
import Loading from '@/components/common/Loading';
import { StrictPropsWithChildren } from '@/types/common';
import ApiErrorBoundary from './ApiErrorBoundary';

const ErrorBoundary = ({ children }: StrictPropsWithChildren) => {
  return (
    <ApiErrorBoundary>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </ApiErrorBoundary>
  );
};

export default ErrorBoundary;
