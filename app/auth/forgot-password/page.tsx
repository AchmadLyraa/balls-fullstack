import { redirectIfAuthenticated } from "@/lib/server-auth"
import ForgotPasswordForm from "./forgot-password-form"

export default async function ForgotPasswordPage() {
  await redirectIfAuthenticated()

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/placeholder.svg')] bg-cover bg-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg bg-opacity-95">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-700">BALLS</h1>
          <h2 className="text-xl font-semibold">Borneo Anfield Loyalty System</h2>
          <p className="mt-2 text-gray-600">Forgot Password</p>
          <p className="text-sm text-gray-500">Enter your email to reset your password</p>
        </div>

        <ForgotPasswordForm />

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <a href="/auth/login" className="text-red-700 hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
