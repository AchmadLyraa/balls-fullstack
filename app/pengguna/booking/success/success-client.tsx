"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UserJwtPayload } from "@/lib/server-auth";
import { CheckCircle } from "lucide-react";

interface SuccessClientProps {
  user: UserJwtPayload;
}

export default function SuccessClient({ user }: SuccessClientProps) {
  // Mock booking data
  const bookingData = {
    id: "BK-" + Math.floor(Math.random() * 10000),
    field: "Field A (North Wing)",
    date: "Thu May 22 2025",
    time: "3:00 PM",
    amount: "Rp 450.000",
    status: "Pending Confirmation",
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardContent className="p-8">
          <div className="mb-6 text-center">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
            <h1 className="text-2xl font-bold">Booking Successful!</h1>
            <p className="text-gray-500">
              Your booking has been received and is pending confirmation
            </p>
          </div>

          <div className="mb-6 rounded-lg bg-gray-50 p-6">
            <h2 className="mb-4 text-lg font-semibold">Booking Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Booking ID:</span>
                <span className="font-medium">{bookingData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Field:</span>
                <span className="font-medium">{bookingData.field}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span className="font-medium">{bookingData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time:</span>
                <span className="font-medium">{bookingData.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="font-medium">{bookingData.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="font-medium text-yellow-600">
                  {bookingData.status}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Your booking will be confirmed once the
              payment is verified. You will receive a notification when your
              booking is confirmed.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/pengguna/transactions">
              <Button variant="outline">View My Bookings</Button>
            </Link>
            <Link href="/pengguna">
              <Button className="bg-red-600 hover:bg-red-700">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
