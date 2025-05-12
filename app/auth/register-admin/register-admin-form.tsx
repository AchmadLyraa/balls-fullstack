"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { registerUser } from "@/app/actions/auth"
import { useState } from "react"
import { toast } from "sonner"
import { UserRole } from "@prisma/client"

export default function RegisterAdminForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    try {
      // Add the role to the form data
      formData.append("role", role)

      const result = await registerUser(formData)

      if (result && !result.success) {
        setError(result.error)
        toast.error(result.error)
      } else {
        toast.success("Admin registered successfully")
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
          <Label htmlFor="phoneNumber">No. Tlp Admin</Label>
          <Input id="phoneNumber" name="phoneNumber" type="tel" placeholder="No. Tlp Admin" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select defaultValue={role} onValueChange={(value) => setRole(value as UserRole)}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
              <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <Button type="submit" className="w-full bg-red-700 hover:bg-red-800" disabled={isLoading}>
        {isLoading ? "Registering..." : "Register"}
      </Button>
    </form>
  )
}
