
import type { Room, Booking, RoomStatus, FoodBeverageOutlet, Guest } from '@/types';
import { addDays, subDays, parseISO } from 'date-fns';

export let rooms: Room[] = [
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
    status: 'Vacant Clean',
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
    status: 'Occupied',
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
    status: 'Vacant Dirty',
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
    status: 'Maintenance',
  },
];

const today = new Date();

export let guests: Guest[] = [
  { 
    id: 'guest1', 
    name: 'Alice Wonderland', 
    email: 'alice@example.com', 
    phone: '555-0101',
    preferences: ['High floor', 'Hypoallergenic pillows'],
    loyaltyStatus: 'Gold',
    notes: 'Celebrated anniversary here last year.'
  },
  { 
    id: 'guest2', 
    name: 'Bob The Builder', 
    email: 'bob@example.com', 
    phone: '555-0102',
    loyaltyStatus: 'Silver',
    preferences: ['Quiet room', 'Early check-in requested']
  },
  { 
    id: 'guest3', 
    name: 'Charlie Brown', 
    email: 'charlie@example.com', 
    phone: '555-0103',
    notes: 'First time guest.'
  },
  { 
    id: 'guest4', 
    name: 'Diana Prince', 
    email: 'diana@example.com',
    loyaltyStatus: 'Platinum',
    preferences: ['Ocean view if possible', 'Likes extra towels']
  },
  { 
    id: 'guest5', 
    name: 'Edward Elric', 
    email: 'edward@example.com',
    phone: '555-0105',
    preferences: ['Prefers firm mattress']
  },
  {
    id: 'guest6',
    name: 'Fiona Gallagher',
    email: 'fiona@example.com',
    loyaltyStatus: 'Silver',
    notes: 'Traveling with family.'
  }
];

export let bookings: Booking[] = [
  {
    id: 'booking1',
    roomId: 'deluxe-king',
    guestId: 'guest1',
    startDate: subDays(today, 5),
    endDate: subDays(today, 2),
  },
  {
    id: 'booking2',
    roomId: 'family-room',
    guestId: 'guest2',
    startDate: today,
    endDate: addDays(today, 3),
  },
  {
    id: 'booking3',
    roomId: 'standard-queen',
    guestId: 'guest3',
    startDate: addDays(today, 1),
    endDate: addDays(today, 4),
  },
  {
    id: 'booking4',
    roomId: 'deluxe-king',
    guestId: 'guest4',
    startDate: addDays(today, 7),
    endDate: addDays(today, 10),
  },
  {
    id: 'booking5',
    roomId: 'executive-studio',
    guestId: 'guest5',
    startDate: addDays(today, 2),
    endDate: addDays(today, 5),
  },
   {
    id: 'booking6',
    roomId: 'deluxe-king',
    guestId: 'guest6',
    startDate: addDays(today, 1),
    endDate: addDays(today, 3),
  },
].map(booking => ({
    ...booking,
    startDate: typeof booking.startDate === 'string' ? parseISO(booking.startDate) : booking.startDate,
    endDate: typeof booking.endDate === 'string' ? parseISO(booking.endDate) : booking.endDate,
}));


export function addBooking(newBookingData: {
  roomId: string;
  startDate: string;
  endDate: string;
  guestName: string;
  guestEmail: string;
}): Booking {
  let guest = guests.find(g => g.email.toLowerCase() === newBookingData.guestEmail.toLowerCase());
  let guestIdToUse: string;

  if (!guest) {
    guestIdToUse = `guest${guests.length + 1}_${Date.now()}`;
    const newGuest: Guest = {
      id: guestIdToUse,
      name: newBookingData.guestName,
      email: newBookingData.guestEmail,
      // preferences: [], // Initialize with empty preferences
      // loyaltyStatus: 'New', // Default loyalty status
    };
    guests.push(newGuest);
  } else {
    guestIdToUse = guest.id;
    // Optionally update guest name if it's different, though this might be better handled in a profile update flow
    if (guest.name !== newBookingData.guestName) {
      // console.log(`Guest email ${newBookingData.guestEmail} found, but name differs. Keeping original name: ${guest.name}`);
      // For simplicity, we're not updating guest details here, just using existing guest.
    }
  }

  const newBooking: Booking = {
    id: `booking${bookings.length + 1}_${Date.now()}`,
    roomId: newBookingData.roomId,
    guestId: guestIdToUse,
    startDate: parseISO(newBookingData.startDate),
    endDate: parseISO(newBookingData.endDate),
  };
  bookings.push(newBooking);
  return newBooking;
}

export function removeBooking(bookingId: string): boolean {
  const initialLength = bookings.length;
  bookings = bookings.filter(b => b.id !== bookingId);
  return bookings.length < initialLength;
}

export function updateRoomStatus(roomId: string, newStatus: RoomStatus): boolean {
  const roomIndex = rooms.findIndex(r => r.id === roomId);
  if (roomIndex === -1) {
    return false;
  }
  rooms[roomIndex].status = newStatus;
  return true;
}

export const foodBeverageOutlets: FoodBeverageOutlet[] = [
  {
    id: 'the-grand-dining',
    name: 'The Grand Dining Room',
    description: 'Experience exquisite fine dining with a menu curated by our award-winning chef. Perfect for special occasions and elegant evenings.',
    cuisineType: 'International Fine Dining',
    operatingHours: 'Daily: 6:00 PM - 10:00 PM (Dinner)',
    imageUrl: 'https://placehold.co/600x400.png',
    menuHighlights: ['Pan-Seared Scallops', 'Wagyu Beef Tenderloin', 'Chocolate Lava Cake'],
    dressCode: 'Smart Elegant',
    location: 'Lobby Level, Main Wing',
  },
  {
    id: 'rooftop-lounge',
    name: 'Azure Rooftop Lounge',
    description: 'Enjoy panoramic city views with signature cocktails and gourmet tapas. Live DJ sets on weekends.',
    cuisineType: 'Cocktails & Tapas',
    operatingHours: 'Mon-Thu: 5:00 PM - 12:00 AM, Fri-Sun: 3:00 PM - 2:00 AM',
    imageUrl: 'https://placehold.co/600x400.png',
    menuHighlights: ['Spicy Tuna Crispy Rice', 'Artisanal Cheese Platter', 'Aenzbi Signature Martini'],
    dressCode: 'Chic Casual',
    location: 'Rooftop, 30th Floor',
  },
  {
    id: 'garden-cafe',
    name: 'The Garden Café',
    description: 'A relaxed, all-day dining venue offering international buffets and à la carte options in a lush garden setting.',
    cuisineType: 'All-Day Dining (Buffet & À la carte)',
    operatingHours: 'Daily: 6:30 AM - 11:00 PM',
    imageUrl: 'https://placehold.co/600x400.png',
    menuHighlights: ['Breakfast Buffet Extravaganza', 'Gourmet Burgers', 'Freshly Baked Pastries'],
    dressCode: 'Casual',
    location: 'Ground Floor, overlooking the gardens',
  },
  {
    id: 'poolside-grill',
    name: 'Oasis Poolside Grill',
    description: 'Light snacks, refreshing beverages, and grilled specialties served by the poolside. Perfect for a sunny afternoon.',
    cuisineType: 'Grill & Light Bites',
    operatingHours: 'Daily: 10:00 AM - 7:00 PM (Weather permitting)',
    imageUrl: 'https://placehold.co/600x400.png',
    menuHighlights: ['Grilled Salmon Salad', 'Club Sandwich', 'Fresh Fruit Smoothies'],
    dressCode: 'Swimwear/Casual',
    location: 'Pool Deck',
  }
];
