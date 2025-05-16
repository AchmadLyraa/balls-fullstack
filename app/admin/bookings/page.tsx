import { requireAdminAuth } from "@/lib/server-auth"
import BookingsClient from "./components/bookings-client"

export default async function BookingsPage() {
  await requireAdminAuth()

  return <BookingsClient />
}
