
import Image from 'next/image';
import Link from 'next/link';
import type { Room as PrismaRoom } from '@prisma/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BedDouble, Users, DollarSign, ArrowRight, Tag, Hash } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

// Adapting Room type for the component, ensuring price is a number
interface Room extends Omit<PrismaRoom, 'price' | 'createdAt' | 'updatedAt' | 'id'> {
  id: number; // Prisma IDs are numbers
  price: number; // Ensure price is number
  // Add other fields if you extend Prisma model in the future e.g. photos
}

interface RoomCardProps {
  room: Room;
  selectedDateRange?: DateRange;
}

export default function RoomCard({ room, selectedDateRange }: RoomCardProps) {
  let roomDetailUrl = `/rooms/${room.id}`;
  if (selectedDateRange?.from && selectedDateRange?.to) {
    roomDetailUrl += `?from=${selectedDateRange.from.toISOString()}&to=${selectedDateRange.to.toISOString()}`;
  }

  // The Prisma schema for Room is simpler: id, number, type, status, price
  // Fields like description, photos, beds, capacity, amenities, size are not in the basic schema.
  // We'll use what's available or placeholders.

  return (
    <Card className="flex flex-col overflow-hidden h-full transition-all duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative w-full h-48 bg-muted">
          {/* Placeholder as 'photos' is not in the new Room schema */}
          <Image
            src="https://placehold.co/600x400.png" 
            alt={`Image of ${room.type}`}
            layout="fill"
            objectFit="cover"
            data-ai-hint="hotel room placeholder"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-xl font-headline mb-2">{room.type}</CardTitle>
        {/* 'description' is not in the new Room schema. Display room number and status. */}
        <CardDescription className="text-sm text-muted-foreground mb-4 line-clamp-3">
          Room Number: {room.number} <br />
          Status: {room.status}
        </CardDescription>
        <div className="space-y-2 text-sm">
          {/* 'beds' and 'capacity' are not in the new Room schema. These are examples if added later */}
          {/* 
          <div className="flex items-center gap-2">
            <BedDouble className="w-4 h-4 text-primary" />
            <span>Beds: Placeholder</span> {}
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span>Capacity: Placeholder</span> {}
          </div>
          */}
           <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary" />
            <span>Type: {room.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-primary" />
            <span>Number: {room.number}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="font-semibold text-base">${room.price.toFixed(2)} / night</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button variant="outline" className="w-full group" asChild>
          <Link href={roomDetailUrl}>
            View Details <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
