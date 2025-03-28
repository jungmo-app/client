import { create } from 'zustand';
import { GatheringListResponse } from '@/types/gathering';

interface AppointmentState {
  date: Date;
  appointments: GatheringListResponse[] | null;
  setDate: (value: Date | ((prev: Date) => Date)) => void;
  setAppointments: (
    value: GatheringListResponse[] | null | ((prev: GatheringListResponse[] | null) => GatheringListResponse[] | null)
  ) => void;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  date: new Date(),
  appointments: null,
  setDate: value =>
    set(() => ({
      date: typeof value === 'function' ? value(get().date) : value,
    })),
  setAppointments: value =>
    set(() => ({
      appointments: typeof value === 'function' ? value(get().appointments) : value,
    })),
}));
