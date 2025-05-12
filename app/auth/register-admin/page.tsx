import RegisterAdminForm from "./register-admin-form"
import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { UserRole } from "@prisma/client"

export default async function RegisterAdminPage() {
  const user = await getUser()

  // Only super admin can access this page
  if (user && user.role !== UserRole.SUPER_ADMIN) {
    redirect("/")
  }

  if (!user) {
    redirect("/auth/login-admin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/placeholder.svg')] bg-cover bg-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg bg-opacity-95">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-700">BALLS</h1>
          <h2 className="text-xl font-semibold">Borneo Anfield Loyalty System</h2>
          <p className="mt-2 text-gray-600">Register Admin</p>
          <p className="text-sm text-gray-500">Create a new admin account</p>
        </div>

        <RegisterAdminForm />
      </div>
    </div>
  )
}
