
import Image from 'next/image';
import type { FoodBeverageOutlet } from '@prisma/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, Clock, MapPin, Info, Phone } from 'lucide-react';
import Link from 'next/link';

interface FoodOutletCardProps {
  outlet: FoodBeverageOutlet;
}

export default function FoodOutletCard({ outlet }: FoodOutletCardProps) {
  const placeholderImage = "https://placehold.co/600x400.png";
  const aiHint = outlet.cuisineType ? outlet.cuisineType.toLowerCase().replace(/\s+/g, ' ') : 'restaurant interior';


  return (
    <Card className="flex flex-col overflow-hidden h-full transition-all duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative w-full h-48 bg-muted">
          <Image
            src={outlet.imageUrl || placeholderImage}
            alt={`Image of ${outlet.name}`}
            layout="fill"
            objectFit="cover"
            data-ai-hint={aiHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-xl font-headline mb-1">{outlet.name}</CardTitle>
        {outlet.cuisineType && (
          <div className="flex items-center gap-2 text-sm text-primary mb-2">
            <Utensils className="w-4 h-4" />
            <span>{outlet.cuisineType}</span>
          </div>
        )}
        <CardDescription className="text-sm text-muted-foreground mb-4 line-clamp-3 h-[60px]">
          {outlet.description || 'No description available.'}
        </CardDescription>
        <div className="space-y-2 text-sm text-muted-foreground">
          {outlet.operatingHours && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>{outlet.operatingHours}</span>
            </div>
          )}
          {outlet.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{outlet.location}</span>
            </div>
          )}
          {outlet.dressCode && (
             <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                <span>Dress Code: {outlet.dressCode}</span>
            </div>
          )}
          {outlet.contactPhone && (
             <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>Contact: {outlet.contactPhone}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        {/* Placeholder for future actions like "View Menu" or "Book Table" */}
        <Button variant="outline" className="w-full group" disabled> 
          View Details (Coming Soon)
        </Button>
      </CardFooter>
    </Card>
  );
}
