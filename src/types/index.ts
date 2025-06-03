
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
  status: RoomStatus; // Added status field
};

export type Booking = {
  id: string;
  roomId: string;
  startDate: Date;
  endDate: Date; 
  guestName: string;
  // guestEmail?: string; // Already present in booking action, ensure it's used consistently
};
