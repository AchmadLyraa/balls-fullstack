import { requireAuth } from "@/lib/server-auth";

export default async function BookingPage() {
  const user = await requireAuth("CUSTOMER");

  return <BookingClient user={user} />;
}
