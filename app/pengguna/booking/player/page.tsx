import { prisma, requireAuth } from "@/lib/server-auth";
import PlayerClient from "./player-client";
import { getBookingById } from "@/app/actions/booking";
import { SearchParams } from "next/dist/server/request/search-params";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import Header from "../header";

interface PlayerPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function PlayerPage({ searchParams }: PlayerPageProps) {
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
  } else if (booking._count.players !== 0) {
    redirect(`/pengguna/booking/success?bookingId=${booking.id}`);
  }

  const { fullName: userFullname } = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    select: { fullName: true },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardContent className="p-6">
          <Header
            title="Upload Proof of Payment"
            description="Please upload your payment proof to confirm your booking"
            section="Players"
            user={user}
          />

          <PlayerClient userFullname={userFullname} booking={booking} />
        </CardContent>
      </Card>
    </div>
  );
}
