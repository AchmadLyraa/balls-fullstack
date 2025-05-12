"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BookingStatus } from "@prisma/client"
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for bookings
const mockBookings = [
  {
    id: "1",
    phoneNumber: "082134567896",
    field: "Lapangan A",
    customer: "SRE",
    date: "12/05/2025",
    amount: "Rp. 450.000",
    paymentMode: "Transfer Bank",
    status: BookingStatus.CONFIRMED,
  },
  {
    id: "2",
    phoneNumber: "089145322634",
    field: "Lapangan B",
    customer: "AUROBOROS",
    date: "15/06/2025",
    amount: "Rp. 550.000",
    paymentMode: "Cash on Delivery",
    status: BookingStatus.PENDING,
  },
  {
    id: "3",
    phoneNumber: "081298987658",
    field: "Lapangan A",
    customer: "ENGGANG",
    date: "25/09/2025",
    amount: "Rp. 250.000",
    paymentMode: "Cash on Delivery",
    status: BookingStatus.CANCELLED,
  },
  {
    id: "4",
    phoneNumber: "082235465768",
    field: "Lapangan B",
    customer: "HMSI",
    date: "15/06/2025",
    amount: "Rp. 550.000",
    paymentMode: "Cash on Delivery",
    status: BookingStatus.PENDING,
  },
  {
    id: "5",
    phoneNumber: "08117654678",
    field: "Lapangan A",
    customer: "HMIF",
    date: "25/09/2025",
    amount: "Rp. 250.000",
    paymentMode: "Cash on Delivery",
    status: BookingStatus.CANCELLED,
  },
]

export default function BookingsClient() {
  const [bookings, setBookings] = useState(mockBookings)
  const [searchTerm, setSearchTerm] = useState("")
  const [entriesPerPage, setEntriesPerPage] = useState("10")

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phoneNumber.includes(searchTerm),
  )

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Data Pemesanan Lapangan</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Booking</DialogTitle>
              <DialogDescription>Fill in the details to create a new booking.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="phone" className="text-right">
                  Phone
                </label>
                <Input id="phone" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="field" className="text-right">
                  Field
                </label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="field-a">Lapangan A</SelectItem>
                    <SelectItem value="field-b">Lapangan B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="customer" className="text-right">
                  Customer
                </label>
                <Input id="customer" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="date" className="text-right">
                  Date
                </label>
                <Input id="date" type="date" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="amount" className="text-right">
                  Amount
                </label>
                <Input id="amount" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="payment" className="text-right">
                  Payment Mode
                </label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select payment mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Transfer Bank</SelectItem>
                    <SelectItem value="cash">Cash on Delivery</SelectItem>
                    <SelectItem value="qris">QRIS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Booking</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span>entries</span>
        </div>

        <div className="relative w-64">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Tlp</TableHead>
              <TableHead>Field</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Mode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.phoneNumber}</TableCell>
                <TableCell>{booking.field}</TableCell>
                <TableCell>{booking.customer}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>{booking.amount}</TableCell>
                <TableCell>{booking.paymentMode}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(booking.status)}`}>
                    {booking.status === BookingStatus.CONFIRMED
                      ? "Delivered"
                      : booking.status === BookingStatus.PENDING
                        ? "Process"
                        : "Canceled"}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
