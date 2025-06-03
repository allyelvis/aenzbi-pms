
'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { addBooking, rooms } from '@/lib/data';
import type { Booking } from '@/types';
import { parseISO, isValid } from 'date-fns';

const BookingFormSchema = z.object({
  roomId: z.string().min(1, "Room ID is required."),
  startDate: z.string().refine((date) => isValid(parseISO(date)), { message: "Invalid start date." }),
  endDate: z.string().refine((date) => isValid(parseISO(date)), { message: "Invalid end date." }),
  guestName: z.string().min(2, "Guest name must be at least 2 characters."),
  guestEmail: z.string().email("Invalid email address."),
});

export type BookingFormState = {
  message?: string | null;
  errors?: {
    roomId?: string[];
    startDate?: string[];
    endDate?: string[];
    guestName?: string[];
    guestEmail?: string[];
    general?: string[];
  };
  success?: boolean;
  bookingDetails?: Booking | null; // Booking type now includes guestId
};

export async function createBookingAction(
  prevState: BookingFormState | undefined,
  formData: FormData
): Promise<BookingFormState> {
  const validatedFields = BookingFormSchema.safeParse({
    roomId: formData.get('roomId'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    guestName: formData.get('guestName'),
    guestEmail: formData.get('guestEmail'),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your inputs.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { roomId, startDate, endDate, guestName, guestEmail } = validatedFields.data;

  const roomExists = rooms.some(r => r.id === roomId);
  if (!roomExists) {
    return {
      message: "Invalid Room ID.",
      errors: { roomId: ["Selected room does not exist."] },
      success: false,
    };
  }
  
  if (parseISO(startDate) >= parseISO(endDate)) {
    return {
      message: "Start date must be before end date.",
      errors: { startDate: ["Start date must be before end date."], endDate: ["End date must be after start date."] },
      success: false,
    };
  }

  try {
    // addBooking now handles guest creation/linking and returns a Booking object with guestId
    const newBooking = addBooking({
      roomId,
      startDate,
      endDate,
      guestName,
      guestEmail,
    });
    
     return {
      message: "Booking successful!",
      success: true,
      bookingDetails: newBooking, // This Booking object contains guestId
    };

  } catch (error) {
    console.error("Booking creation failed:", error);
    return {
      message: "An unexpected error occurred while creating the booking. Please try again.",
      errors: { general: ["Booking creation failed."] },
      success: false,
    };
  }
}
