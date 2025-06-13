import * as React from "react";
import { Calendar } from "@/components/ui/calendar";

export function Calendar02() {
  const [date, setDate] = React.useState(new Date());

  return (
    <Calendar
      mode="single"
      defaultMonth={date}
      numberOfMonths={2}
      selected={date}
      onSelect={setDate}
      className={`rounded-4xl border shadow-sm relative bla top-2 flex justify-center bg-white z-1`} 
    />
  );
}
