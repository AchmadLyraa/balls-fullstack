"use server"

import { PrismaClient } from "@prisma/client"
import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"

const prisma = new PrismaClient()

export async function getUserLoyaltyCard() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  try {
    // Find or create loyalty card
    let loyaltyCard = await prisma.loyaltyCard.findUnique({
      where: { userId: user.id },
    })

    if (!loyaltyCard) {
      loyaltyCard = await prisma.loyaltyCard.create({
        data: {
          userId: user.id,
          stamps: 0,
        },
      })
    }

    return loyaltyCard
  } catch (error) {
    console.error("Error fetching loyalty card:", error)
    return null
  }
}

export async function getAvailableRewards() {
  try {
    const rewards = await prisma.reward.findMany({
      where: { isActive: true },
      orderBy: { stampsRequired: "asc" },
    })

    return rewards
  } catch (error) {
    console.error("Error fetching rewards:", error)
    return []
  }
}

export async function redeemReward(rewardId: string) {
  const user = await getUser()

  if (!user) {
    return { success: false, error: "You must be logged in to redeem rewards" }
  }

  try {
    // Get reward details
    const reward = await prisma.reward.findUnique({
      where: { id: rewardId },
    })

    if (!reward) {
      return { success: false, error: "Reward not found" }
    }

    // Get user's loyalty card
    const loyaltyCard = await prisma.loyaltyCard.findUnique({
      where: { userId: user.id },
    })

    if (!loyaltyCard) {
      return { success: false, error: "Loyalty card not found" }
    }

    // Check if user has enough stamps
    if (loyaltyCard.stamps < reward.stampsRequired) {
      return { success: false, error: "Not enough stamps to redeem this reward" }
    }

    // Create redemption
    const redemption = await prisma.redemption.create({
      data: {
        userId: user.id,
        loyaltyCardId: loyaltyCard.id,
        rewardId: reward.id,
        stampsUsed: reward.stampsRequired,
        status: "PENDING",
      },
    })

    // Update loyalty card
    await prisma.loyaltyCard.update({
      where: { id: loyaltyCard.id },
      data: { stamps: loyaltyCard.stamps - reward.stampsRequired },
    })

    return { success: true, redemptionId: redemption.id }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    return { success: false, error: "An unknown error occurred" }
  }
}

export async function getUserRedemptions() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  try {
    const redemptions = await prisma.redemption.findMany({
      where: { userId: user.id },
      include: {
        reward: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return redemptions
  } catch (error) {
    console.error("Error fetching redemptions:", error)
    return []
  }
}
