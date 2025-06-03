import Image from 'next/image';
import type { Room } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BedDouble, Users, DollarSign, ArrowRight } from 'lucide-react';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden h-full transition-all duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={room.photos[0]}
            alt={`Image of ${room.name}`}
            layout="fill"
            objectFit="cover"
            data-ai-hint="hotel room interior"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-xl font-headline mb-2">{room.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-4 line-clamp-3">{room.description}</CardDescription>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <BedDouble className="w-4 h-4 text-primary" />
            <span>{room.beds}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span>Capacity: {room.capacity} guests</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="font-semibold text-base">${room.pricePerNight} / night</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        {/* Future: Link to a room details page or open a modal */}
        {/* For now, this button is illustrative. Search is on the page level. */}
        <Button variant="outline" className="w-full group" disabled>
          View Details <ArrowRight className="ml-2 h-4 w-4_disabled_transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}
