
import FoodOutletCard from '@/components/FoodOutletCard';
import { foodBeverageOutlets } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Food & Beverage Outlets - Aenzbi PMS',
  description: 'Explore the dining and lounge options at our luxury hotel.',
};

export default async function FoodAndBeveragePage() {
  const outlets = foodBeverageOutlets; // In a real app, this would be fetched

  return (
    <div className="space-y-8">
      <section className="text-center py-8">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">
          Dine & Unwind
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our collection of exquisite restaurants, vibrant bars, and cozy cafés, each offering a unique culinary experience.
        </p>
      </section>

      {outlets.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {outlets.map(outlet => (
            <FoodOutletCard key={outlet.id} outlet={outlet} />
          ))}
        </section>
      ) : (
        <section className="text-center py-10">
          <p className="text-lg text-muted-foreground">
            Information about our food and beverage outlets is coming soon.
          </p>
        </section>
      )}
    </div>
  );
}
