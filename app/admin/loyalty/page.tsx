import { prisma, requireAuth } from "@/lib/server-auth";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Rewards from "./rewards";
import Redemptions from "./redemptions";

export function getRewards() {
  return prisma.loyaltyProgram.findMany({
    where: { deletedAt: null },
    orderBy: { id: "desc" },
  });
}

export function getRedemptions() {
  return prisma.redemption.findMany({
    include: {
      loyaltyProgram: {
        select: {
          programName: true,
        },
      },
      user: {
        select: {
          fullName: true,
        },
      },
    },
    orderBy: { id: "desc" },
  });
}

export default async function LoyaltyPage() {
  await requireAuth("ADMIN");

  const rewards = await getRewards();
  const redemptions = await getRedemptions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Loyalty Management
        </h1>
      </div>

      <Tabs defaultValue="rewards" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="redemptions">Redemptions</TabsTrigger>
        </TabsList>

        <Rewards rewards={rewards} />

        <Redemptions redemptions={redemptions} />
      </Tabs>
    </div>
  );
}
