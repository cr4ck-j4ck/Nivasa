// @ts-nocheck
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import type {
  DayPickerSingleProps,
  DayPickerRangeProps,
} from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/Components/ui/button-variants";
import reserveStore from "@/Store/Reserve";
import { useShallow } from "zustand/react/shallow";
import { useMemo, useState } from "react";


// 👇 Union type to support both single and range modes
type CalendarProps = (
  | DayPickerSingleProps
  | DayPickerRangeProps
) & {
  className?: string;
  classNames?: Record<string, string>;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {

  const { setBookingDates, setFocusInput, focusInput, setShowCalendar, bookingDates } = reserveStore(useShallow(state => ({
    setBookingDates: state.setBookingDates,
    setFocusInput: state.setFocusInput,
    focusInput: state.focusInput,
    setShowCalendar: state.setShowCalendar,
    bookingDates: state.bookingDates
  })))

  // hoveredDate tracks the day the user is hovering while choosing checkout
  const [hoveredDate, setHoveredDate] = useState<Date | undefined>(undefined);

  // when user is selecting checkout and checkIn exists, compute a preview range
  const isPreviewingRange = focusInput === "input2" && !!bookingDates?.checkIn;
  const previewSelected = useMemo(() => {
    if (!isPreviewingRange) return props.selected;
    const start = bookingDates!.checkIn!;
    if (!hoveredDate) return { from: start };
    const from = start <= hoveredDate ? start : hoveredDate;
    const to = start <= hoveredDate ? hoveredDate : start;
    return { from, to };
  }, [isPreviewingRange, bookingDates?.checkIn, hoveredDate, props.selected]);
  
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          // 🛠️ Fix: mode is now inferred from DayPicker props
          "mode" in props && props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-gray-300 aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }: React.ComponentProps<"svg">) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }: React.ComponentProps<"svg">) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
      // override selected so the hover preview range is rendered
      selected={previewSelected as any}
      // while previewing, force range mode so range classes are applied
      mode={isPreviewingRange ? "range" : (props as any).mode}
      // update hoveredDate as user moves over days; clear on leave
      onDayMouseEnter={(day) => day && setHoveredDate(day)}
      onMouseLeave={() => setHoveredDate(undefined)}
      onDayClick={(e) => {

        if (focusInput === "input1") {
          setBookingDates({
            checkIn: e,
          });
          setFocusInput("input2");
        }
        if (focusInput === "input2") {
          setBookingDates({
            checkOut: e,
          });
          setFocusInput(null);
          setShowCalendar(false);
        }
      }}
    />
  );
}

export { Calendar };
