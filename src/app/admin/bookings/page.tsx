
import Link from 'next/link';
import { rooms, bookings, guests } from '@/lib/data';
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
import type { Guest } from '@/types';

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams?: { message?: string; status?: string };
}) {
  const currentBookings = bookings;
  const currentRooms = rooms;
  const allGuests = guests;

  const getRoomName = (roomId: string) => {
    return currentRooms.find(r => r.id === roomId)?.name || 'Unknown Room';
  };

  const getGuestDetails = (guestId: string): Guest | undefined => {
    return allGuests.find(g => g.id === guestId);
  };

  const calculateTotalPrice = (bookingId: string): number => {
    const booking = currentBookings.find(b => b.id === bookingId);
    if (!booking) return 0;

    const room = currentRooms.find(r => r.id === booking.roomId);
    if (!room) return 0;

    const nights = differenceInCalendarDays(booking.endDate, booking.startDate);
    return nights > 0 ? nights * room.pricePerNight : 0;
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
          {currentBookings.length > 0 ? (
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
                  {currentBookings.map((booking) => {
                    const guest = getGuestDetails(booking.guestId);
                    return (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                          {guest ? (
                            <Link href={`/admin/guests/${guest.id}`} className="hover:underline text-primary flex items-center gap-1">
                              <UserCircle2 className="w-4 h-4" /> {guest.name}
                            </Link>
                          ) : 'Unknown Guest'}
                        </TableCell>
                        <TableCell>{guest?.email || 'N/A'}</TableCell>
                        <TableCell>{getRoomName(booking.roomId)}</TableCell>
                        <TableCell>{format(booking.startDate, 'PP')}</TableCell>
                        <TableCell>{format(booking.endDate, 'PP')}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                             <DollarSign className="w-4 h-4 mr-1 text-muted-foreground" />
                             {calculateTotalPrice(booking.id).toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <form action={cancelBookingAction}>
                            <input type="hidden" name="bookingId" value={booking.id} />
                            <Button type="submit" variant="destructive" size="sm">
                              Cancel Booking
                            </Button>
                          </form>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No bookings to display.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
