import { requireAuth } from "@/lib/server-auth";
import UploadPaymentClient from "./upload-payment-client";
import { getBookingById } from "@/app/actions/booking";
import { SearchParams } from "next/dist/server/request/search-params";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import Header from "../header";

interface UploadPaymentPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function UploadPaymentPage({
  searchParams,
}: UploadPaymentPageProps) {
  const user = await requireAuth("CUSTOMER");
  const bookingId = (await searchParams).bookingId;
  if (typeof bookingId !== "string") {
    notFound();
  }

  const booking = await getBookingById(user, bookingId);
  if (!booking) {
    notFound();
  } else if (booking.payments.some((payment) => payment.status === "PAID")) {
    if (booking._count.players !== 0) {
      redirect(`/pengguna/booking/success?bookingId=${booking.id}`);
    }
    redirect(`/pengguna/booking/player?bookingId=${booking.id}`);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardContent className="p-6">
          <Header
            title="Upload Proof of Payment"
            description="Please upload your payment proof to confirm your booking"
            section="Payment"
            user={user}
          />
          <UploadPaymentClient user={user} booking={booking} />
        </CardContent>
      </Card>
    </div>
  );
}
