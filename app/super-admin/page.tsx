import { prisma, requireAuth } from "@/lib/server-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Plus, Users } from "lucide-react";
import AdminList from "./admin-list";

export default async function SuperAdminDashboardPage() {
  const user = await requireAuth("SUPER_ADMIN");

  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Admin BAS Management
        </h1>
        <p className="text-muted-foreground">
          Welcome, {user.username}! Manage your admin accounts here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admins.length}</div>
            <p className="text-xs text-muted-foreground">
              Active admin accounts
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Admin Accounts</h2>
          <Link href="/super-admin/add-admin">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Admin
            </Button>
          </Link>
        </div>

        <AdminList admins={admins} />
      </div>
    </div>
  );
}
