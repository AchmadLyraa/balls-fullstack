"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginUser } from "@/app/actions/auth"
import { useState } from "react"
import { toast } from "sonner"

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await loginUser(formData)

      if (result && !result.success) {
        setError(result.message)
        toast.error(result.message)
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
      toast.error("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="emailOrUsername">Your Email or Username</Label>
          <Input id="emailOrUsername" name="emailOrUsername" type="text" placeholder="Email or username" required />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Your Password</Label>
            <a href="/auth/forgot-password" className="text-sm text-red-700 hover:underline">
              Forgot password?
            </a>
          </div>
          <Input id="password" name="password" type="password" placeholder="••••••••" required />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="text-sm font-normal">
            Remember me
          </Label>
        </div>
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <Button type="submit" className="w-full bg-red-700 hover:bg-red-800" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
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
