"use server"

import { PrismaClient, BookingStatus, type PaymentStatus, UserRole } from "@prisma/client"
import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { z } from "zod"

const prisma = new PrismaClient()

// Validation schema for admin user
const adminUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  phoneNumber: z.string().optional(),
  role: z.enum([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
})

export async function getAllBookings() {
  const user = await getUser()

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    redirect("/auth/login-admin")
  }

  try {
    const bookings = await prisma.booking.findMany({
      include: {
        field: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            fullName: true,
            phoneNumber: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return bookings
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return []
  }
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  const user = await getUser()

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    })

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    return { success: false, error: "An unknown error occurred" }
  }
}

export async function updatePaymentStatus(paymentId: string, status: PaymentStatus) {
  const user = await getUser()

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status },
      include: { booking: true },
    })

    // If payment is confirmed, update booking status
    if (status === "PAID") {
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: BookingStatus.CONFIRMED },
      })

      // Add stamps to loyalty card (1 stamp per booking)
      const loyaltyCard = await prisma.loyaltyCard.findUnique({
        where: { userId: payment.userId },
      })

      if (loyaltyCard) {
        await prisma.loyaltyCard.update({
          where: { id: loyaltyCard.id },
          data: { stamps: loyaltyCard.stamps + 1 },
        })
      } else {
        await prisma.loyaltyCard.create({
          data: {
            userId: payment.userId,
            stamps: 1,
          },
        })
      }
    }

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    return { success: false, error: "An unknown error occurred" }
  }
}

export async function getAllRewards() {
  const user = await getUser()

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    redirect("/auth/login-admin")
  }

  try {
    const rewards = await prisma.reward.findMany({
      orderBy: { stampsRequired: "asc" },
    })

    return rewards
  } catch (error) {
    console.error("Error fetching rewards:", error)
    return []
  }
}

export async function createReward(formData: FormData) {
  const user = await getUser()

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const stampsRequired = Number.parseInt(formData.get("stampsRequired") as string)
  const imageFile = formData.get("image") as File

  try {
    // In a real application, you would upload the image to a storage service
    // and get a URL to store in the database
    const imageUrl = "/placeholder.svg" // Placeholder for demo

    const reward = await prisma.reward.create({
      data: {
        name,
        description,
        stampsRequired,
        imageUrl,
      },
    })

    return { success: true, rewardId: reward.id }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    return { success: false, error: "An unknown error occurred" }
  }
}

export async function updateReward(formData: FormData) {
  const user = await getUser()

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" }
  }

  const rewardId = formData.get("rewardId") as string
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const stampsRequired = Number.parseInt(formData.get("stampsRequired") as string)
  const isActive = formData.get("isActive") === "true"
  const imageFile = formData.get("image") as File | null

  try {
    // In a real application, you would upload the image to a storage service
    // and get a URL to store in the database
    const updateData: any = {
      name,
      description,
      stampsRequired,
      isActive,
    }

    if (imageFile) {
      updateData.imageUrl = "/placeholder.svg" // Placeholder for demo
    }

    const reward = await prisma.reward.update({
      where: { id: rewardId },
      data: updateData,
    })

    return { success: true, rewardId: reward.id }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    return { success: false, error: "An unknown error occurred" }
  }
}

export async function getAllRedemptions() {
  const user = await getUser()

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    redirect("/auth/login-admin")
  }

  try {
    const redemptions = await prisma.redemption.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            fullName: true,
          },
        },
        reward: true,
        loyaltyCard: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return redemptions
  } catch (error) {
    console.error("Error fetching redemptions:", error)
    return []
  }
}

export async function updateRedemptionStatus(redemptionId: string, status: string) {
  const user = await getUser()

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await prisma.redemption.update({
      where: { id: redemptionId },
      data: { status },
    })

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    return { success: false, error: "An unknown error occurred" }
  }
}

export async function getAllAdmins() {
  const user = await getUser()

  if (!user || user.role !== "SUPER_ADMIN") {
    redirect("/auth/login-admin")
  }

  try {
    const admins = await prisma.user.findMany({
      where: {
        role: { in: [UserRole.ADMIN, UserRole.SUPER_ADMIN] },
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return admins
  } catch (error) {
    console.error("Error fetching admins:", error)
    return []
  }
}

export async function createAdmin(formData: FormData) {
  const user = await getUser()

  if (!user || user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Unauthorized" }
  }

  const username = formData.get("username") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string
  const phoneNumber = (formData.get("phoneNumber") as string) || null
  const role = (formData.get("role") as UserRole) || UserRole.ADMIN

  try {
    // Validate form data
    adminUserSchema.parse({
      username,
      email,
      password,
      fullName,
      phoneNumber,
      role,
    })

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return { success: false, error: "Email already exists" }
      }
      if (existingUser.username === username) {
        return { success: false, error: "Username already exists" }
      }
    }

    // Hash password
    const bcrypt = require("bcryptjs")
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newAdmin = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        fullName,
        phoneNumber,
        role,
      },
    })

    return { success: true, adminId: newAdmin.id }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }

    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    return { success: false, error: "An unknown error occurred" }
  }
}

export async function updateAdmin(formData: FormData) {
  const user = await getUser()

  if (!user || user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Unauthorized" }
  }

  const adminId = formData.get("adminId") as string
  const username = formData.get("username") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string
  const phoneNumber = (formData.get("phoneNumber") as string) || null
  const isActive = formData.get("isActive") === "true"

  try {
    // Check if admin exists
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    })

    if (!admin) {
      return { success: false, error: "Admin not found" }
    }

    // Check if username or email is already taken by another user
    if (username !== admin.username || email !== admin.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email, id: { not: adminId } },
            { username, id: { not: adminId } },
          ],
        },
      })

      if (existingUser) {
        if (existingUser.email === email) {
          return { success: false, error: "Email already exists" }
        }
        if (existingUser.username === username) {
          return { success: false, error: "Username already exists" }
        }
      }
    }

    // Prepare update data
    const updateData: any = {
      username,
      email,
      fullName,
      phoneNumber,
      isActive,
    }

    // Hash password if provided
    if (password) {
      const bcrypt = require("bcryptjs")
      updateData.password = await bcrypt.hash(password, 10)
    }

    // Update admin
    await prisma.user.update({
      where: { id: adminId },
      data: updateData,
    })

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    return { success: false, error: "An unknown error occurred" }
  }
}

export async function deleteAdmin(adminId: string) {
  const user = await getUser()

  if (!user || user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Unauthorized" }
  }

  try {
    // Check if admin exists
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    })

    if (!admin) {
      return { success: false, error: "Admin not found" }
    }

    // Prevent deleting yourself
    if (admin.id === user.id) {
      return { success: false, error: "You cannot delete your own account" }
    }

    // Delete admin
    await prisma.user.delete({
      where: { id: adminId },
    })

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    return { success: false, error: "An unknown error occurred" }
  }
}
