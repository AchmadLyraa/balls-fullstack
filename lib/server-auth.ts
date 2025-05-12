import { redirect } from "next/navigation"
import { getUser } from "./auth"
import { UserRole } from "@prisma/client"

export async function requireAuth() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return user
}

export async function requireCustomerAuth() {
  const user = await requireAuth()

  if (user.role !== UserRole.CUSTOMER) {
    redirect("/auth/login")
  }

  return user
}

export async function requireAdminAuth() {
  const user = await requireAuth()

  if (user.role !== UserRole.ADMIN) {
    redirect("/auth/login-admin")
  }

  return user
}

export async function requireSuperAdminAuth() {
  const user = await requireAuth()

  if (user.role !== UserRole.SUPER_ADMIN) {
    redirect("/auth/login-admin")
  }

  return user
}

export async function redirectIfAuthenticated() {
  const user = await getUser()

  if (!user) {
    return null
  }

  switch (user.role) {
    case UserRole.CUSTOMER:
      redirect("/pengguna")
    case UserRole.ADMIN:
      redirect("/admin")
    case UserRole.SUPER_ADMIN:
      redirect("/super-admin")
    default:
      redirect("/")
  }
}
