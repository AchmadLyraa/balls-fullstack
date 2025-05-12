"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginUser } from "@/app/actions/auth"
import { useState } from "react"
import { toast } from "sonner"

export default function LoginAdminForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await loginUser(formData)

      if (result && !result.success) {
        setError(result.error)
        toast.error(result.error)
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
          <Label htmlFor="emailOrUsername">Admin Email or Username</Label>
          <Input
            id="emailOrUsername"
            name="emailOrUsername"
            type="text"
            placeholder="Admin email or username"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
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
    </form>
  )
}
