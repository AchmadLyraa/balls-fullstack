import { prisma, requireAuth } from "@/lib/server-auth";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateDMY } from "@/lib/utils";

export default async function LoyaltyPage() {
  const user = await requireAuth("CUSTOMER");
  const points = await prisma.userPoint.findMany({
    where: {
      userId: user.id,
      isActive: true,
      expiryDate: {
        gt: new Date(),
      },
      points: {
        gt: 0,
      },
    },
  });

  const count = points.reduce((total, point) => {
    return total + point.points;
  }, 0);

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Your Points</h1>
            <p className="text-gray-500">{count} Points</p>
          </div>

          <div className="space-y-4">
            {points.map((point) => (
              <Card key={point.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{point.points} Points</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {formatDateDMY(point.createdAt)} -{" "}
                      {point.expiryDate
                        ? formatDateDMY(point.expiryDate)
                        : " Forever"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
