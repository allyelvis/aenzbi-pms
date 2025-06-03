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
};

export type Booking = {
  id: string;
  roomId: string;
  startDate: Date;
  endDate: Date; 
  guestName: string;
};
