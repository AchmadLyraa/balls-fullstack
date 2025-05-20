import type React from "react";
import { requireAuth } from "@/lib/server-auth";
import AdminSidebar from "./admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth("ADMIN");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar user={user} />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
