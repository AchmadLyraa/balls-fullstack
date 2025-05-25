import { requireAuth } from "@/lib/server-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FieldForm from "./field-form";

export default async function AddAdminPage() {
  await requireAuth("ADMIN");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add New Field</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Field Information</CardTitle>
          <CardDescription>
            Enter the details for the new field.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldForm />
        </CardContent>
      </Card>
    </div>
  );
}
