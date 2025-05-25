import { prisma, requireAuth } from "@/lib/server-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, CreditCard, DollarSign, Users } from "lucide-react";
import fluent from "fluent-methods";
import { formatDateDMY, formatMoney, formatNumber, ucFirst } from "@/lib/utils";
import BookingAnalytics, { BookingAnalyticsProps } from "./booking-analytics";

export default async function AdminDashboardPage() {
  const user = await requireAuth("ADMIN");

  const today = new Date();
  const thisMonthDate = fluent(new Date()).setMonth(today.getMonth() - 1);
  const lastMonthDate = fluent(new Date()).setMonth(today.getMonth() - 2);

  const [
    thisMonthBookings,
    lastMonthBookings,
    thisMonthActiveUsers,
    lastMonthActiveUsers,
    thisMonthRedemptions,
    lastMonthRedemptions,
    recentBookings,
    popularFields,
  ] = await Promise.all([
    prisma.booking.findMany({
      where: {
        status: {
          in: ["COMPLETED", "CONFIRMED"],
        },
        bookingDate: {
          gte: thisMonthDate,
        },
      },
      select: {
        amount: true,
        duration: true,
        bookingDate: true,
      },
    }),
    prisma.booking.findMany({
      where: {
        status: {
          in: ["COMPLETED", "CONFIRMED"],
        },
        bookingDate: {
          gte: lastMonthDate,
          lt: thisMonthDate,
        },
      },
      select: {
        amount: true,
      },
    }),

    prisma.booking.findMany({
      where: {
        status: {
          in: ["COMPLETED", "CONFIRMED"],
        },
        bookingDate: {
          gte: thisMonthDate,
        },
      },
      distinct: "userId",
      select: { id: true },
    }),
    prisma.booking.findMany({
      where: {
        status: {
          in: ["COMPLETED", "CONFIRMED"],
        },
        bookingDate: {
          gte: lastMonthDate,
          lt: thisMonthDate,
        },
      },
      distinct: "userId",
      select: { id: true },
    }),

    prisma.redemption.count({
      where: {
        status: "COMPLETED",
        redemptionDate: {
          gte: thisMonthDate,
        },
      },
    }),
    prisma.redemption.count({
      where: {
        status: "COMPLETED",
        redemptionDate: {
          gte: lastMonthDate,
          lt: thisMonthDate,
        },
      },
    }),

    prisma.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        field: {
          select: { name: true },
        },
        user: {
          select: { fullName: true },
        },
      },
      take: 3,
    }),

    prisma.field.findMany({
      include: {
        _count: {
          select: {
            bookings: {
              where: {
                bookingDate: {
                  gte: thisMonthDate,
                },
              },
            },
          },
        },
      },
    }),
  ]);

  const bookingDifferenceFromLastMonth =
    thisMonthBookings.length / lastMonthBookings.length - 1;

  const thisMonthRevenue = thisMonthBookings.reduce(
    (revenue, booking) => revenue + booking.amount,
    0,
  );
  const lastMonthRevenue = lastMonthBookings.reduce(
    (revenue, booking) => revenue + booking.amount,
    0,
  );
  const revenueDifferenceFromLastMonth =
    thisMonthRevenue / lastMonthRevenue - 1;

  const activeUserDifferenceFromLastMonth =
    thisMonthActiveUsers.length / lastMonthActiveUsers.length - 1;

  const redemptionDifferenceFromLastMonth =
    thisMonthRedemptions / lastMonthRedemptions - 1;

  const sign = (number: number) => (number > 0 ? "+" : "");

  const fieldBookingCount = popularFields.reduce(
    (revenue, field) => revenue + field._count.bookings,
    0,
  );

  const groupedThisMonthBookings = thisMonthBookings.reduce(
    (group, booking) => {
      const key = formatDateDMY(booking.bookingDate, "/");

      if (!(key in group)) {
        group[key] = { count: 0, duration: 0 };
      }

      group[key].count++;
      group[key].duration += booking.duration;

      return group;
    },
    {} as Record<string, { count: number; duration: number }>,
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.username}! Here's an overview of your system.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Bookings
                </CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(thisMonthBookings.length)}
                </div>
                {isFinite(bookingDifferenceFromLastMonth) && (
                  <p className="text-xs text-muted-foreground">
                    {sign(bookingDifferenceFromLastMonth)}
                    {formatNumber(bookingDifferenceFromLastMonth * 100)}% from
                    last month
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatMoney(thisMonthRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {sign(revenueDifferenceFromLastMonth)}
                  {formatNumber(revenueDifferenceFromLastMonth * 100)}% from
                  last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(thisMonthActiveUsers.length)}
                </div>
                {isFinite(activeUserDifferenceFromLastMonth) && (
                  <p className="text-xs text-muted-foreground">
                    {sign(activeUserDifferenceFromLastMonth)}
                    {formatNumber(activeUserDifferenceFromLastMonth * 100)}%
                    from last month
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Loyalty Redemptions
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(thisMonthRedemptions)}
                </div>
                {isFinite(redemptionDifferenceFromLastMonth) && (
                  <p className="text-xs text-muted-foreground">
                    {sign(redemptionDifferenceFromLastMonth)}
                    {formatNumber(redemptionDifferenceFromLastMonth * 100)}%
                    from last month
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  Latest field bookings across all fields
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {booking.field.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateDMY(booking.bookingDate, "/")} -{" "}
                          {formatMoney(booking.amount)}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        {ucFirst(booking.status.toLowerCase())}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Popular Fields</CardTitle>
                <CardDescription>Most booked fields this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularFields.map((field) => (
                    <div key={field.id} className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {field.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(field._count.bookings)} bookings
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        {(
                          (field._count.bookings / fieldBookingCount) *
                          100
                        ).toFixed(2)}
                        %
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Analytics</CardTitle>
              <CardDescription>
                Booking trends over the past 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[400px] items-center justify-center rounded border">
                <BookingAnalytics
                  data={
                    Object.entries(groupedThisMonthBookings).map(
                      ([date, data]) => {
                        // @ts-ignore
                        data.name = date;

                        return data;
                      },
                    ) as BookingAnalyticsProps["data"]
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
