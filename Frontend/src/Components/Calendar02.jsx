import * as React from "react";
import { Calendar } from "@/components/ui/calendar";

export function Calendar02({ position }) {
  const [date, setDate] = React.useState(new Date());

  const dynamicLeftClass = `${Math.floor(position-20)}`;
  return (
    <Calendar
      mode="single"
      defaultMonth={date}
      numberOfMonths={2}
      selected={date}
      onSelect={setDate}
      className={`rounded-4xl border shadow-sm relative bla top-2 flex justify-center bg-white `}
      style={{ left: `${dynamicLeftClass}px` }} 
    />
  );
}
