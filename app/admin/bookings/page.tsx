import { requireAuth } from "@/lib/server-auth";
import BookingsClient from "./components/bookings-client";

export default async function BookingsPage() {
  await requireAuth("ADMIN");

  return <BookingsClient />;
}
