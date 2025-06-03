
// Base Prisma types are imported from '@prisma/client'
// We can extend them or create specific types for frontend use if needed.

export type { Guest, Room, Reservation, FoodBeverageOutlet } from '@prisma/client';

export type RoomStatus =
  | 'Vacant Clean'
  | 'Vacant Dirty'
  | 'Occupied'
  | 'Maintenance'
  | 'Cleaning in Progress';

export const ROOM_STATUSES: RoomStatus[] = [
  'Vacant Clean',
  'Vacant Dirty',
  'Occupied',
  'Maintenance',
  'Cleaning in Progress',
];

// Ensure that the 'status' field in Prisma models (Room, Reservation)
// uses these string values for consistency if you implement status logic.
