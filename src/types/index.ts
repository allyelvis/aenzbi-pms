
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
  'Cleaning in Progress'
];

export type Room = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  photos: string[];
  pricePerNight: number;
  beds: string;
  capacity: number;
  amenities: string[];
  size: string;
  status: RoomStatus;
};

export type Guest = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  preferences?: string[]; // e.g., ["High floor", "Extra pillows"]
  loyaltyStatus?: string; // e.g., "Gold", "Platinum"
  notes?: string;
};

export type Booking = {
  id: string;
  roomId: string;
  guestId: string; // Changed from guestName and guestEmail
  startDate: Date;
  endDate: Date;
};

export type FoodBeverageOutlet = {
  id: string;
  name: string;
  description: string;
  cuisineType: string;
  operatingHours: string;
  imageUrl: string;
  menuHighlights?: string[];
  dressCode?: string;
  location: string;
};
