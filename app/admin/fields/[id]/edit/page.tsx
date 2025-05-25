import { prisma, requireAuth } from "@/lib/server-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FieldForm from "./field-form";

interface EditFieldPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditFieldPage({ params }: EditFieldPageProps) {
  await requireAuth("ADMIN");

  const { id } = await params;

  const field = await prisma.field.findUnique({
    where: { id },
    select: {
      name: true,
      description: true,
      capacity: true,
      hourlyRate: true,
    },
  });

  if (!field) {
    return <div>Field not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Field Data</h1>
      </div>

      <Card>
        <CardHeader aria-describedby={undefined}>
          <CardTitle>Field Information</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldForm fieldId={id} field={field} />
        </CardContent>
      </Card>
    </div>
  );
}
