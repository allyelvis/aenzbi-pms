
import Link from 'next/link';
import { guests as allGuests } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users, BadgePercent, Phone, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default async function AdminGuestsPage() {
  const currentGuests = allGuests;

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">
          Guest Management
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          View and manage guest profiles and their history.
        </p>
      </section>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <Users className="w-7 h-7 text-primary" /> Guest List
          </CardTitle>
          <CardDescription>
            {currentGuests.length > 0
              ? `A total of ${currentGuests.length} guest(s) found.`
              : "There are no guests in the system yet."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentGuests.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Loyalty Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentGuests.map((guest) => (
                    <TableRow key={guest.id}>
                      <TableCell className="font-medium">
                        <Link href={`/admin/guests/${guest.id}`} className="hover:underline text-primary">
                          {guest.name}
                        </Link>
                      </TableCell>
                      <TableCell>{guest.email}</TableCell>
                      <TableCell>{guest.phone || 'N/A'}</TableCell>
                      <TableCell>
                        {guest.loyaltyStatus ? (
                          <Badge variant={guest.loyaltyStatus === 'Platinum' ? 'default' : guest.loyaltyStatus === 'Gold' ? 'secondary' : 'outline'} className="capitalize">
                            <BadgePercent className="w-3 h-3 mr-1" />
                            {guest.loyaltyStatus}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">None</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/guests/${guest.id}`} className="text-sm text-primary hover:underline">
                          View Profile
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No guests to display.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
