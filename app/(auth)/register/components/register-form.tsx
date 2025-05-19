"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerUser } from "@/app/actions/auth"
import { useState } from "react"
import { toast } from "sonner"

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    try {
      // Add the role to the form data
      formData.append("role", "CUSTOMER")

      const result = await registerUser(formData)

      if (result && !result.success) {
        setError(result.message)
        toast.error(result.message)
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
      toast.error("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" name="username" type="text" placeholder="Username" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="Email" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" placeholder="••••••••" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">Nama Lengkap</Label>
          <Input id="fullName" name="fullName" type="text" placeholder="Nama Lengkap" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">No. Telepon</Label>
          <Input id="phoneNumber" name="phoneNumber" type="tel" placeholder="No. Telepon" />
        </div>
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <Button type="submit" className="w-full bg-red-700 hover:bg-red-800" disabled={isLoading}>
        {isLoading ? "Registering..." : "Register"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">or continue with</span>
        </div>
      </div>

      <Button type="button" variant="outline" className="w-full" disabled={isLoading}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M17.13 17.13v-4.26l-3.2 3.2a4.33 4.33 0 0 1-6.13-6.13l3.2-3.2h-4.26" />
        </svg>
        Google
      </Button>
    </form>
  )
}
