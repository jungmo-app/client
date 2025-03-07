'use client';

import { PropsWithChildren, createContext, useCallback, useMemo, useState } from 'react';

interface DateContextType {
  date: Date;
  updateDate: (value: Date | ((prev: Date) => Date)) => void;
}

export const DateContext = createContext<DateContextType>({
  date: new Date(),
  updateDate: () => {},
});

export function DateContexProvider({ children }: PropsWithChildren) {
  const [date, setDate] = useState<Date>(new Date());
  const updateDate = useCallback((value: Date | ((prev: Date) => Date)) => {
    if (typeof value === 'function') {
      setDate(prev => value(prev));
      return;
    }
    setDate(value);
  }, []);

  const value = useMemo(
    () => ({
      date,
      updateDate,
    }),
    [date, updateDate]
  );

  return <DateContext.Provider value={value}>{children}</DateContext.Provider>;
}
