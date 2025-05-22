import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  camelCaseToTitleCase,
  formatDate,
  formatMoney,
  formatNumber,
} from "@/lib/utils";
import Filter from "./filter";
import type { getAllFields, getFields } from "./page";

interface ReportClientProps {
  from: Date | undefined;
  to: Date | undefined;
  cardData: {
    totalBooking: number;
    finishedBooking: number;
    canceledBooking: number;
    totalIncome: number;
  };
  allFields: Awaited<ReturnType<typeof getAllFields>>;
  fields: Awaited<ReturnType<typeof getFields>>;
  dailyBookingDetail: Record<string, { count: number; amount: number }>;
}

export default function ReportClient({
  from,
  to,
  cardData,
  allFields,
  fields,
  dailyBookingDetail,
}: ReportClientProps) {
  return (
    <>
      <Filter from={from} to={to} allFields={allFields} />

      <Card>
        <CardContent className="p-6">
          <h2 className="mb-2 text-lg font-semibold">Report Summary</h2>
          {from && to ? (
            <p className="mb-4 text-sm text-gray-500">
              {formatDate(from)} - {formatDate(to)}
            </p>
          ) : from ? (
            <p className="mb-4 text-sm text-gray-500">
              From {formatDate(from)}
            </p>
          ) : (
            to && (
              <p className="mb-4 text-sm text-gray-500">To {formatDate(to)}</p>
            )
          )}

          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {Object.entries(cardData).map(([key, value], index) => (
              <div key={key} className="rounded-md border bg-white p-4">
                <h3 className="text-sm font-medium text-gray-500">
                  {camelCaseToTitleCase(key)}
                </h3>
                <p className="text-2xl font-bold">
                  {index === 3 ? formatMoney(value) : formatNumber(value)}
                </p>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          <h2 className="mb-4 text-lg font-semibold">Field Usage</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Field Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Total Booking Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Completed Booking Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Income
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {fields.map((field) => (
                  <tr key={field.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {field.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatNumber(field.bookings.length)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatNumber(
                        field.bookings.reduce((counts, booking) => {
                          return booking.status === "COMPLETED" ||
                            booking.status === "CONFIRMED"
                            ? counts + 1
                            : counts;
                        }, 0),
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatMoney(
                        field.bookings.reduce((amounts, booking) => {
                          return (
                            amounts +
                            (booking.status === "COMPLETED" ||
                            booking.status === "CONFIRMED"
                              ? booking.amount
                              : 0)
                          );
                        }, 0),
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Separator className="my-6" />

          <h2 className="mb-4 text-lg font-semibold">Daily Booking Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Booking Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Income
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {Object.entries(dailyBookingDetail).map(([date, data]) => (
                  <tr key={date}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {date}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatNumber(data.count)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatMoney(data.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
