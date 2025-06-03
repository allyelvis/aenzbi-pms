
import Image from 'next/image';
import type { FoodBeverageOutlet } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Utensils, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FoodOutletCardProps {
  outlet: FoodBeverageOutlet;
}

export default function FoodOutletCard({ outlet }: FoodOutletCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden h-full transition-all duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative w-full h-56">
          <Image
            src={outlet.imageUrl}
            alt={`Image of ${outlet.name}`}
            layout="fill"
            objectFit="cover"
            data-ai-hint="restaurant interior luxury"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-xl font-headline mb-2">{outlet.name}</CardTitle>
        <Badge variant="secondary" className="mb-3">{outlet.cuisineType}</Badge>
        <CardDescription className="text-sm text-muted-foreground mb-4 line-clamp-4">{outlet.description}</CardDescription>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>{outlet.operatingHours}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>{outlet.location}</span>
          </div>
          {outlet.dressCode && (
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span>Dress Code: {outlet.dressCode}</span>
            </div>
          )}
        </div>

        {outlet.menuHighlights && outlet.menuHighlights.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">Menu Highlights:</h4>
            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
              {outlet.menuHighlights.map(highlight => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button variant="outline" className="w-full group">
          View Menu / Reserve (Coming Soon) <Utensils className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
