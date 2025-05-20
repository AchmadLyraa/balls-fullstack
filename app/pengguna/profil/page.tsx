import { requireAuth } from "@/lib/server-auth";
import { getUserById } from "@/lib/auth";
import ProfileForm from "./profile-form";

export default async function ProfilePage() {
  const user = await requireAuth("CUSTOMER");
  const userDetails = await getUserById(user.id);

  if (!userDetails) {
    return <div>User not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and profile information
        </p>
      </div>

      <ProfileForm user={userDetails} />
    </div>
  );
}
