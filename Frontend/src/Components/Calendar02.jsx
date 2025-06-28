import React, { useEffect } from "react";
import { Calendar } from "@/Components/ui/calendar";

export function Calendar02({customClass , date ,setDate,setBookingDates,focusInput}) {
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
