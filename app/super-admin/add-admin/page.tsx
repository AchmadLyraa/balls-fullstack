import { requireSuperAdminAuth } from "@/lib/server-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default async function AddAdminPage() {
  await requireSuperAdminAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tambah admin baru</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Information</CardTitle>
          <CardDescription>Enter the details for the new admin account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action="/super-admin/add-admin" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username admin</Label>
              <Input id="username" name="username" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Admin</Label>
              <Input id="email" name="email" type="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input id="fullName" name="fullName" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">No. Tlp Admin</Label>
              <Input id="phoneNumber" name="phoneNumber" />
            </div>

            <Button type="submit" className="w-full">
              Tambah Admin
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
