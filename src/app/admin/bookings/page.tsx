
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { cancelBookingAction } from './actions';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, DollarSign, UserCircle2 } from 'lucide-react';
import { format, differenceInCalendarDays } from 'date-fns';
import type { Reservation, Guest, Room } from '@prisma/client';

// Type for reservations with included guest and room, ensuring price is number
interface PopulatedReservation extends Omit<Reservation, 'roomId' | 'guestId'> {
  guest: Guest;
  room: Omit<Room, 'price'> & { price: number };
}


export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams?: { message?: string; status?: string };
}) {
  let currentBookings: PopulatedReservation[] = [];
  let fetchError: string | null = null;

  try {
    const reservationsFromDb = await prisma.reservation.findMany({
      include: {
        guest: true,
        room: true,
      },
      orderBy: {
        checkIn: 'asc',
      }
    });
    // Process to ensure room.price is a number
    currentBookings = reservationsFromDb.map(res => ({
      ...res,
      room: {
        ...res.room,
        price: Number(res.room.price),
      },
    }));
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    fetchError = "Could not load booking data. Please try again later.";
  }

  const calculateTotalPrice = (booking: PopulatedReservation): number => {
    if (!booking || !booking.room) return 0;

    const nights = differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn));
    return nights > 0 ? nights * booking.room.price : 0;
  };

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">
          Manage Bookings
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          View and manage all current bookings in the system.
        </p>
      </section>

      {searchParams?.message && (
        <Alert
          variant={searchParams.status === 'success' ? 'default' : 'destructive'}
          className="my-6 max-w-2xl mx-auto"
        >
          {searchParams.status === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <AlertTitle>{searchParams.status === 'success' ? 'Success!' : 'Error'}</AlertTitle>
          <AlertDescription>{decodeURIComponent(searchParams.message)}</AlertDescription>
        </Alert>
      )}
      
      {fetchError && (
         <Alert variant="destructive" className="my-6 max-w-2xl mx-auto">
           <AlertCircle className="h-5 w-5" />
           <AlertTitle>Error Fetching Data</AlertTitle>
           <AlertDescription>{fetchError}</AlertDescription>
         </Alert>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Current Bookings</CardTitle>
          <CardDescription>
            {currentBookings.length > 0
              ? `A total of ${currentBookings.length} booking(s) found.`
              : "There are no current bookings in the system."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!fetchError && currentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {booking.guest ? (
                          <Link href={`/admin/guests/${booking.guest.id}`} className="hover:underline text-primary flex items-center gap-1">
                            <UserCircle2 className="w-4 h-4" /> {`${booking.guest.firstName} ${booking.guest.lastName}`}
                          </Link>
                        ) : 'Unknown Guest'}
                      </TableCell>
                      <TableCell>{booking.guest?.email || 'N/A'}</TableCell>
                      <TableCell>{booking.room ? `${booking.room.type} - ${booking.room.number}` : 'Unknown Room'}</TableCell>
                      <TableCell>{format(new Date(booking.checkIn), 'PP')}</TableCell>
                      <TableCell>{format(new Date(booking.checkOut), 'PP')}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                           <DollarSign className="w-4 h-4 mr-1 text-muted-foreground" />
                           {calculateTotalPrice(booking).toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <form action={cancelBookingAction}>
                          <input type="hidden" name="bookingId" value={booking.id.toString()} />
                          <Button type="submit" variant="destructive" size="sm">
                            Cancel Booking
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            !fetchError && <p className="text-muted-foreground text-center py-4">No bookings to display.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
