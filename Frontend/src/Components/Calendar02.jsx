import * as React from "react";
import { Calendar } from "@/Components/ui/calendar";

export function Calendar02({customClass}) {
  const [date, setDate] = React.useState(new Date());

  return (
    <Calendar
      mode="single"
      defaultMonth={date}
      numberOfMonths={2}
      selected={date}
      onSelect={setDate}
      fromDate={new Date()}
      className={`${customClass} rounded-4xl border shadow-sm relative top-2 flex justify-center bg-white z-1`} 
    />
  );
}
