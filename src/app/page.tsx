
import prisma from '@/lib/prisma';
import type { Room, Reservation as PrismaReservation } from '@prisma/client'; // Prisma types
import DateRangeSearch from '@/components/DateRangeSearch';
import RoomCard from '@/components/RoomCard';
import type { DateRange } from 'react-day-picker';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Helper to convert Prisma's Decimal to number for price
const processRooms = (rooms: (Room & { reservations: PrismaReservation[] })[]) => {
  return rooms.map(room => ({
    ...room,
    price: Number(room.price), // Convert Decimal to number
    reservations: room.reservations.map(reservation => ({
      ...reservation,
      // Ensure dates are Date objects if they aren't already
      checkIn: new Date(reservation.checkIn),
      checkOut: new Date(reservation.checkOut),
    })),
  }));
};


export default async function HomePage({
  searchParams,
}: {
  searchParams?: { from?: string; to?: string };
}) {
  let dateRange: DateRange | undefined = undefined;
  if (searchParams?.from && searchParams?.to) {
    const fromDate = new Date(searchParams.from);
    const toDate = new Date(searchParams.to);
    if (!isNaN(fromDate.valueOf()) && !isNaN(toDate.valueOf()) && fromDate < toDate) {
      dateRange = { from: fromDate, to: toDate };
    }
  }

  let roomsToDisplay: (Room & { price: number; reservations: PrismaReservation[] })[] = [];
  let fetchError: string | null = null;

  try {
    const allRoomsFromDb = await prisma.room.findMany({
      include: {
        reservations: true, // Include reservations for availability checks
      },
    });
    const processedRooms = processRooms(allRoomsFromDb);


    if (dateRange?.from && dateRange?.to) {
      const checkIn = dateRange.from;
      const checkOut = dateRange.to;

      roomsToDisplay = processedRooms.filter(room => {
        const isRoomBookedForRange = room.reservations.some(booking => {
          // Ensure dates are proper Date objects for comparison
          const bookingCheckIn = new Date(booking.checkIn);
          const bookingCheckOut = new Date(booking.checkOut);
          return bookingCheckIn < checkOut && bookingCheckOut > checkIn;
        });
        return !isRoomBookedForRange;
      });
    } else {
      roomsToDisplay = processedRooms;
    }
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
    fetchError = "Could not load room data. Please try again later.";
    // roomsToDisplay will remain empty
  }


  const handleDateChange = async (selectedRange: DateRange | undefined) => {
    // This component is a Server Component, so client-side state updates for dateRange
    // need to trigger a navigation to update searchParams, which then re-renders the page.
    // For simplicity, DateRangeSearch might need to be adapted or this logic moved
    // to a client component that wraps DateRangeSearch and uses router.push.
    // For now, the search button in DateRangeSearch implies a full page reload/navigation.
  };


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
        {/* DateRangeSearch's onDateChange will likely need to use router.push to update searchParams */}
        <DateRangeSearch onDateChange={handleDateChange} initialDateRange={dateRange} />
      </section>
      
      {fetchError && (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      )}

      <section>
        <h2 className="text-3xl font-headline font-semibold mb-6 text-center">
          {dateRange?.from && dateRange?.to ? 'Available Rooms' : 'Our Rooms'}
        </h2>
        {roomsToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomsToDisplay.map(room => (
              // Ensure RoomCardProps matches the new Room type from Prisma
              <RoomCard key={room.id} room={room} selectedDateRange={dateRange} />
            ))}
          </div>
        ) : (
          !fetchError && (
            <p className="text-center text-muted-foreground py-10 text-lg">
              {dateRange?.from && dateRange?.to 
                ? "No rooms available for the selected dates. Please try a different date range."
                : "No rooms to display."
              }
            </p>
          )
        )}
      </section>
    </div>
  );
}
