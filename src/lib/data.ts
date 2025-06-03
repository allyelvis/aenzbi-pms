
import type { Room, Booking } from '@/types';
import { addDays, subDays, parseISO } from 'date-fns';

export const rooms: Room[] = [
  {
    id: 'deluxe-king',
    name: 'Deluxe King Suite',
    description: 'Spacious suite with a king-size bed and city views.',
    longDescription: 'Indulge in our Deluxe King Suite, offering unparalleled comfort and breathtaking city views. This spacious suite features a plush king-size bed, a separate living area, and a modern bathroom with premium toiletries. Perfect for a luxurious getaway or a productive business trip.',
    photos: ['https://placehold.co/800x600.png', 'https://placehold.co/600x400/AAB8C2/FFFFFF.png', 'https://placehold.co/600x400/CCD1D9/FFFFFF.png'],
    pricePerNight: 250,
    beds: '1 King Bed',
    capacity: 2,
    amenities: ['Free WiFi', 'Air Conditioning', 'Mini Bar', 'HD TV', 'Work Desk', 'Rain Shower', 'City View', 'Separate Living Area'],
    size: '45 sqm',
  },
  {
    id: 'family-room',
    name: 'Family Connection Room',
    description: 'Two connecting rooms ideal for families or groups.',
    longDescription: 'Our Family Connection Room provides the perfect space for families or small groups. It consists of two interconnecting rooms, one with a queen bed and another with twin beds, ensuring privacy and comfort for everyone. Enjoy ample space, multiple TVs, and thoughtful amenities designed for a memorable family stay.',
    photos: ['https://placehold.co/800x600.png', 'https://placehold.co/600x400/AAB8C2/FFFFFF.png'],
    pricePerNight: 320,
    beds: '1 Queen Bed, 2 Twin Beds',
    capacity: 4,
    amenities: ['Free WiFi', 'Air Conditioning', '2 HD TVs', 'Coffee Maker', 'Adjoining Rooms', 'Kids Welcome Pack'],
    size: '60 sqm',
  },
  {
    id: 'standard-queen',
    name: 'Standard Queen Room',
    description: 'Comfortable room with a queen-size bed.',
    longDescription: 'The Standard Queen Room offers a cozy and comfortable retreat for solo travelers or couples. Featuring a comfortable queen-size bed, a functional work area, and all essential amenities, it’s designed for a restful and convenient stay. Enjoy modern decor and a tranquil ambiance.',
    photos: ['https://placehold.co/800x600.png'],
    pricePerNight: 150,
    beds: '1 Queen Bed',
    capacity: 2,
    amenities: ['Free WiFi', 'Air Conditioning', 'HD TV', 'Hair Dryer', 'Desk'],
    size: '25 sqm',
  },
  {
    id: 'executive-studio',
    name: 'Executive Studio',
    description: 'Modern studio with enhanced amenities for business travelers.',
    longDescription: 'Designed for the discerning business traveler, our Executive Studio combines style and functionality. It features a comfortable bed, a dedicated workspace with an ergonomic chair, high-speed internet, and access to exclusive executive lounge benefits (subject to availability). Enjoy a productive and relaxing stay with premium coffee and tea facilities.',
    photos: ['https://placehold.co/800x600.png', 'https://placehold.co/600x400/AAB8C2/FFFFFF.png'],
    pricePerNight: 200,
    beds: '1 Queen Bed or 2 Twin Beds',
    capacity: 2,
    amenities: ['High-Speed WiFi', 'Air Conditioning', 'Smart TV', 'Nespresso Machine', 'Ergonomic Chair', 'Executive Lounge Access'],
    size: '35 sqm',
  },
];

const today = new Date();
// Ensure existing bookings use Date objects or are parsed correctly if they were strings
export let bookings: Booking[] = [
  {
    id: 'booking1',
    roomId: 'deluxe-king',
    startDate: subDays(today, 5),
    endDate: subDays(today, 2),
    guestName: 'Alice Wonderland',
  },
  {
    id: 'booking2',
    roomId: 'family-room',
    startDate: today,
    endDate: addDays(today, 3),
    guestName: 'Bob The Builder',
  },
  {
    id: 'booking3',
    roomId: 'standard-queen',
    startDate: addDays(today, 1),
    endDate: addDays(today, 4),
    guestName: 'Charlie Brown',
  },
  {
    id: 'booking4',
    roomId: 'deluxe-king',
    startDate: addDays(today, 7),
    endDate: addDays(today, 10),
    guestName: 'Diana Prince',
  },
  {
    id: 'booking5',
    roomId: 'executive-studio',
    startDate: addDays(today, 2),
    endDate: addDays(today, 5),
    guestName: 'Edward Elric',
  },
   {
    id: 'booking6',
    roomId: 'deluxe-king',
    startDate: addDays(today, 1), 
    endDate: addDays(today, 3),
    guestName: 'Fiona Gallagher',
  },
].map(booking => ({
    ...booking,
    startDate: typeof booking.startDate === 'string' ? parseISO(booking.startDate) : booking.startDate,
    endDate: typeof booking.endDate === 'string' ? parseISO(booking.endDate) : booking.endDate,
}));


// Function to add a new booking
// Expects string dates for easier passing from forms/server actions
export function addBooking(newBookingData: { 
  roomId: string; 
  startDate: string; 
  endDate: string; 
  guestName: string;
  // Add other fields like email if your form collects them
  guestEmail?: string; 
}): Booking {
  const newBooking: Booking = {
    ...newBookingData,
    id: `booking${bookings.length + 1}_${Date.now()}`, // Simple unique ID
    startDate: parseISO(newBookingData.startDate), // Convert string to Date
    endDate: parseISO(newBookingData.endDate),     // Convert string to Date
  };
  bookings.push(newBooking);
  // console.log('Booking added:', newBooking); // Good for server-side logging
  // console.log('All bookings now:', bookings.length);
  return newBooking;
}
