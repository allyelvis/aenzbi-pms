
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { rooms } from '@/lib/data';
import type { Room } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BedDouble, Users, DollarSign, CheckCircle, Maximize2, LayoutGrid } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";


async function getRoomById(id: string): Promise<Room | undefined> {
  return rooms.find(r => r.id === id);
}

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const room = await getRoomById(params.id);

  if (!room) {
    return {
      title: 'Room Not Found',
    };
  }

  return {
    title: `${room.name} - Aenzbi PMS`,
    description: room.description,
  };
}

export default async function RoomDetailPage({ params }: Props) {
  const room = await getRoomById(params.id);

  if (!room) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{room.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header>
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-2">
          {room.name}
        </h1>
        <p className="text-lg text-muted-foreground">{room.description}</p>
      </header>

      {/* Image Gallery */}
      <section className="space-y-4">
        {room.photos.length > 0 && (
          <div className="relative w-full h-[300px] md:h-[500px] rounded-lg overflow-hidden shadow-lg">
            <Image
              src={room.photos[0]}
              alt={`Main image of ${room.name}`}
              layout="fill"
              objectFit="cover"
              priority
              data-ai-hint="luxury hotel room interior"
            />
          </div>
        )}
        {room.photos.length > 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {room.photos.slice(1).map((photoUrl, index) => (
              <div key={index} className="relative w-full h-32 md:h-40 rounded-md overflow-hidden shadow-md hover:opacity-90 transition-opacity">
                <Image
                  src={photoUrl}
                  alt={`Image ${index + 2} of ${room.name}`}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint="hotel room detail view"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <Separator />

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Description & Amenities */}
        <div className="md:col-span-2 space-y-6">
          <section>
            <h2 className="text-2xl font-headline font-semibold mb-3">Room Details</h2>
            <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
              {room.longDescription}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-headline font-semibold mb-4">Amenities</h2>
            <div className="flex flex-wrap gap-3">
              {room.amenities.map(amenity => (
                <Badge key={amenity} variant="secondary" className="text-sm py-1 px-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  {amenity}
                </Badge>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Key Info & Booking */}
        <aside className="md:col-span-1 space-y-6">
          <div className="p-6 border rounded-lg shadow-lg bg-card sticky top-24">
            <h2 className="text-2xl font-headline font-semibold mb-6 text-center">Key Information</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-semibold text-lg">${room.pricePerNight} <span className="text-sm text-muted-foreground">/ night</span></p>
                  <p className="text-xs text-muted-foreground">Taxes and fees may apply</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <BedDouble className="w-6 h-6 text-primary" />
                <p className="text-foreground">{room.beds}</p>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                <p className="text-foreground">Sleeps {room.capacity} guest(s)</p>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Maximize2 className="w-6 h-6 text-primary" />
                <p className="text-foreground">Size: {room.size}</p>
              </div>
            </div>
            <Button size="lg" className="w-full font-semibold text-base py-3" asChild>
              <Link href="/">
                 Check Availability & Book
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Return to homepage to select dates for this room.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

// Need to add Breadcrumb components if not already present from shadcn
// For now, assuming they exist or will be added. If not, this section might error.
// If Breadcrumb is not standard in shadcn/ui, I might need to create a simple one or omit it.
// Checking components.json, Breadcrumb is not listed. I will add a placeholder Breadcrumb component for now.
// Adding a new Breadcrumb component to components/ui
