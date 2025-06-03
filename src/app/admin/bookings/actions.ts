
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const CancelBookingSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required.").refine(val => !isNaN(parseInt(val, 10)), { message: "Booking ID must be a number." }),
});

export async function cancelBookingAction(formData: FormData): Promise<void> {
  const validatedFields = CancelBookingSchema.safeParse({
    bookingId: formData.get('bookingId'),
  });

  let redirectUrl = '/admin/bookings';

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.flatten().fieldErrors.bookingId?.join(', ') || "Invalid input.";
    console.error("Validation failed:", errorMessages);
    redirectUrl += `?message=${encodeURIComponent(errorMessages)}&status=error`;
    redirect(redirectUrl);
  }

  const bookingId = parseInt(validatedFields.data.bookingId, 10);

  try {
    // Check if booking exists before attempting to delete
    const bookingExists = await prisma.reservation.findUnique({
      where: { id: bookingId },
    });

    if (!bookingExists) {
      redirectUrl += `?message=Failed+to+cancel+booking.+Booking+ID+${encodeURIComponent(bookingId)}+not+found.&status=error`;
      redirect(redirectUrl);
    }

    await prisma.reservation.delete({
      where: { id: bookingId },
    });
    revalidatePath('/admin/bookings');
    redirectUrl += `?message=Booking+${encodeURIComponent(bookingId)}+cancelled+successfully.&status=success`;
  } catch (error) {
    console.error("Cancellation failed:", error);
    redirectUrl += `?message=An+unexpected+error+occurred+during+cancellation.&status=error`;
  }
  redirect(redirectUrl);
}
