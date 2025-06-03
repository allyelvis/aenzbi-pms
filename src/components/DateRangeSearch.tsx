
"use client"

import * as React from "react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Calendar as CalendarIcon, Search } from "lucide-react"
import { useRouter, usePathname } from "next/navigation";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangeSearchProps {
  initialDateRange?: DateRange;
}

export default function DateRangeSearch({ initialDateRange }: DateRangeSearchProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(initialDateRange);
  const router = useRouter();
  const pathname = usePathname();

  const handleSelect = (selectedRange: DateRange | undefined) => {
    setDate(selectedRange);
  }

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (date?.from) {
      params.set('from', date.from.toISOString().split('T')[0]); // Format as YYYY-MM-DD
    }
    if (date?.to) {
      params.set('to', date.to.toISOString().split('T')[0]); // Format as YYYY-MM-DD
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="grid gap-4 sm:flex sm:items-end sm:gap-2 p-4 border rounded-lg shadow-sm bg-card">
      <div className={cn("grid gap-2 flex-grow")}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleSelect}
              numberOfMonths={2}
              disabled={(day) => day < new Date(new Date().setHours(0,0,0,0))} // Disable past dates
            />
          </PopoverContent>
        </Popover>
      </div>
      <Button onClick={handleSearch} className="w-full sm:w-auto" disabled={!date?.from || !date?.to}>
        <Search className="mr-2 h-4 w-4" /> Search Availability
      </Button>
    </div>
  )
}
