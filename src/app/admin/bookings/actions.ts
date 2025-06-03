
'use server';

import { removeBooking } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const CancelBookingSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required."),
});

// This action does not use useFormState, so it doesn't return a state object.
// It redirects with query parameters for feedback.
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

  const { bookingId } = validatedFields.data;

  try {
    const success = removeBooking(bookingId);
    if (success) {
      revalidatePath('/admin/bookings');
      redirectUrl += `?message=Booking+${encodeURIComponent(bookingId)}+cancelled+successfully.&status=success`;
    } else {
      redirectUrl += `?message=Failed+to+cancel+booking+${encodeURIComponent(bookingId)}.+Booking+not+found.&status=error`;
    }
  } catch (error) {
    console.error("Cancellation failed:", error);
    redirectUrl += `?message=An+unexpected+error+occurred+during+cancellation.&status=error`;
  }
  redirect(redirectUrl);
}
