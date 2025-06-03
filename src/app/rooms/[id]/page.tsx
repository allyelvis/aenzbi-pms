
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import type { Room as PrismaRoom } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DollarSign, CalendarCheck2, Home, Hash, Tag, Info } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Helper to convert Prisma Decimal to number
interface Room extends Omit<PrismaRoom, 'price' | 'createdAt' | 'updatedAt' | 'id'> {
  id: number;
  price: number;
}

async function getRoomById(id: number): Promise<Room | null> {
  try {
    const roomFromDb = await prisma.room.findUnique({
      where: { id },
    });
    if (!roomFromDb) return null;
    return { ...roomFromDb, price: Number(roomFromDb.price) }; // Convert Decimal to number
  } catch (error) {
    console.error(`Failed to fetch room with id ${id}:`, error);
    return null;
  }
}

type Props = {
  params: { id: string }; // Next.js passes id as string
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const roomId = parseInt(params.id, 10);
  if (isNaN(roomId)) {
    return { title: 'Invalid Room ID' };
  }
  const room = await getRoomById(roomId);

  if (!room) {
    return { title: 'Room Not Found' };
  }

  return {
    title: `${room.type} - Room ${room.number} - Aenzbi PMS`,
    // description: room.description, // 'description' not in new schema
  };
}

export default async function RoomDetailPage({ params, searchParams }: Props) {
  const roomId = parseInt(params.id, 10);

  if (isNaN(roomId)) {
     return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Invalid Room ID provided. <Link href="/" className="underline">Return to homepage.</Link></AlertDescription>
        </Alert>
      </div>
    );
  }

  const room = await getRoomById(roomId);

  if (!room) {
    notFound();
  }

  const fromDateStr = typeof searchParams?.from === 'string' ? searchParams.from : undefined;
  const toDateStr = typeof searchParams?.to === 'string' ? searchParams.to : undefined;

  let bookingLink = "/"; // Default link to homepage
  let buttonText = "Check Availability on Homepage";
  let buttonIcon = <Home className="mr-2 h-5 w-5" />;
  let dateDisplay: React.ReactNode = null;

  if (fromDateStr && toDateStr) {
    try {
      const fromDate = new Date(fromDateStr);
      const toDate = new Date(toDateStr);
      if (!isNaN(fromDate.valueOf()) && !isNaN(toDate.valueOf()) && fromDate < toDate) {
        bookingLink = `/booking/${room.id}?from=${fromDate.toISOString()}&to=${toDate.toISOString()}`;
        buttonText = "Proceed to Booking";
        buttonIcon = <CalendarCheck2 className="mr-2 h-5 w-5" />;
        dateDisplay = (
          <p className="text-sm text-accent text-center mb-3">
            Selected Dates: {format(fromDate, "LLL dd, yyyy")} - {format(toDate, "LLL dd, yyyy")}
          </p>
        );
      } else {
        console.warn("Invalid date range in searchParams.");
      }
    } catch (error) {
      console.warn("Error parsing dates from searchParams:", error);
    }
  }

  // The Prisma schema for Room is: id, number, type, status, price.
  // Fields like longDescription, photos (gallery), amenities, size are not in the basic schema.
  // The page will be simplified to reflect available data.

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
            {/* Using room.type as it's more descriptive than just ID */}
            <BreadcrumbPage>{room.type} - Room {room.number}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header>
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-2">
          {room.type} - Room {room.number}
        </h1>
        {/* 'description' is not in the new Room schema. Maybe show status or type again. */}
        <p className="text-lg text-muted-foreground">Current Status: <Badge variant={room.status === 'Vacant Clean' ? 'default' : 'secondary'}>{room.status}</Badge></p>
      </header>

      <section className="space-y-4">
        <div className="relative w-full h-[300px] md:h-[500px] rounded-lg overflow-hidden shadow-lg bg-muted">
          <Image
            src="https://placehold.co/800x600.png" // Placeholder as 'photos' is not in schema
            alt={`Main image of ${room.type} ${room.number}`}
            layout="fill"
            objectFit="cover"
            priority
            data-ai-hint="hotel room placeholder large"
          />
        </div>
        {/* Gallery (room.photos.slice(1)) removed as 'photos' is not in schema */}
      </section>

      <Separator />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <section>
            <h2 className="text-2xl font-headline font-semibold mb-3">Room Details</h2>
            {/* 'longDescription' is not in the new Room schema. Display available details. */}
            <div className="text-foreground/90 leading-relaxed space-y-2">
                <p><Info className="inline-block w-5 h-5 mr-2 text-primary" /><strong>Room Type:</strong> {room.type}</p>
                <p><Hash className="inline-block w-5 h-5 mr-2 text-primary" /><strong>Room Number:</strong> {room.number}</p>
                <p><Tag className="inline-block w-5 h-5 mr-2 text-primary" /><strong>Current Status:</strong> {room.status}</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-headline font-semibold mb-4">Amenities</h2>
            {/* 'amenities' list is not in the new Room schema. Showing placeholder. */}
            <p className="text-muted-foreground">
              Standard hotel amenities are provided. For specific requests, please contact the front desk.
              (To show a list, add an 'amenities' field to your Prisma Room model).
            </p>
          </section>
        </div>

        <aside className="md:col-span-1 space-y-6">
          <div className="p-6 border rounded-lg shadow-lg bg-card sticky top-24">
            <h2 className="text-2xl font-headline font-semibold mb-6 text-center">Key Information</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-semibold text-lg">${room.price.toFixed(2)} <span className="text-sm text-muted-foreground">/ night</span></p>
                  <p className="text-xs text-muted-foreground">Taxes and fees may apply</p>
                </div>
              </div>
              <Separator />
              {/* 'beds', 'capacity', 'size' are not in the new Room schema. These are placeholders. */}
              <div className="flex items-center gap-3">
                <Info className="w-6 h-6 text-primary" />
                <p className="text-foreground">Details placeholder (beds, capacity)</p>
              </div>
              <Separator />
               <div className="flex items-center gap-3">
                <Info className="w-6 h-6 text-primary" />
                <p className="text-foreground">Size placeholder</p>
              </div>
            </div>
            {dateDisplay}
            <Button size="lg" className="w-full font-semibold text-base py-3" asChild>
              <Link href={bookingLink}>
                {buttonIcon}
                {buttonText}
              </Link>
            </Button>
            {!(fromDateStr && toDateStr) && (
               <p className="text-xs text-muted-foreground mt-3 text-center">
                Select dates on the homepage to book this room.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
