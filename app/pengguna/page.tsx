import { requireAuth } from "@/lib/server-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CalendarDays, CreditCard } from "lucide-react";

export default async function PenggunaPage() {
  const user = await requireAuth("CUSTOMER");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome, {user.username}!
        </h1>
        <p className="text-muted-foreground">
          Borneo Anfield Stadium - Your one-stop solution for field booking and
          loyalty rewards.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Book a Field</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Reserve Now</div>
            <p className="text-xs text-muted-foreground">
              Book your preferred field and time slot
            </p>
            <div className="mt-4">
              <Link href="/pengguna/booking">
                <Button className="w-full">Book a Field</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Loyalty Rewards
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Check Rewards</div>
            <p className="text-xs text-muted-foreground">
              View your loyalty points and available rewards
            </p>
            <div className="mt-4">
              <Link href="/pengguna/loyalty">
                <Button className="w-full">View Rewards</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">View History</div>
            <p className="text-xs text-muted-foreground">
              Check your booking history and upcoming reservations
            </p>
            <div className="mt-4">
              <Link href="/pengguna/transactions">
                <Button variant="outline" className="w-full">
                  View Bookings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Manage Profile</div>
            <p className="text-xs text-muted-foreground">
              Update your personal information and preferences
            </p>
            <div className="mt-4">
              <Link href="/pengguna/profil">
                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Support</div>
            <p className="text-xs text-muted-foreground">
              Contact our support team for assistance
            </p>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
