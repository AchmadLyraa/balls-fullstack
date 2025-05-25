"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookingStatus } from "@prisma/client";
import { Eye } from "lucide-react";
import type { getUserBookings } from "@/app/actions/booking";
import { formatDate, formatHM, formatMoney, ucFirst } from "@/lib/utils";
import Link from "next/link";

interface TransactionsClientProps {
  transactions: Awaited<ReturnType<typeof getUserBookings>>;
}

export default function TransactionsClient({
  transactions,
}: TransactionsClientProps) {
  const getStatusClass = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return "bg-green-100 text-green-800";
      case BookingStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case BookingStatus.CANCELLED:
        return "bg-orange-100 text-orange-800";
      case BookingStatus.COMPLETED:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Your Transactions</h1>
        <p className="text-muted-foreground">
          View your booking history and transaction details
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          {transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.id.substring(0, 8)}
                    </TableCell>
                    <TableCell>{transaction.field.name}</TableCell>
                    <TableCell>{formatDate(transaction.bookingDate)}</TableCell>
                    <TableCell>
                      {formatHM(transaction.startTime)} -{" "}
                      {formatHM(transaction.endTime)}
                    </TableCell>
                    <TableCell>{formatMoney(transaction.amount)}</TableCell>
                    <TableCell>
                      {transaction.payments?.[0].status === "INVALID" ? (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                          Invalid Payment
                        </span>
                      ) : (
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClass(transaction.status)}`}
                        >
                          {ucFirst(transaction.status.toLowerCase())}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={
                          transaction.payments.some(
                            (payment) => payment.status === "PAID",
                          )
                            ? transaction.players.length
                              ? `/pengguna/booking/success?bookingId=${transaction.id}`
                              : `/pengguna/booking/player?bookingId=${transaction.id}`
                            : `/pengguna/booking/upload-payment?bookingId=${transaction.id}`
                        }
                      >
                        <Button variant="ghost" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">No transactions found</p>
              <Button
                className="mt-4 bg-red-600 hover:bg-red-700"
                onClick={() => (window.location.href = "/pengguna/booking")}
              >
                Book a Field
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
