import { requireCustomerAuth } from "@/lib/server-auth"
import BookingClient from "./booking-client"

export default async function BookingPage() {
  const user = await requireCustomerAuth()

  return <BookingClient user={user} />
}
