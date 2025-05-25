"use client";

import { useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BookingStatus } from "@prisma/client";
import { getBookings } from "./page";
import {
  formatHM,
  formatMoney,
  formatPhoneNumber,
  formatUtcDateDMY,
  ucFirst,
} from "@/lib/utils";
import Filter, { generateUrl } from "./filter";
import EditForm from "./edit-form";

export interface BookingsClientProps {
  bookings: Awaited<ReturnType<typeof getBookings>>;
  hasMore: boolean;
}

export default function BookingsClient({
  bookings,
  hasMore,
}: BookingsClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<
    (typeof bookings)[number] | undefined
  >();

  const searchParams = useSearchParams();
  let page = parseInt(searchParams.get("page") || "1");
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  const query = searchParams.get("query") ?? "";

  const getStatusClass = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return "bg-green-100 text-green-800";
      case BookingStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case BookingStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      case BookingStatus.COMPLETED:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
      </div>

      <Filter />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Field</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.field.name}</TableCell>
                <TableCell>
                  {booking.user.phoneNumber
                    ? formatPhoneNumber(booking.user.phoneNumber)
                    : "-"}
                </TableCell>
                <TableCell>
                  <p>1. {booking.user.fullName}</p>
                  {booking.players.map((player, index) => (
                    <p key={index}>
                      {index + 2}. {player.fullName}
                    </p>
                  ))}
                </TableCell>
                <TableCell>{formatUtcDateDMY(booking.bookingDate)}</TableCell>
                <TableCell>
                  {formatHM(booking.startTime)} - {formatHM(booking.endTime)}
                </TableCell>
                <TableCell>{formatMoney(booking.amount)}</TableCell>
                <TableCell>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClass(booking.status)}`}
                  >
                    {ucFirst(booking.status.toLowerCase())}
                  </span>
                </TableCell>
                <TableCell>
                  {!["CANCELLED", "COMPLETED"].includes(booking.status) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelected(booking);
                        setIsDialogOpen(true);
                      }}
                    >
                      Update
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {(page > 1 || hasMore) && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={8}>
                  <div className="flex">
                    {page > 1 && (
                      <Button asChild variant="outline">
                        <Link
                          href={generateUrl(page - 1, query)}
                          className="mr-auto"
                        >
                          Previous
                        </Link>
                      </Button>
                    )}

                    {hasMore && (
                      <Button asChild variant="outline">
                        <Link
                          href={generateUrl(page + 1, query)}
                          className="ml-auto"
                        >
                          Next
                        </Link>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>

      {selected && (
        <EditForm
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          selected={selected}
        />
      )}
    </div>
  );
}
