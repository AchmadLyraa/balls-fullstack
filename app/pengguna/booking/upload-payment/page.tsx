import { requireCustomerAuth } from "@/lib/server-auth"
import UploadPaymentClient from "./upload-payment-client"

export default async function UploadPaymentPage() {
  const user = await requireCustomerAuth()

  return <UploadPaymentClient user={user} />
}
