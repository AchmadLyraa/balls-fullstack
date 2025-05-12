import type React from "react"
import { requireAdminAuth } from "@/lib/server-auth"
import AdminSidebar from "../components/admin/Sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAdminAuth()

  return (
    <div className="min-h-screen flex">
      <AdminSidebar user={user} />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  )
}
