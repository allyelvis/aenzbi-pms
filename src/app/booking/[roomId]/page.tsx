
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { format, parseISO, isValid as isValidDate } from 'date-fns';

import type { Room } from '@/types';
import { rooms } from '@/lib/data'; // For fetching room details
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createBookingAction, type BookingFormState } from './actions';
import { CalendarDays, User, Mail, BedDouble, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Confirming Booking...' : 'Confirm Booking'}
    </Button>
  );
}

export default function BookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [room, setRoom] = useState<Room | null>(null);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const roomId = typeof params.roomId === 'string' ? params.roomId : '';
  const fromDateStr = searchParams.get('from');
  const toDateStr = searchParams.get('to');

  useEffect(() => {
    if (!roomId || !fromDateStr || !toDateStr) {
      setError("Missing booking information. Please select a room and dates.");
      // router.push('/'); // Optionally redirect
      return;
    }

    const foundRoom = rooms.find(r => r.id === roomId);
    if (!foundRoom) {
      setError("Room not found.");
      // router.push('/'); // Optionally redirect
      return;
    }
    setRoom(foundRoom);

    const parsedFrom = parseISO(fromDateStr);
    const parsedTo = parseISO(toDateStr);

    if (!isValidDate(parsedFrom) || !isValidDate(parsedTo) || parsedFrom >= parsedTo) {
      setError("Invalid date range selected.");
      // router.push('/'); // Optionally redirect
      return;
    }
    setFromDate(parsedFrom);
    setToDate(parsedTo);
    setError(null); // Clear previous errors

  }, [roomId, fromDateStr, toDateStr, router]);

  const initialState: BookingFormState = { message: null, errors: {}, success: false };
  const [formState, formAction] = useFormState(createBookingAction, initialState);
  
  useEffect(() => {
    if (formState?.success && formState.bookingDetails) {
      // Handle successful booking, e.g., show success message or redirect
      // For now, we show an alert. A redirect to a success page is common.
      // router.push(`/booking/success?bookingId=${formState.bookingDetails.id}`);
    }
  }, [formState, router]);


  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error} <Link href="/" className="underline">Return to homepage.</Link></AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!room || !fromDate || !toDate) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading booking details...</p>
      </div>
    );
  }
  
  if (formState?.success && formState.bookingDetails) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <Card className="w-full max-w-2xl text-center">
          <CardHeader>
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-3xl font-headline text-green-600">Booking Confirmed!</CardTitle>
            <CardDescription>Your reservation for {room.name} has been successfully made.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p><strong>Guest:</strong> {formState.bookingDetails.guestName}</p>
            <p><strong>Room:</strong> {room.name}</p>
            <p><strong>Check-in:</strong> {format(formState.bookingDetails.startDate, "LLL dd, yyyy")}</p>
            <p><strong>Check-out:</strong> {format(formState.bookingDetails.endDate, "LLL dd, yyyy")}</p>
            <p className="text-sm text-muted-foreground">A confirmation email has been sent to { (formState.bookingDetails as any).guestEmail || 'your email'}. (Email simulation)</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/">Return to Homepage</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-8 text-center">Confirm Your Booking</h1>
      
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">{room.name}</CardTitle>
            <div className="relative w-full h-64 rounded-md overflow-hidden mt-2">
              <Image
                src={room.photos[0]}
                alt={`Image of ${room.name}`}
                layout="fill"
                objectFit="cover"
                data-ai-hint="hotel room interior"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="w-5 h-5 text-primary" />
              <span>Dates: {format(fromDate, "LLL dd, yyyy")} - {format(toDate, "LLL dd, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <BedDouble className="w-5 h-5 text-primary" />
              <span>{room.beds}, for {room.capacity} guest(s)</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="font-semibold text-lg text-foreground">${room.pricePerNight} / night</span>
            </div>
            <p className="text-sm text-muted-foreground pt-2">{room.description}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-headline">Guest Information</CardTitle>
            <CardDescription>Please provide your details to complete the booking.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-6">
              <input type="hidden" name="roomId" value={roomId} />
              <input type="hidden" name="startDate" value={fromDate.toISOString()} />
              <input type="hidden" name="endDate" value={toDate.toISOString()} />

              <div className="space-y-2">
                <Label htmlFor="guestName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="guestName" name="guestName" placeholder="Enter your full name" required className="pl-10" />
                </div>
                {formState?.errors?.guestName && (
                  <p className="text-sm text-red-500">{formState.errors.guestName.join(', ')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestEmail">Email Address</Label>
                 <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="guestEmail" name="guestEmail" type="email" placeholder="Enter your email address" required className="pl-10" />
                </div>
                {formState?.errors?.guestEmail && (
                  <p className="text-sm text-red-500">{formState.errors.guestEmail.join(', ')}</p>
                )}
              </div>
              
              {formState?.message && !formState.success && (
                 <Alert variant="destructive">
                   <AlertCircle className="h-4 w-4" />
                   <AlertTitle>Booking Failed</AlertTitle>
                   <AlertDescription>{formState.message}</AlertDescription>
                 </Alert>
              )}
               {formState?.errors?.general && (
                 <Alert variant="destructive">
                   <AlertCircle className="h-4 w-4" />
                   <AlertTitle>Error</AlertTitle>
                   <AlertDescription>{formState.errors.general.join(', ')}</AlertDescription>
                 </Alert>
              )}


              <SubmitButton />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
