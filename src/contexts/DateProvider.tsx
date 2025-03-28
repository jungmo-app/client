'use client';

import { PropsWithChildren, createContext, useCallback, useMemo, useState } from 'react';
import { SetAction, SetActionValue } from '@/types/common';
import { GatheringListResponse } from '@/types/gathering';

interface DateContextType {
  date: Date;
  appointments: GatheringListResponse[] | null;
  updateDate: SetAction<Date>;
  updateAppointment: SetAction<GatheringListResponse[] | null>;
}

export const DateContext = createContext<DateContextType>({
  date: new Date(),
  appointments: null,
  updateDate: () => {},
  updateAppointment: () => {},
});

export function DateContexProvider({ children }: PropsWithChildren) {
  const [date, setDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<GatheringListResponse[] | null>(null);

  const updateDate = useCallback((value: SetActionValue<Date>) => {
    setDate(value);
  }, []);

  const updateAppointment = useCallback((value: SetActionValue<GatheringListResponse[] | null>) => {
    setAppointments(value);
  }, []);

  const value = useMemo(
    () => ({
      date,
      appointments,
      updateDate,
      updateAppointment,
    }),
    [date, appointments, updateDate, updateAppointment]
  );

  return <DateContext.Provider value={value}>{children}</DateContext.Provider>;
}
