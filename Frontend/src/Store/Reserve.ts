import { create } from "zustand";
import type { TFocInput, IBookingDates } from "@/@Types/interfaces";

export interface IreserveStore {
  showCalendar: boolean;
  setShowCalendar: (toUpdate: boolean) => void;
  focusInput: TFocInput;
  setFocusInput: (toUpdate: TFocInput) => void;
  bookingDates: IBookingDates;
  setBookingDates: (toUpdate: Partial<IBookingDates>) => void;
  date: Date | undefined;
  setDate: (toUpdate: Date | undefined) => void;
}

const reserveStore = create<IreserveStore>((set) => ({
  showCalendar: false,
  setShowCalendar: (toUpdate) => set({ showCalendar: toUpdate }),
  focusInput: null,
  setFocusInput: (toUpdate) => set({ focusInput: toUpdate }),
  bookingDates: { checkIn: null, checkOut: null },
  setBookingDates: (toUpdate) =>
    set((state) => ({
      bookingDates: { ...state.bookingDates, ...toUpdate },
    })),
  date: undefined,
  setDate: (toUpdate) => set({ date: toUpdate }),
}));

export default reserveStore;
