import { requireCustomerAuth } from "@/lib/server-auth"
import SuccessClient from "./success-client"

export default async function SuccessPage() {
  const user = await requireCustomerAuth()

  return <SuccessClient user={user} />
}
