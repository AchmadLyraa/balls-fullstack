"use server"

import { PrismaClient } from "@prisma/client"
import { getUser } from "@/lib/auth"
import { z } from "zod"

const prisma = new PrismaClient()

// Validation schema
const updateProfileSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  phoneNumber: z.string().optional(),
})

export async function updateProfile(formData: FormData) {
  const user = await getUser()

  if (!user) {
    return { success: false, error: "You must be logged in to update your profile" }
  }

  const fullName = formData.get("fullName") as string
  const phoneNumber = (formData.get("phoneNumber") as string) || null

  try {
    // Validate form data
    updateProfileSchema.parse({
      fullName,
      phoneNumber,
    })

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        fullName,
        phoneNumber,
      },
    })

    return { success: true }
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

export async function changePassword(formData: FormData) {
  const user = await getUser()

  if (!user) {
    return { success: false, error: "You must be logged in to change your password" }
  }

  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string
  const confirmPassword = formData.get("confirmPassword") as string

  try {
    // Validate passwords
    if (newPassword !== confirmPassword) {
      return { success: false, error: "New passwords do not match" }
    }

    if (newPassword.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" }
    }

    // Get user with password
    const userWithPassword = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (!userWithPassword) {
      return { success: false, error: "User not found" }
    }

    // Verify current password
    const bcrypt = require("bcryptjs")
    const isPasswordValid = await bcrypt.compare(currentPassword, userWithPassword.password)

    if (!isPasswordValid) {
      return { success: false, error: "Current password is incorrect" }
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    })

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    return { success: false, error: "An unknown error occurred" }
  }
}
