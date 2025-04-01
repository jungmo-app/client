import { create } from 'zustand';

interface DateState {
  date: Date;
  setDate: (value: Date | ((prev: Date) => Date)) => void;
}

export const useDateStore = create<DateState>((set, get) => ({
  date: new Date(),
  setDate: value =>
    set(() => ({
      date: typeof value === 'function' ? value(get().date) : value,
    })),
}));
