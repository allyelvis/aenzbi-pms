// This page has been removed as the FoodBeverageOutlet feature is not
// currently supported by the provided Prisma schema.
// To re-enable this, add a FoodBeverageOutlet model to your schema.prisma,
// run 'npx prisma migrate dev' and 'npx prisma generate',
// then update src/types/index.ts and re-create this page and related components.

import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function FoodAndBeveragePageRemoved() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <Alert variant="default" className="max-w-lg mx-auto">
        <Info className="h-5 w-5" />
        <AlertTitle>Feature Not Available</AlertTitle>
        <AlertDescription>
          The Food & Beverage outlets page is currently unavailable. This feature can be re-enabled
          if the corresponding data model is added to the backend.
          <br />
          <Link href="/" className="underline mt-2 inline-block">Return to Homepage</Link>
        </AlertDescription>
      </Alert>
    </div>
  );
}
