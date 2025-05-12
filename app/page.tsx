import { Button } from "@/components/ui/button"
import { getUser } from "@/lib/auth"
import { UserRole } from "@prisma/client"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Home() {
  const user = await getUser()

  // Redirect authenticated users to their respective dashboards
  if (user) {
    switch (user.role) {
      case UserRole.CUSTOMER:
        redirect("/pengguna")
      case UserRole.ADMIN:
        redirect("/admin")
      case UserRole.SUPER_ADMIN:
        redirect("/super-admin")
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-red-700 to-red-900 text-white">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16 text-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Borneo Anfield Loyalty System
          </h1>
          <p className="text-xl">Book your field and earn rewards with our loyalty program</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/auth/login">
            <Button size="lg" className="bg-white text-red-700 hover:bg-gray-100">
              Login
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Register
            </Button>
          </Link>
        </div>

        <div className="mt-8">
          <p className="text-sm">
            Are you an admin?{" "}
            <Link href="/auth/login-admin" className="underline hover:text-gray-200">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
