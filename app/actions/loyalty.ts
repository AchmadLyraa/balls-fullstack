"use server";

import fluent from "fluent-methods";
import sharp from "sharp";
import { RedemptionStatus, SourceType } from "@prisma/client";
import { prisma, getUser } from "@/lib/server-auth";
import { revalidatePath } from "next/cache";
import z from "zod";
import { getLoyaltyFormSchema } from "../admin/loyalty/schema";

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
      where: { id: programId, deletedAt: null },
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

    revalidatePath("/admin/loyalty");
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

export async function changeRedemptionStatus(
  redemptionId: string,
  newStatus: string,
) {
  const user = await getUser();

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  if (newStatus !== "COMPLETED" && newStatus !== "CANCELLED") {
    return { success: false, error: "Invalid status" };
  }

  const [redemption] = await prisma.redemption.updateManyAndReturn({
    where: { id: redemptionId },
    data: { status: newStatus },
  });

  if (!redemption) {
    return { success: false, error: "Redemption not found" };
  }

  if (newStatus === "CANCELLED") {
    await Promise.all([
      prisma.userPoint.create({
        data: {
          userId: redemption.userId,
          points: redemption.pointsUsed,
          isActive: true,
          expiryDate: fluent(redemption.redemptionDate).setFullYear(
            redemption.redemptionDate.getFullYear() + 1,
          ),
        },
      }),

      prisma.pointSource.create({
        data: {
          sourceId: redemptionId,
          sourceType: "REFUND",
          userId: redemption.userId,
          points: redemption.pointsUsed,
        },
      }),
    ]);
  }

  revalidatePath("/admin/loyalty");
  revalidatePath("/pengguna/loyalty");

  return { success: true, message: "Redemption status changed successfully" };
}

export async function editLoyaltyProgram(
  programId: string,
  rawData: z.infer<ReturnType<typeof getLoyaltyFormSchema>>,
) {
  const user = await getUser();

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { thumbnail, ...data } = getLoyaltyFormSchema(true).parse(rawData);

    const promises: Promise<unknown>[] = [
      prisma.loyaltyProgram.update({
        where: { id: programId },
        data: data,
      }),
    ];

    if (thumbnail) {
      promises.push(
        thumbnail.bytes().then((bytes) => {
          return sharp(bytes)
            .webp()
            .toFile(`./public/content/loyalty/${programId}.webp`);
        }),
      );
    }

    await Promise.all(promises);

    revalidatePath("/admin/loyalty");
    revalidatePath("/pengguna/loyalty");

    return { success: true, message: "Loyalty program edited successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }

    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "An unknown error occurred" };
  }
}

export async function createLoyaltyProgram(
  rawData: z.infer<ReturnType<typeof getLoyaltyFormSchema>>,
) {
  const user = await getUser();

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { thumbnail, ...data } = getLoyaltyFormSchema(false).parse(rawData);
    const imagePromise = thumbnail!
      .bytes()
      .then((bytes) => sharp(bytes).webp());
    const loyalty = await prisma.loyaltyProgram.create({
      data,
    });

    await (
      await imagePromise
    ).toFile(`./public/content/loyalty/${loyalty.id}.webp`);

    revalidatePath("/admin/loyalty");
    revalidatePath("/pengguna/loyalty");

    return { success: true, message: "Loyalty program created successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }

    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "An unknown error occurred" };
  }
}

export async function deleteLoyaltyProgram(programId: string) {
  const user = await getUser();

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  await prisma.loyaltyProgram.update({
    where: { id: programId },
    data: {
      deletedAt: new Date(),
    },
  });

  revalidatePath("admin/loyalty");

  return { success: true, message: "Loyalty program deleted" };
}
