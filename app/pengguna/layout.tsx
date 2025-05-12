import type React from "react"
import { requireCustomerAuth } from "@/lib/server-auth"
import PenggunaHeader from "./pengguna-header"

export default async function PenggunaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireCustomerAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <PenggunaHeader user={user} />
      <main className="flex-1 container mx-auto py-6 px-4">{children}</main>
    </div>
  )
}
