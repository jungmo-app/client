'use client';

import { ElementRef, forwardRef, useEffect, useRef, useState } from 'react';
import { Skeleton as RadixSkeleton, SkeletonProps as RadixSkeletonProps } from '@radix-ui/themes';

interface SkeletonProps extends RadixSkeletonProps {
  delayTime?: number;
  loading?: boolean;
}

const Skeleton = forwardRef<ElementRef<typeof RadixSkeleton>, SkeletonProps>(
  ({ loading = false, delayTime = 0, ...props }, ref) => {
    const [isPending, setIsPending] = useState(true);
    const isPassedDelayTime = useRef<boolean>(false);
    const currentLoading = useRef<boolean>(loading);

    useEffect(() => {
      const timer = setTimeout(() => {
        isPassedDelayTime.current = true;
        setIsPending(currentLoading.current);
      }, delayTime);

      return () => clearTimeout(timer);
    }, [delayTime]);

    useEffect(() => {
      if (isPassedDelayTime.current) {
        setIsPending(loading);
      }
      currentLoading.current = loading;
    }, [loading]);

    return <RadixSkeleton ref={ref} loading={isPending} {...props} />;
  }
);

Skeleton.displayName = RadixSkeleton.displayName;

export default Skeleton;
