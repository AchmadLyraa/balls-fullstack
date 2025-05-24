import { prisma, requireAuth } from "@/lib/server-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminForm from "./admin-form";

interface EditAdminPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAdminPage({ params }: EditAdminPageProps) {
  await requireAuth("SUPER_ADMIN");

  const { id } = await params;

  const admin = await prisma.user.findUnique({
    where: { id, role: "ADMIN" },
    select: {
      username: true,
      fullName: true,
      email: true,
      phoneNumber: true,
    },
  });

  if (!admin) {
    return <div>Admin not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Admin Data</h1>
      </div>

      <Card>
        <CardHeader aria-describedby={undefined}>
          <CardTitle>Admin Information</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminForm adminId={id} admin={admin} />
        </CardContent>
      </Card>
    </div>
  );
}
