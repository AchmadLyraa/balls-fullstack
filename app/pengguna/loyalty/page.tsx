import { prisma, requireAuth } from "@/lib/server-auth";
import LoyaltyClient from "./loyalty-client";

export function getLoyaltyPrograms() {
  return prisma.loyaltyProgram.findMany({
    where: { isActive: true, deletedAt: null },
    orderBy: { pointsRequired: "asc" },
  });
}

export async function getUserPoints(userId: string) {
  const points = await prisma.userPoint.findMany({
    where: {
      userId,
      isActive: true,
      expiryDate: {
        gt: new Date(),
      },
    },
  });

  return points.reduce((total, point) => {
    return total + point.points;
  }, 0);
}

export function getUserRedemptions(userId: string) {
  return prisma.redemption.findMany({
    where: { userId },
    include: {
      loyaltyProgram: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function LoyaltyPage() {
  const user = await requireAuth("CUSTOMER");
  const [loyaltyPrograms, userPoints, userRedemptions] = await Promise.all([
    getLoyaltyPrograms(),
    getUserPoints(user.id),
    getUserRedemptions(user.id),
  ]);

  return (
    <LoyaltyClient
      loyaltyPrograms={loyaltyPrograms}
      userPoints={userPoints}
      userRedemptions={userRedemptions}
    />
  );
}
