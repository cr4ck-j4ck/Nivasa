import { Calendar } from "@/Components/ui/calendar";
import reserveStore from "@/Store/Reserve";
import { useShallow } from "zustand/react/shallow";

export function Calendar02({
  className
}: { className?: string}) {
  const {date , setDate} = reserveStore(useShallow(state => ({
    date : state.date,
    setDate: state.setDate
  })))
  return (
    <Calendar
      mode="single"
      defaultMonth={date}
      numberOfMonths={2}
      selected={date}
      onSelect={setDate}
      fromDate={new Date()}
      className={`${className} border shadow-sm relative top-2 flex justify-center bg-white z-2`}
    />
  );
}
