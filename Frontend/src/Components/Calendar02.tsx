import React from "react";
import { Calendar } from "@/Components/ui/calendar";
import type { TFocInput } from "./Listings/showPage_Components/reserve";

// 👇 Define prop types for Calendar02
interface Calendar02Props {
  className?: string;
  date?: Date | undefined;
  setDate?: (date: Date | undefined) => void;
  setBookingDates?: React.Dispatch<
    React.SetStateAction<{
      checkIn: string | null;
      checkOut: string | null;
    }>
  >;
  focusInput?: TFocInput;
  setFocusInput?:React.Dispatch<React.SetStateAction<TFocInput>>;
  setShowCalendar?:React.Dispatch<React.SetStateAction<boolean>>
}

export function Calendar02({
  className,
  date,
  setDate,
  setBookingDates,
  focusInput,
  setFocusInput,
  setShowCalendar
}: Calendar02Props) {
  return (
    <Calendar
      mode="single"
      defaultMonth={date}
      numberOfMonths={2}
      selected={date}
      onSelect={setDate}
      fromDate={new Date()}
      className={`${className} border shadow-sm relative top-2 flex justify-center bg-white z-2`}
      setBookingDates={setBookingDates}
      focusInput={focusInput}
      setFocusInput={setFocusInput}
      setShowCalendar={setShowCalendar}
    />
  );
}
