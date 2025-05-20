import type React from "react";
import { requireAuth } from "@/lib/server-auth";
import PenggunaHeader from "./pengguna-header";

export default async function PenggunaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth("CUSTOMER");

  return (
    <div className="flex min-h-screen flex-col">
      <PenggunaHeader user={user} />
      <main className="container mx-auto flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
