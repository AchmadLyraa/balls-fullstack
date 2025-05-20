import fluent from "fluent-methods";
import { prisma, requireAuth } from "@/lib/server-auth";
import BookingClient from "./booking-client";
import { Card, CardContent } from "@/components/ui/card";
import Header from "./header";

export default async function BookingPage() {
  const user = await requireAuth("CUSTOMER");

  const fields = await prisma.field.findMany({
    omit: {
      createdAt: true,
      updatedAt: true,
      isAvailable: true,
      hourlyRate: true,
    },
    where: {
      isAvailable: true,
    },
    include: {
      bookings: {
        select: {
          bookingDate: true,
          startTime: true,
          endTime: true,
        },
        where: {
          bookingDate: {
            gte: fluent(new Date()).setHours(0, 0, 0, 0),
          },
        },
      },
    },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardContent className="p-6">
          <Header
            title="Borneo Anfield Stadium"
            description="Book your field now"
            section="Field & Time"
            user={user}
          />
          <BookingClient user={user} fields={fields} />;
        </CardContent>
      </Card>
    </div>
  );
}
