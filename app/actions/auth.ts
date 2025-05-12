"use server"

import { signIn, signOut, signUp } from "@/lib/auth"
import { UserRole } from "@prisma/client"
import { redirect } from "next/navigation"
import { z } from "zod"

// Validation schemas
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  phoneNumber: z.string().optional(),
  role: z.enum([UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
})

const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
})

export async function registerUser(formData: FormData) {
  const username = formData.get("username") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string
  const phoneNumber = (formData.get("phoneNumber") as string) || null
  const role = (formData.get("role") as UserRole) || UserRole.CUSTOMER

  try {
    // Validate form data
    registerSchema.parse({
      username,
      email,
      password,
      fullName,
      phoneNumber,
      role,
    })

    // Register user
    await signUp(username, email, password, fullName, phoneNumber, role)

    // Redirect based on role
    if (role === UserRole.CUSTOMER) {
      redirect("/auth/login")
    } else {
      redirect("/auth/login-admin")
    }
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

export async function loginUser(formData: FormData) {
  const emailOrUsername = formData.get("emailOrUsername") as string
  const password = formData.get("password") as string

  try {
    // Validate form data
    loginSchema.parse({
      emailOrUsername,
      password,
    })

    // Login user
    const user = await signIn(emailOrUsername, password)

    // Redirect based on role
    if (user.role === UserRole.CUSTOMER) {
      redirect("/pengguna")
    } else if (user.role === UserRole.ADMIN) {
      redirect("/admin")
    } else if (user.role === UserRole.SUPER_ADMIN) {
      redirect("/super-admin")
    }
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

export async function logoutUser() {
  await signOut()
  redirect("/auth/login")
}
