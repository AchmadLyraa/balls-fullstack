import { requireAdminAuth } from "@/lib/server-auth"
import BookingsClient from "./bookings-client"

export default async function BookingsPage() {
  await requireAdminAuth()

  return <BookingsClient />
}
