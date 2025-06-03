
'use server';

import { updateRoomStatus, rooms as allRooms } from '@/lib/data';
import { ROOM_STATUSES, type RoomStatus } from '@/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const UpdateRoomStatusSchema = z.object({
  roomId: z.string().min(1, "Room ID is required."),
  newStatus: z.string().refine(
    (status) => ROOM_STATUSES.includes(status as RoomStatus), 
    { message: "Invalid room status." }
  ),
});

export async function updateRoomStatusAction(formData: FormData): Promise<void> {
  const validatedFields = UpdateRoomStatusSchema.safeParse({
    roomId: formData.get('roomId'),
    newStatus: formData.get('newStatus'),
  });

  let redirectUrl = '/admin/room-status';

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.flatten().fieldErrors;
    const combinedError = Object.values(errorMessages).flat().join(' ') || "Invalid input.";
    console.error("Validation failed:", combinedError);
    redirectUrl += `?message=${encodeURIComponent(combinedError)}&status=error`;
    redirect(redirectUrl);
  }

  const { roomId, newStatus } = validatedFields.data;

  // Additional check: Ensure room exists
  const roomExists = allRooms.some(r => r.id === roomId);
  if (!roomExists) {
    redirectUrl += `?message=${encodeURIComponent(`Room with ID ${roomId} not found.`)}&status=error`;
    redirect(redirectUrl);
  }

  try {
    const success = updateRoomStatus(roomId, newStatus as RoomStatus);
    if (success) {
      revalidatePath('/admin/room-status');
      redirectUrl += `?message=Room+${encodeURIComponent(roomId)}+status+updated+to+${encodeURIComponent(newStatus)}.&status=success`;
    } else {
      // This case might be redundant if roomExists check is thorough, but good for safety.
      redirectUrl += `?message=Failed+to+update+status+for+room+${encodeURIComponent(roomId)}.&status=error`;
    }
  } catch (error) {
    console.error("Status update failed:", error);
    redirectUrl += `?message=An+unexpected+error+occurred+during+status+update.&status=error`;
  }
  redirect(redirectUrl);
}
