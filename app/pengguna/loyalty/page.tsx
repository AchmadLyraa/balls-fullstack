import { requireAuth } from "@/lib/server-auth";
import LoyaltyClient from "./loyalty-client";

export default async function LoyaltyPage() {
  const user = await requireAuth("CUSTOMER");

  return <LoyaltyClient user={user} />;
}
