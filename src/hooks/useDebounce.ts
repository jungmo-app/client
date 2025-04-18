'use client';

import { useEffect, useRef, useState } from 'react';

const useDebounce = <T>(value: T, delay: number = 500, onDebounce?: () => void) => {
  const isInitial = useRef<boolean>(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
      onDebounce?.();
      timerRef.current = null;
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [value, delay, onDebounce]);

  const clearDebounce = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setDebouncedValue(value);
  };

  return { value: debouncedValue, clearDebounce };
};

export default useDebounce;
