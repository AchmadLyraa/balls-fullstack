import { requireAuth } from "@/lib/server-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface EditAdminPageProps {
  params: {
    id: string;
  };
}

export default async function EditAdminPage({ params }: EditAdminPageProps) {
  await requireAuth("SUPER_ADMIN");

  // In a real application, you would fetch the admin data based on the ID
  const adminId = params.id;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Manajemen Admin BAS
        </h1>
        <p className="text-muted-foreground">
          Edit admin data for Azhka- Admin
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit data admin</CardTitle>
          <CardDescription>
            Update the admin account information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={`/super-admin/edit-admin/${adminId}`}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="username">Username admin</Label>
              <Input
                id="username"
                name="username"
                defaultValue="azhka"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">No. Tlp Admin</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                defaultValue="081234567890"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Leave blank to keep current password"
              />
            </div>

            <Button type="submit" className="w-full">
              Edit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
