
import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Building2 size={28} />
          <h1 className="text-2xl font-headline font-bold">Aenzbi PMS</h1>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild className="hover:bg-white/10 text-xs sm:text-sm">
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild className="hover:bg-white/10 text-xs sm:text-sm">
            <Link href="/availability">Availability</Link>
          </Button>
          <Button variant="ghost" asChild className="hover:bg-white/10 text-xs sm:text-sm">
            <Link href="/admin/bookings">Manage Bookings</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
