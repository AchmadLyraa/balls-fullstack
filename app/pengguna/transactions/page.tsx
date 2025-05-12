import { requireCustomerAuth } from "@/lib/server-auth"
import TransactionsClient from "./transactions-client"

export default async function TransactionsPage() {
  const user = await requireCustomerAuth()

  return <TransactionsClient user={user} />
}
