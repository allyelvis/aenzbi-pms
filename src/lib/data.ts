import type { Room, Booking } from '@/types';
import { addDays, subDays } from 'date-fns';

export const rooms: Room[] = [
  {
    id: 'deluxe-king',
    name: 'Deluxe King Suite',
    description: 'Spacious suite with a king-size bed and city views.',
    longDescription: 'Indulge in our Deluxe King Suite, offering unparalleled comfort and breathtaking city views. This spacious suite features a plush king-size bed, a separate living area, and a modern bathroom with premium toiletries. Perfect for a luxurious getaway or a productive business trip.',
    photos: ['https://placehold.co/600x400.png?text=Deluxe+King+Suite', 'https://placehold.co/600x400.png?text=Suite+View'],
    pricePerNight: 250,
    beds: '1 King Bed',
    capacity: 2,
    amenities: ['Free WiFi', 'Air Conditioning', 'Mini Bar', 'HD TV', 'Work Desk', 'Rain Shower'],
    size: '45 sqm',
  },
  {
    id: 'family-room',
    name: 'Family Connection Room',
    description: 'Two connecting rooms ideal for families or groups.',
    longDescription: 'Our Family Connection Room provides the perfect space for families or small groups. It consists of two interconnecting rooms, one with a queen bed and another with twin beds, ensuring privacy and comfort for everyone. Enjoy ample space, multiple TVs, and thoughtful amenities.',
    photos: ['https://placehold.co/600x400.png?text=Family+Room', 'https://placehold.co/600x400.png?text=Twin+Beds'],
    pricePerNight: 320,
    beds: '1 Queen Bed, 2 Twin Beds',
    capacity: 4,
    amenities: ['Free WiFi', 'Air Conditioning', '2 HD TVs', 'Coffee Maker', 'Adjoining Rooms'],
    size: '60 sqm',
  },
  {
    id: 'standard-queen',
    name: 'Standard Queen Room',
    description: 'Comfortable room with a queen-size bed.',
    longDescription: 'The Standard Queen Room offers a cozy and comfortable retreat for solo travelers or couples. Featuring a comfortable queen-size bed, a functional work area, and all essential amenities, it’s designed for a restful and convenient stay.',
    photos: ['https://placehold.co/600x400.png?text=Standard+Queen'],
    pricePerNight: 150,
    beds: '1 Queen Bed',
    capacity: 2,
    amenities: ['Free WiFi', 'Air Conditioning', 'HD TV', 'Hair Dryer'],
    size: '25 sqm',
  },
  {
    id: 'executive-studio',
    name: 'Executive Studio',
    description: 'Modern studio with enhanced amenities for business travelers.',
    longDescription: 'Designed for the discerning business traveler, our Executive Studio combines style and functionality. It features a comfortable bed, a dedicated workspace, high-speed internet, and access to executive lounge benefits. Enjoy a productive and relaxing stay.',
    photos: ['https://placehold.co/600x400.png?text=Executive+Studio'],
    pricePerNight: 200,
    beds: '1 Queen Bed or 2 Twin Beds',
    capacity: 2,
    amenities: ['High-Speed WiFi', 'Air Conditioning', 'Smart TV', 'Nespresso Machine', 'Ergonomic Chair'],
    size: '35 sqm',
  },
];

const today = new Date();
export const bookings: Booking[] = [
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
    startDate: addDays(today, 1), // Overlaps with Charlie
    endDate: addDays(today, 3),
    guestName: 'Fiona Gallagher',
  },
];
