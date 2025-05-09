'use client';

import { useEffect, useRef } from 'react';

interface UseInfiniteScrollUpProps {
  onIntersect: () => Promise<void> | void;
  options?: IntersectionObserverInit;
}

export const useInfiniteScrollUp = <TTarget extends HTMLElement, TContainer extends HTMLElement = HTMLDivElement>({
  onIntersect,
  options,
}: UseInfiniteScrollUpProps) => {
  const containerRef = useRef<TContainer>(null);
  const targetRef = useRef<TTarget>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(async entry => {
        if (entry.isIntersecting && containerRef.current) {
          const prevScrollHeight = containerRef.current.scrollHeight;
          await onIntersect();
          requestAnimationFrame(() => {
            if (!containerRef.current) {
              return;
            }
            const newScrollHeight = containerRef.current.scrollHeight;
            const heightDiff = newScrollHeight - prevScrollHeight;
            containerRef.current.scrollTop += heightDiff;
          });
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

  return { targetRef, containerRef };
};
