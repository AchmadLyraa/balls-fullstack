import { requireAuth } from "@/lib/server-auth";
import TransactionsClient from "./transactions-client";

export default async function TransactionsPage() {
  const user = await requireAuth("CUSTOMER");

  return <TransactionsClient user={user} />;
}
