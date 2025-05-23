import { prisma, requireAuth } from "@/lib/server-auth";
import ProfileForm from "./profile-form";

export default async function ProfilePage() {
  const { id } = await requireAuth("CUSTOMER");
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and profile information
        </p>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}
