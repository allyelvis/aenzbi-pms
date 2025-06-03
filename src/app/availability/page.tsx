import AvailabilityCalendarDisplay from '@/components/AvailabilityCalendarDisplay';
import { rooms, bookings } from '@/lib/data'; // Assuming direct import for server component

export default async function AvailabilityPage() {
  // In a real app, fetch this data
  const currentRooms = rooms;
  const currentBookings = bookings;

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

      <section>
        <AvailabilityCalendarDisplay rooms={currentRooms} bookings={currentBookings} />
      </section>
    </div>
  );
}
