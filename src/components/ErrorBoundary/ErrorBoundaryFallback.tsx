import { ErrorBoundaryFallbackProps } from '@suspensive/react';
import { Button } from '@/components/ui/button';

const ErrorBoundaryFallback = ({ error, reset }: ErrorBoundaryFallbackProps) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4">
      <h1 className="text-md text-center">{error.message}</h1>
      <Button onClick={reset}>다시 불러오기</Button>
    </div>
  );
};

export default ErrorBoundaryFallback;
