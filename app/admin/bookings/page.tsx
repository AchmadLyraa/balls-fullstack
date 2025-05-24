import { prisma, requireAuth } from "@/lib/server-auth";
import BookingsClient from "./bookings-client";
import type { SearchParams } from "next/dist/server/request/search-params";

export function getBookings(
  page: number,
  perPage: number,
  query: string | undefined,
) {
  return prisma.booking.findMany({
    skip: (page - 1) * perPage,
    take: perPage + 1,
    where: query
      ? {
          OR: [
            {
              user: {
                fullName: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            },
            {
              user: {
                phoneNumber: {
                  contains: query,
                },
              },
            },
            {
              players: {
                some: {
                  fullName: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        }
      : undefined,
    include: {
      field: {
        select: {
          name: true,
        },
      },
      user: {
        select: {
          fullName: true,
          phoneNumber: true,
        },
      },
      players: {
        select: {
          fullName: true,
        },
      },
    },
    orderBy: {
      bookingDate: "desc",
    },
  });
}

interface BookingsPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function BookingsPage({
  searchParams,
}: BookingsPageProps) {
  await requireAuth("ADMIN");

  const search = await searchParams;
  let page = Number(search.page);
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  const query = search.query;
  const perPage = 10;

  const bookings = await getBookings(
    page,
    perPage,
    Array.isArray(query) ? query[0].trim() : query?.trim(),
  );

  let hasMore = false;
  if (bookings.length > perPage) {
    hasMore = true;
    bookings.pop();
  }

  return <BookingsClient bookings={bookings} hasMore={hasMore} />;
}
