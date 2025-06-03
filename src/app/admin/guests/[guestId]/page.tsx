
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { guests as allGuests, bookings as allBookings, rooms as allRooms } from '@/lib/data';
import type { Guest, Booking, Room } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, UserCircle2, Briefcase, Star, Info, CalendarDays, BedDouble, DollarSign, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format, differenceInCalendarDays } from 'date-fns';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";


async function getGuestById(id: string): Promise<Guest | undefined> {
  return allGuests.find(g => g.id === id);
}

async function getBookingsByGuestId(guestId: string): Promise<Booking[]> {
  return allBookings.filter(b => b.guestId === guestId);
}

function getRoomById(roomId: string): Room | undefined {
  return allRooms.find(r => r.id === roomId);
}

function calculateBookingPrice(booking: Booking): number {
  const room = getRoomById(booking.roomId);
  if (!room) return 0;
  const nights = differenceInCalendarDays(booking.endDate, booking.startDate);
  return nights > 0 ? nights * room.pricePerNight : 0;
}


export default async function GuestProfilePage({ params }: { params: { guestId: string } }) {
  const guest = await getGuestById(params.guestId);

  if (!guest) {
    notFound();
  }

  const guestBookings = await getBookingsByGuestId(guest.id);

  return (
    <div className="space-y-8">
       <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/guests">Guests</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{guest.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="text-center">
        <UserCircle2 className="w-24 h-24 text-primary mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-2">
          {guest.name}
        </h1>
        <p className="text-lg text-muted-foreground">Guest Profile</p>
      </section>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-headline flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" /> Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{guest.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{guest.phone || 'N/A'}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-headline flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" /> Loyalty & Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold mb-1">Loyalty Status:</h4>
                {guest.loyaltyStatus ? (
                  <Badge variant={guest.loyaltyStatus === 'Platinum' ? 'default' : guest.loyaltyStatus === 'Gold' ? 'secondary' : 'outline'} className="capitalize">
                    {guest.loyaltyStatus}
                  </Badge>
                ) : (
                  <p className="text-sm text-muted-foreground">Not Enrolled</p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Preferences:</h4>
                {guest.preferences && guest.preferences.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {guest.preferences.map(pref => <li key={pref}>{pref}</li>)}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No preferences noted.</p>
                )}
              </div>
               <div>
                <h4 className="text-sm font-semibold mb-1">Notes:</h4>
                <p className="text-sm text-muted-foreground italic">
                  {guest.notes || 'No additional notes.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-headline flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" /> Booking History
              </CardTitle>
              <CardDescription>
                {guestBookings.length > 0 ? `This guest has ${guestBookings.length} booking(s).` : 'This guest has no booking history.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {guestBookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Check-in</TableHead>
                        <TableHead>Check-out</TableHead>
                        <TableHead>Total Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {guestBookings.map((booking) => {
                        const room = getRoomById(booking.roomId);
                        const totalPrice = calculateBookingPrice(booking);
                        return (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium text-xs">
                              <Link href={`/admin/bookings?message=Booking+ID%3A+${booking.id}&status=info`} className="hover:underline text-primary">
                                {booking.id.substring(0, 15)}...
                              </Link>
                            </TableCell>
                            <TableCell>
                               {room ? (
                                <Link href={`/rooms/${room.id}`} className="hover:underline">
                                  <div className="flex items-center gap-1">
                                    <BedDouble className="w-4 h-4 text-muted-foreground"/> {room.name}
                                  </div>
                                </Link>
                              ) : 'Unknown Room'}
                            </TableCell>
                            <TableCell>{format(booking.startDate, 'PP')}</TableCell>
                            <TableCell>{format(booking.endDate, 'PP')}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1 text-muted-foreground" />
                                {totalPrice.toFixed(2)}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No bookings to display for this guest.</p>
              )}
            </CardContent>
            <CardFooter>
                <Button variant="outline" disabled>
                    <FileText className="w-4 h-4 mr-2" /> Generate Guest Folio (Coming Soon)
                </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
