
"use client";

import React, { useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import type { Room, Booking } from '@/types';
import { isSameDay, addDays, eachDayOfInterval, parseISO } from 'date-fns';
import type { DayModifiers } from 'react-day-picker';

interface AvailabilityCalendarDisplayProps {
  rooms: Room[];
  bookings: Booking[];
}

// Helper to parse booking dates if they are not already Date objects
const parseBookings = (bookings: Booking[]): Booking[] => 
  bookings.map(booking => ({
    ...booking,
    startDate: typeof booking.startDate === 'string' ? parseISO(booking.startDate) : booking.startDate,
    endDate: typeof booking.endDate === 'string' ? parseISO(booking.endDate) : booking.endDate,
  }));


export default function AvailabilityCalendarDisplay({ 
  rooms: rawRooms, 
  bookings: rawBookings 
}: AvailabilityCalendarDisplayProps) {
  
  const rooms = useMemo(() => rawRooms, [rawRooms]);
  const bookings = useMemo(() => parseBookings(rawBookings), [rawBookings]);

  const totalRooms = rooms.length;

  const dailyAvailabilityModifiers = useMemo(() => {
    const modifiers: DayModifiers = {
      fullyAvailable: [],
      partiallyAvailable: [],
      fullyBooked: [],
    };

    // Consider a reasonable range for display, e.g., current month and next 2 months
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = addDays(new Date(today.getFullYear(), today.getMonth() + 3, 0), -1); // End of 2 months from now

    if (totalRooms === 0) return modifiers;

    eachDayOfInterval({ start: startDate, end: endDate }).forEach(day => {
      let bookedRoomsCount = 0;
      rooms.forEach(room => {
        const isRoomBookedOnDay = bookings.some(booking =>
          booking.roomId === room.id &&
          day >= booking.startDate &&
          day < booking.endDate // endDate is exclusive
        );
        if (isRoomBookedOnDay) {
          bookedRoomsCount++;
        }
      });

      if (bookedRoomsCount === 0) {
        modifiers.fullyAvailable?.push(new Date(day));
      } else if (bookedRoomsCount < totalRooms) {
        modifiers.partiallyAvailable?.push(new Date(day));
      } else {
        modifiers.fullyBooked?.push(new Date(day));
      }
    });
    
    return modifiers;
  }, [rooms, bookings, totalRooms]);

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-card">
      <Calendar
        mode="multiple" // "multiple" or "single" to enable selection styling if needed, but effectively read-only
        selected={[]} // No actual selection, just using modifiers
        modifiers={dailyAvailabilityModifiers}
        modifiersClassNames={{
          fullyAvailable: 'day-fully-available',
          partiallyAvailable: 'day-partially-available',
          fullyBooked: 'day-fully-booked',
        }}
        numberOfMonths={2}
        className="w-full"
        disabled={(day) => day < new Date(new Date().setHours(0,0,0,0))} // Disable past dates
      />
       <div className="mt-4 p-4 border-t flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm day-fully-available"></div>
          <span>Fully Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm day-partially-available"></div>
          <span>Partially Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm day-fully-booked"></div>
          <span>Fully Booked</span>
        </div>
      </div>
    </div>
  );
}

