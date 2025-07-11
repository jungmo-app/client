'use client';

import { useEffect, useRef } from 'react';

interface UseInfiniteScrollUpProps {
  onIntersect: () => Promise<void> | void;
  options?: IntersectionObserverInit;
  heightDelta?: number;
}

export const useInfiniteScrollUp = <TTarget extends HTMLElement, TContainer extends HTMLElement = HTMLDivElement>({
  onIntersect,
  options,
  heightDelta = 0,
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
            setTimeout(() => {
              if (!containerRef.current) return;

              const newScrollHeight = containerRef.current.scrollHeight;
              const heightDiff = newScrollHeight - prevScrollHeight;

              console.log(containerRef.current.scrollTop);

              if (containerRef.current.scrollTop === 0 || /^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
                containerRef.current.scrollTop += heightDiff - heightDelta;
              }
            }, 0);
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
  }, [onIntersect, options, heightDelta]);

  return { targetRef, containerRef };
};
