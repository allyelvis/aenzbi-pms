
import { rooms as allRooms } from '@/lib/data';
import { ROOM_STATUSES, type RoomStatus } from '@/types';
import { updateRoomStatusAction } from './actions';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, BedDouble, Edit3 } from 'lucide-react';

export default async function AdminRoomStatusPage({
  searchParams,
}: {
  searchParams?: { message?: string; status?: string };
}) {
  const currentRooms = allRooms; 

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">
          Manage Room Status
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          View and update the current status of all hotel rooms.
        </p>
      </section>

      {searchParams?.message && (
        <Alert 
          variant={searchParams.status === 'success' ? 'default' : 'destructive'} 
          className="my-6 max-w-2xl mx-auto"
        >
          {searchParams.status === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <AlertTitle>{searchParams.status === 'success' ? 'Success!' : 'Error'}</AlertTitle>
          <AlertDescription>{decodeURIComponent(searchParams.message)}</AlertDescription>
        </Alert>
      )}
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <BedDouble className="w-7 h-7 text-primary" /> Current Room Statuses
          </CardTitle>
          <CardDescription>
            A list of all rooms and their operational status. Use the form to update.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentRooms.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room Name</TableHead>
                    <TableHead>Current Status</TableHead>
                    <TableHead className="text-right">Update Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          room.status === 'Vacant Clean' ? 'bg-green-100 text-green-700' :
                          room.status === 'Vacant Dirty' ? 'bg-yellow-100 text-yellow-700' :
                          room.status === 'Occupied' ? 'bg-blue-100 text-blue-700' :
                          room.status === 'Maintenance' ? 'bg-red-100 text-red-700' :
                          room.status === 'Cleaning in Progress' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {room.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <form action={updateRoomStatusAction} className="flex gap-2 justify-end items-center">
                          <input type="hidden" name="roomId" value={room.id} />
                          <Select name="newStatus" defaultValue={room.status}>
                            <SelectTrigger className="w-[200px] h-9">
                              <SelectValue placeholder="Select new status" />
                            </SelectTrigger>
                            <SelectContent>
                              {ROOM_STATUSES.map(statusVal => (
                                <SelectItem key={statusVal} value={statusVal}>
                                  {statusVal}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button type="submit" variant="outline" size="sm">
                            <Edit3 className="w-4 h-4 mr-1" /> Update
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No rooms found in the system.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
