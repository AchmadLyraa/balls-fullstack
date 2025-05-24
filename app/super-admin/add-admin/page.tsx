import { requireAuth } from "@/lib/server-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AdminForm from "./admin-form";

export default async function AddAdminPage() {
  await requireAuth("SUPER_ADMIN");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add New Admin</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Information</CardTitle>
          <CardDescription>
            Enter the details for the new admin account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminForm />
        </CardContent>
      </Card>
    </div>
  );
}
