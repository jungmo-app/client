'use client';

import { useEffect, useRef } from 'react';

interface UseInfiniteScrollDownProps {
  onIntersect: () => Promise<void> | void;
  options?: IntersectionObserverInit;
}

export const useInfiniteScrollDown = <TTarget extends HTMLElement>({
  onIntersect,
  options,
}: UseInfiniteScrollDownProps) => {
  const targetRef = useRef<TTarget>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(async entry => {
        if (entry.isIntersecting) {
          await onIntersect();
        }
      });
    }, options);

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [onIntersect, options]);
  return { targetRef };
};
