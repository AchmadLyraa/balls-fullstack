import type React from "react";
import { requireAuth } from "@/lib/server-auth";
import SuperAdminSidebar from "./super-admin-sidebar";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth("SUPER_ADMIN");

  return (
    <div className="flex min-h-screen">
      <SuperAdminSidebar user={user} />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
