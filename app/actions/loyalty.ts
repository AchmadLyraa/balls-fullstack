"use server";

import { RedemptionStatus, SourceType } from "@prisma/client";
import { prisma, getUser } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export async function getUserPoints() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  try {
    // Find user points
    let userPoint = await prisma.userPoint.findFirst({
      where: { userId: user.id, isActive: true },
    });

    if (!userPoint) {
      userPoint = await prisma.userPoint.create({
        data: {
          userId: user.id,
          points: 0,
          isActive: true,
          expiryDate: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1),
          ),
        },
      });
    }

    return userPoint;
  } catch (error) {
    console.error("Error fetching user points:", error);
    return null;
  }
}

export async function getLoyaltyPrograms() {
  try {
    const programs = await prisma.loyaltyProgram.findMany({
      where: { isActive: true },
      orderBy: { pointsRequired: "asc" },
    });

    return programs;
  } catch (error) {
    console.error("Error fetching loyalty programs:", error);
    return [];
  }
}

export async function redeemLoyaltyProgram(programId: string) {
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
    const userPoint = await prisma.userPoint.findFirst({
      where: { userId: user.id, isActive: true },
    });

    if (!userPoint) {
      return { success: false, error: "User points not found" };
    }

    // Check if user has enough points
    if (userPoint.points < program.pointsRequired) {
      return {
        success: false,
        error: "Not enough points to redeem this reward",
      };
    }

    // Create redemption
    const redemption = await prisma.redemption.create({
      data: {
        userId: user.id,
        loyaltyProgramId: program.id,
        pointsUsed: program.pointsRequired,
        status: RedemptionStatus.PENDING,
      },
    });

    // Update user points
    await prisma.userPoint.update({
      where: { id: userPoint.id },
      data: { points: userPoint.points - program.pointsRequired },
    });

    // Create point source record
    await prisma.pointSource.create({
      data: {
        userId: user.id,
        sourceId: redemption.id,
        points: -program.pointsRequired,
        sourceType: SourceType.REDEMPTION,
      },
    });

    return { success: true, redemptionId: redemption.id };
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
