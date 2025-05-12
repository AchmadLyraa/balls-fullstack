import type React from "react"
import { requireSuperAdminAuth } from "@/lib/server-auth"
import SuperAdminSidebar from "./super-admin-sidebar"

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireSuperAdminAuth()

  return (
    <div className="min-h-screen flex">
      <SuperAdminSidebar user={user} />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  )
}
