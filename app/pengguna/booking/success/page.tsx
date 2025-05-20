import { requireAuth } from "@/lib/server-auth";
import SuccessClient from "./success-client";

export default async function SuccessPage() {
  const user = await requireAuth("CUSTOMER");

  return <SuccessClient user={user} />;
}
