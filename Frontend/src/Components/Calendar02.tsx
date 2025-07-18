import React from "react";
import { Calendar } from "@/Components/ui/calendar";

// 👇 Define prop types for Calendar02
interface Calendar02Props {
  customClass?: string;
  date?: Date | undefined;
  setDate?: (date: Date | undefined) => void;
  setBookingDates?: React.Dispatch<
    React.SetStateAction<{
      checkIn: string | null;
      checkOut: string | null;
    }>
  >;
  focusInput?: "input1" | "input2" | null;
}

export function Calendar02({
  customClass,
  date,
  setDate,
  setBookingDates,
  focusInput,
}: Calendar02Props) {
  return (
    <Calendar
      mode="single"
      defaultMonth={date}
      numberOfMonths={2}
      selected={date}
      onSelect={setDate}
      fromDate={new Date()}
      className={`${customClass} border shadow-sm relative top-2 flex justify-center bg-white z-2`}
      setBookingDates={setBookingDates}
      focusInput={focusInput}
    />
  );
}
