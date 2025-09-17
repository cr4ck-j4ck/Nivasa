import { create } from "zustand";
import type { TFocInput, IBookingDates } from "@/@Types/interfaces";

export interface IGuestCount {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

export interface IreserveStore {
  showCalendar: boolean;
  setShowCalendar: (toUpdate: boolean) => void;
  focusInput: TFocInput;
  setFocusInput: (toUpdate: TFocInput) => void;
  bookingDates: IBookingDates;
  setBookingDates: (toUpdate: Partial<IBookingDates>) => void;
  date: Date | undefined;
  setDate: (toUpdate: Date | undefined) => void;
  guests: IGuestCount;
  setGuests: (toUpdate: Partial<IGuestCount>) => void;
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
  guests: { adults: 1, children: 0, infants: 0, pets: 0 },
  setGuests: (toUpdate) =>
    set((state) => ({
      guests: { ...state.guests, ...toUpdate },
    })),
}));

export default reserveStore;
