"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { DateRange } from 'react-day-picker';
import { isWithinInterval, parseISO } from 'date-fns'; // Import parseISO if dates are strings

import DateRangeSearch from '@/components/DateRangeSearch';
import RoomCard from '@/components/RoomCard';
import type { Room, Booking } from '@/types';
import { rooms as allRoomsData, bookings as allBookingsData } from '@/lib/data'; // Static import

// Helper to parse booking dates if they are not already Date objects
const parseBookings = (bookings: Booking[]): Booking[] => 
  bookings.map(booking => ({
    ...booking,
    startDate: typeof booking.startDate === 'string' ? parseISO(booking.startDate) : booking.startDate,
    endDate: typeof booking.endDate === 'string' ? parseISO(booking.endDate) : booking.endDate,
  }));


export default function HomePage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  // Memoize parsed data to avoid reprocessing on every render
  const allRooms = useMemo(() => allRoomsData, []);
  const allBookings = useMemo(() => parseBookings(allBookingsData), []);

  const [filteredRooms, setFilteredRooms] = useState<Room[]>(allRooms);

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      const checkIn = dateRange.from;
      const checkOut = dateRange.to;

      const availableRooms = allRooms.filter(room => {
        const roomBookings = allBookings.filter(booking => booking.roomId === room.id);
        const isRoomBookedForRange = roomBookings.some(booking => {
          // Check for overlap: booking.startDate < checkOut && booking.endDate > checkIn
          return booking.startDate < checkOut && booking.endDate > checkIn;
        });
        return !isRoomBookedForRange;
      });
      setFilteredRooms(availableRooms);
    } else {
      // If no date range or incomplete range, show all rooms
      setFilteredRooms(allRooms);
    }
  }, [dateRange, allRooms, allBookings]);

  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-gradient-to-r from-primary to-accent rounded-lg shadow-xl">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary-foreground mb-4">
          Find Your Perfect Stay
        </h1>
        <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
          Discover our exquisite rooms and book your next getaway with Aenzbi PMS.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-headline font-semibold mb-4">Search by Dates</h2>
        <DateRangeSearch onDateChange={setDateRange} />
      </section>

      <section>
        <h2 className="text-3xl font-headline font-semibold mb-6 text-center">
          {dateRange?.from && dateRange?.to ? 'Available Rooms' : 'Our Rooms'}
        </h2>
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-10 text-lg">
            No rooms available for the selected dates. Please try a different date range.
          </p>
        )}
      </section>
    </div>
  );
}
