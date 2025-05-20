import { prisma, requireAuth } from "@/lib/server-auth";
import TransactionsClient from "./transactions-client";
import { getUserBookings } from "@/app/actions/booking";

export default async function TransactionsPage() {
  const user = await requireAuth("CUSTOMER");

  const transactions = await getUserBookings(user);

  return <TransactionsClient transactions={transactions} />;
}
