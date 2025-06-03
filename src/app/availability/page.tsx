
import AvailabilityCalendarDisplay from '@/components/AvailabilityCalendarDisplay';
import prisma from '@/lib/prisma';
import type { Room, Reservation as PrismaReservation } from '@prisma/client';

// Helper to convert Prisma's Decimal to number for price and ensure dates are Date objects
const processDataForCalendar = (
  rooms: Room[], 
  reservations: PrismaReservation[]
) => {
  const processedRooms = rooms.map(room => ({
    ...room,
    price: Number(room.price), // Convert Decimal to number
  }));
  const processedReservations = reservations.map(res => ({
    ...res,
    checkIn: new Date(res.checkIn),
    checkOut: new Date(res.checkOut),
  }));
  return { rooms: processedRooms, reservations: processedReservations };
};

export default async function AvailabilityPage() {
  let currentRooms: (Room & { price: number })[] = [];
  let currentReservations: PrismaReservation[] = [];
  let fetchError: string | null = null;

  try {
    const roomsFromDb = await prisma.room.findMany();
    const reservationsFromDb = await prisma.reservation.findMany();
    const { rooms, reservations } = processDataForCalendar(roomsFromDb, reservationsFromDb);
    currentRooms = rooms;
    currentReservations = reservations;
  } catch (error) {
    console.error("Failed to fetch availability data:", error);
    fetchError = "Could not load availability data. Please try again later.";
  }

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">
          Property Availability Overview
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          View our room availability across the entire property. Dates are color-coded for your convenience.
        </p>
      </section>

      {fetchError && (
        <div className="my-4 p-4 bg-destructive/10 border border-destructive text-destructive rounded-md text-center">
          <p>{fetchError}</p>
        </div>
      )}

      <section>
        {!fetchError && (
          <AvailabilityCalendarDisplay 
            rooms={currentRooms} 
            reservations={currentReservations} 
          />
        )}
      </section>
    </div>
  );
}
