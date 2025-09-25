import { SearchCalendarBase } from "@/Components/ui/search-calendar";
import { useEffect, useState, useMemo } from "react";
import type { DateRange } from "react-day-picker";

interface SearchCalendarProps {
  className?: string;
  focusInput: "checkIn" | "checkOut" | null;
  bookingDates: {
    checkIn: Date | null;
    checkOut: Date | null;
  };
  onDateSelect: (date: Date, type: "checkIn" | "checkOut") => void;
}

export function SearchCalendar({
  className,
  focusInput,
  bookingDates,
  onDateSelect,
}: SearchCalendarProps) {
  const [fromD, setFromD] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (focusInput === "checkOut" && bookingDates.checkIn) {
      // Allow selecting checkout date on or after checkin date
      setFromD(bookingDates.checkIn);
    } else {
      // For checkin, allow from today
      setFromD(new Date());
    }
  }, [focusInput, bookingDates.checkIn]);

  const isPreviewingRange = focusInput === "checkOut" && !!bookingDates.checkIn;

  const handleSelect = (value: Date | DateRange | undefined) => {
    if (!value || !focusInput) return;

    if (focusInput === "checkIn") {
      if (value instanceof Date) {
        onDateSelect(value, "checkIn");
      }
    } else if (focusInput === "checkOut") {
      if (typeof value === "object" && value && "from" in value) {
        const range = value as DateRange;
        // When user clicks the second date in a range, `to` is populated.
        // If they click a date before `from`, a new range is started with only `from`.
        const selectedDate = range.to || range.from;
        if (selectedDate) {
          onDateSelect(selectedDate, "checkOut");
        }
      } else if (value instanceof Date) {
        // Fallback for unexpected single date in range mode
        onDateSelect(value, "checkOut");
      }
    }
  };

  const selectedValue = useMemo(() => {
    if (isPreviewingRange) {
      const range: DateRange = { from: bookingDates.checkIn! };
      if (bookingDates.checkOut) {
        range.to = bookingDates.checkOut;
      } else if (hoveredDate && hoveredDate >= bookingDates.checkIn!) {
        range.to = hoveredDate;
      }
      return range;
    }
    return bookingDates.checkIn || undefined;
  }, [isPreviewingRange, bookingDates, hoveredDate]);

  return (
    <SearchCalendarBase
      mode={isPreviewingRange ? "range" : "single"}
      defaultMonth={bookingDates.checkIn || new Date()}
      numberOfMonths={2}
      selected={selectedValue}
      onSelect={handleSelect as any} // Using 'as any' to bypass complex conditional types
      disabled={{ before: fromD }}
      className={`${className} border shadow-sm relative top-2 flex justify-center bg-white z-2`}
      onDayMouseEnter={(day) => isPreviewingRange && setHoveredDate(day)}
      onDayMouseLeave={() => isPreviewingRange && setHoveredDate(undefined)}
    />
  );
}