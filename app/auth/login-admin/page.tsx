import { redirectIfAuthenticated } from "@/lib/server-auth"
import LoginAdminForm from "./login-admin-form"

export default async function LoginAdminPage() {
  await redirectIfAuthenticated()

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/placeholder.svg')] bg-cover bg-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg bg-opacity-95">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-700">BALLS</h1>
          <h2 className="text-xl font-semibold">Borneo Anfield Loyalty System</h2>
          <p className="mt-2 text-gray-600">Admin Login</p>
          <p className="text-sm text-gray-500">Sign in to continue to admin dashboard</p>
        </div>

        <LoginAdminForm />
      </div>
    </div>
  )
}
