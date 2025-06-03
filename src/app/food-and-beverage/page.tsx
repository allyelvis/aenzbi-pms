
import prisma from '@/lib/prisma';
import type { FoodBeverageOutlet as PrismaFoodBeverageOutlet } from '@prisma/client';
import FoodOutletCard from '@/components/FoodOutletCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Utensils, AlertCircle } from 'lucide-react';

export default async function FoodAndBeveragePage() {
  let outlets: PrismaFoodBeverageOutlet[] = [];
  let fetchError: string | null = null;

  try {
    outlets = await prisma.foodBeverageOutlet.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  } catch (error) {
    console.error("Failed to fetch F&B outlets:", error);
    fetchError = "Could not load Food & Beverage outlet data. Please try again later.";
  }

  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-gradient-to-r from-primary to-accent rounded-lg shadow-xl">
        <Utensils className="mx-auto h-16 w-16 text-primary-foreground mb-4" />
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary-foreground mb-4">
          Dining & Refreshments
        </h1>
        <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
          Explore the culinary experiences and vibrant atmospheres at Aenzbi PMS.
        </p>
      </section>

      {fetchError && (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      )}

      <section>
        {outlets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outlets.map(outlet => (
              <FoodOutletCard key={outlet.id} outlet={outlet} />
            ))}
          </div>
        ) : (
          !fetchError && (
            <p className="text-center text-muted-foreground py-10 text-lg">
              No Food & Beverage outlets are currently listed. Please check back later.
            </p>
          )
        )}
      </section>
    </div>
  );
}
