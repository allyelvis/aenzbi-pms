
import Link from 'next/link';
import { Building2, BedDouble, CalendarDays, UserCog } from 'lucide-react'; // Added icons
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Building2 size={28} />
          <h1 className="text-2xl font-headline font-bold">Aenzbi PMS</h1>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" asChild className="hover:bg-white/10 text-xs sm:text-sm px-2 sm:px-3">
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild className="hover:bg-white/10 text-xs sm:text-sm px-2 sm:px-3">
            <Link href="/availability" className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4 sm:hidden md:inline-block" /> Availability
            </Link>
          </Button>
          <Button variant="ghost" asChild className="hover:bg-white/10 text-xs sm:text-sm px-2 sm:px-3">
            <Link href="/admin/bookings" className="flex items-center gap-1">
               <UserCog className="w-4 h-4 sm:hidden md:inline-block" /> Manage Bookings
            </Link>
          </Button>
          <Button variant="ghost" asChild className="hover:bg-white/10 text-xs sm:text-sm px-2 sm:px-3">
            <Link href="/admin/room-status" className="flex items-center gap-1">
              <BedDouble className="w-4 h-4 sm:hidden md:inline-block" /> Room Status
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
