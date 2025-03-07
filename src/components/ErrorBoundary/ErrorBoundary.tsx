import { Suspense } from 'react';
import LoadingIcon from '@/components/common/loadingIcon';
import { StrictPropsWithChildren } from '@/types/common';
import ApiErrorBoundary from './ApiErrorBoundary';

const ErrorBoundary = ({ children }: StrictPropsWithChildren) => {
  return (
    <ApiErrorBoundary>
      <Suspense fallback={<LoadingIcon />}>{children}</Suspense>
    </ApiErrorBoundary>
  );
};

export default ErrorBoundary;
