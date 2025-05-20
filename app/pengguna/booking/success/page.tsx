import { requireAuth } from "@/lib/server-auth";
import { getBookingById } from "@/app/actions/booking";
import { SearchParams } from "next/dist/server/request/search-params";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "../header";
import { formatDate, formatHM, formatMoney } from "@/lib/utils";

interface SuccessPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const user = await requireAuth("CUSTOMER");
  const bookingId = (await searchParams).bookingId;
  if (typeof bookingId !== "string") {
    notFound();
  }

  const booking = await getBookingById(user, bookingId);
  if (!booking) {
    notFound();
  } else if (booking.payments.length === 0) {
    redirect(`/pengguna/booking/upload-payment?bookingId=${booking.id}`);
  } else if (booking._count.players === 0) {
    redirect(`/pengguna/booking/player?bookingId=${booking.id}`);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardContent className="p-8">
          <Header
            title="Booking Successful"
            description="Your booking has been received and is pending confirmation"
            section="Confirmation"
            user={user}
          />

          <div className="mb-6 rounded-lg bg-gray-50 p-6">
            <h2 className="mb-4 text-lg font-semibold">Booking Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Booking ID:</span>
                <span className="font-medium">{booking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Field:</span>
                <span className="font-medium">{booking.field.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span className="font-medium">
                  {formatDate(booking.bookingDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time:</span>
                <span className="font-medium">
                  {formatHM(booking.startTime)} - {formatHM(booking.endTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="font-medium">
                  {formatMoney(booking.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="font-medium text-yellow-600">
                  {booking.status}
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
