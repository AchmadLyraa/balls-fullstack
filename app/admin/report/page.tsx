import { prisma, requireAuth } from "@/lib/server-auth";
import { SearchParams } from "next/dist/server/request/search-params";
import { formatDateYMD, parseDate } from "@/lib/utils";
import ReportClient from "./report-client";

export function getAllFields() {
  return prisma.field.findMany({
    select: {
      id: true,
      name: true,
    },
  });
}

export function getFields(fieldId: string | undefined) {
  return prisma.field.findMany({
    where: {
      id: fieldId,
    },
    include: {
      bookings: {
        select: {
          amount: true,
          status: true,
        },
      },
    },
  });
}

interface ReportPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ReportPage({ searchParams }: ReportPageProps) {
  await requireAuth("ADMIN");

  const search = await searchParams;
  const from = parseDate(search.from);
  const to = parseDate(search.to);
  const fieldId = typeof search.field === "string" ? search.field : undefined;

  const [bookings, allFields, fields] = await Promise.all([
    prisma.booking.findMany({
      where: {
        fieldId,
        bookingDate: {
          gte: from,
          lt: to,
        },
      },
      select: {
        status: true,
        amount: true,
        bookingDate: true,
      },
      orderBy: {
        bookingDate: "desc",
      },
    }),

    getAllFields(),

    getFields(fieldId),
  ]);

  const cardData = bookings.reduce(
    (stats, booking) => {
      stats.totalBooking++;

      if (booking.status === "COMPLETED") {
        stats.finishedBooking++;

        stats.totalIncome += booking.amount;
      } else if (booking.status === "CANCELLED") {
        stats.canceledBooking++;
      } else if (booking.status === "CONFIRMED") {
        stats.totalIncome += booking.amount;
      }

      return stats;
    },
    {
      totalBooking: 0,
      finishedBooking: 0,
      canceledBooking: 0,
      totalIncome: 0,
    },
  );

  const dailyBookingDetail = bookings.reduce(
    (map, booking) => {
      const date = formatDateYMD(booking.bookingDate);
      if (!(date in map)) {
        map[date] = { count: 0, amount: 0 };
      }

      map[date].count++;
      map[date].amount += booking.amount;

      return map;
    },
    {} as Record<string, { count: number; amount: number }>,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Report</h1>
      </div>

      <ReportClient
        from={from}
        to={to}
        cardData={cardData}
        allFields={allFields}
        fields={fields}
        dailyBookingDetail={dailyBookingDetail}
      />
    </div>
  );
}
