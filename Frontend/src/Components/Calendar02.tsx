import { Calendar } from "@/Components/ui/calendar";
import reserveStore from "@/Store/Reserve";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

export function Calendar02({
  className
}: { className?: string}) {
  const [fromD , setFromD] = useState(new Date())
  const {date , setDate, focusInput , bookingDates} = reserveStore(useShallow(state => ({
    date : state.date,
    setDate: state.setDate,
    focusInput : state.focusInput,
    bookingDates: state.bookingDates
  }))) 
  useEffect(()=>{
    if(focusInput == "input2" && bookingDates.checkIn){
      setFromD(bookingDates.checkIn);
    }
  },[focusInput, bookingDates.checkIn])
  return (
    <Calendar
      mode="single"
      defaultMonth={date}
      numberOfMonths={2}
      selected={date}
      onSelect={setDate}
      fromDate={fromD}
      className={`${className} border shadow-sm relative top-2 flex justify-center bg-white z-2`}
    />
  );
}
