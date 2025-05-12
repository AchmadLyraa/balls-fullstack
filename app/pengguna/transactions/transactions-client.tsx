"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { UserJwtPayload } from "@/lib/auth"
import { BookingStatus } from "@prisma/client"
import { Eye } from "lucide-react"
import { getUserBookings } from "@/app/actions/booking"
import { toast } from "sonner"

interface TransactionsClientProps {
  user: UserJwtPayload
}

export default function TransactionsClient({ user }: TransactionsClientProps) {
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadBookings() {
      try {
        const bookings = await getUserBookings()
        setTransactions(bookings || [])
      } catch (error) {
        console.error("Error loading bookings:", error)
        toast.error("Failed to load booking history")
      } finally {
        setIsLoading(false)
      }
    }

    loadBookings()
  }, [])

  const getStatusClass = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return "bg-green-100 text-green-800"
      case BookingStatus.PENDING:
        return "bg-yellow-100 text-yellow-800"
      case BookingStatus.CANCELLED:
        return "bg-red-100 text-red-800"
      case BookingStatus.COMPLETED:
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return "Confirmed"
      case BookingStatus.PENDING:
        return "Pending"
      case BookingStatus.CANCELLED:
        return "Cancelled"
      case BookingStatus.COMPLETED:
        return "Completed"
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Transactions</h1>
          <p className="text-muted-foreground">View your booking history and transaction details</p>
        </div>
        <Card>
          <CardContent className="p-6 flex justify-center items-center h-40">
            <p>Loading transactions...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Your Transactions</h1>
        <p className="text-muted-foreground">View your booking history and transaction details</p>
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
                    <TableCell className="font-medium">{transaction.id.substring(0, 8)}</TableCell>
                    <TableCell>{transaction.field.name}</TableCell>
                    <TableCell>{formatDate(transaction.bookingDate)}</TableCell>
                    <TableCell>
                      {formatTime(transaction.startTime)} - {formatTime(transaction.endTime)}
                    </TableCell>
                    <TableCell>Rp {transaction.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(transaction.status)}`}
                      >
                        {getStatusText(transaction.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
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
  )
}
