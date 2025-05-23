"use server";

import { RedemptionStatus, SourceType } from "@prisma/client";
import { prisma, getUser } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function redeemLoyaltyProgram(programId: string): Promise<
  | {
      success: false;
      redemptionId?: undefined;
      programId?: undefined;
      error: string;
    }
  | {
      success: true;
      redemptionId: string;
      programId: string;
      error?: undefined;
    }
> {
  const user = await getUser();

  if (!user) {
    return { success: false, error: "You must be logged in to redeem rewards" };
  }

  try {
    // Get program details
    const program = await prisma.loyaltyProgram.findUnique({
      where: { id: programId },
    });

    if (!program) {
      return { success: false, error: "Loyalty program not found" };
    }

    // Get user's points
    const userPoints = await prisma.userPoint.findMany({
      where: {
        userId: user.id,
        isActive: true,
        points: {
          gt: 0,
        },
        expiryDate: {
          gt: new Date(),
        },
      },
      orderBy: [
        {
          expiryDate: "asc",
        },
        {
          createdAt: "asc",
        },
      ],
    });

    if (!userPoints.length) {
      return { success: false, error: "User points not found" };
    }

    const points = userPoints.reduce((total, point) => {
      return total + point.points;
    }, 0);

    // Check if user has enough points
    if (points < program.pointsRequired) {
      return {
        success: false,
        error: "Not enough points to redeem this reward",
      };
    }

    let reducedPoints = 0;
    let requiredPoints = program.pointsRequired;
    const updatePromises: Promise<unknown>[] = [];

    for (const point of userPoints) {
      const reduce = Math.min(point.points, requiredPoints);
      reducedPoints += reduce;
      requiredPoints -= reduce;

      updatePromises.push(
        prisma.userPoint.update({
          where: { id: point.id },
          data: { points: point.points - reduce },
        }),
      );

      if (requiredPoints <= 0) {
        break;
      }
    }

    const [redemption] = await Promise.all([
      prisma.redemption.create({
        data: {
          userId: user.id,
          loyaltyProgramId: program.id,
          pointsUsed: program.pointsRequired,
          status: RedemptionStatus.PENDING,
        },
      }),
      ...updatePromises,
    ]);

    // Create point source record
    await prisma.pointSource.create({
      data: {
        userId: user.id,
        sourceId: redemption.id,
        points: -program.pointsRequired,
        sourceType: SourceType.REDEMPTION,
      },
    });

    revalidatePath("/pengguna/loyalty");

    return {
      success: true,
      redemptionId: redemption.id,
      programId: program.id,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "An unknown error occurred" };
  }
}

export async function getUserRedemptions() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  try {
    const redemptions = await prisma.redemption.findMany({
      where: { userId: user.id },
      include: {
        loyaltyProgram: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return redemptions;
  } catch (error) {
    console.error("Error fetching redemptions:", error);
    return [];
  }
}

export async function getPointHistory() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  try {
    const pointSources = await prisma.pointSource.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return pointSources;
  } catch (error) {
    console.error("Error fetching point history:", error);
    return [];
  }
}
