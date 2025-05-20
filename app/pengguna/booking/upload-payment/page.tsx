import { requireAuth } from "@/lib/server-auth";
import UploadPaymentClient from "./upload-payment-client";

export default async function UploadPaymentPage() {
  const user = await requireAuth("CUSTOMER");

  return <UploadPaymentClient user={user} />;
}
