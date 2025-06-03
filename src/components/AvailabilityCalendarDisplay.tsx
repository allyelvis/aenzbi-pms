
"use client";

import React, { useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import type { Room as PrismaRoom, Reservation as PrismaReservation } from '@prisma/client'; // Use Prisma types
import { addDays, eachDayOfInterval } from 'date-fns';
import type { DayModifiers } from 'react-day-picker';

// Interface for props, ensuring Room.price is number and Reservation dates are Date
interface RoomForCalendar extends Omit<PrismaRoom, 'price' | 'id' | 'createdAt' | 'updatedAt'> {
  id: number;
  price: number;
}
interface ReservationForCalendar extends Omit<PrismaReservation, 'checkIn' | 'checkOut' | 'id' | 'guestId' | 'roomId' | 'createdAt' | 'updatedAt'> {
  id: number;
  guestId: number;
  roomId: number;
  checkIn: Date;
  checkOut: Date;
}

interface AvailabilityCalendarDisplayProps {
  rooms: RoomForCalendar[];
  reservations: ReservationForCalendar[];
}

export default function AvailabilityCalendarDisplay({ 
  rooms, 
  reservations 
}: AvailabilityCalendarDisplayProps) {
  
  const totalRooms = rooms.length;

  const dailyAvailabilityModifiers = useMemo(() => {
    const modifiers: DayModifiers = {
      fullyAvailable: [],
      partiallyAvailable: [],
      fullyBooked: [],
    };

    const today = new Date();
    const viewStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
    // Calculate end date for 2 full months ahead (e.g., if today is Jan, show Jan, Feb, Mar)
    const viewEndDate = new Date(today.getFullYear(), today.getMonth() + 3, 0);


    if (totalRooms === 0) return modifiers;

    eachDayOfInterval({ start: viewStartDate, end: viewEndDate }).forEach(day => {
      let bookedRoomsCount = 0;
      rooms.forEach(room => {
        const isRoomBookedOnDay = reservations.some(booking =>
          booking.roomId === room.id &&
          day >= booking.checkIn && // Use checkIn
          day < booking.checkOut   // Use checkOut (exclusive)
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
  }, [rooms, reservations, totalRooms]);

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-card">
      <Calendar
        mode="multiple"
        selected={[]}
        modifiers={dailyAvailabilityModifiers}
        modifiersClassNames={{
          fullyAvailable: 'day-fully-available',
          partiallyAvailable: 'day-partially-available',
          fullyBooked: 'day-fully-booked',
        }}
        numberOfMonths={2} // Display 2 months
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
