"use client"

import type { UserJwtPayload } from "@/lib/auth"
import { useAuth } from "@/lib/client-auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LogOut, Users } from "lucide-react"

interface SuperAdminSidebarProps {
  user: UserJwtPayload
}

export default function SuperAdminSidebar({ user }: SuperAdminSidebarProps) {
  const { logout } = useAuth()
  const pathname = usePathname()

  const navItems = [
    { href: "/super-admin", label: "Dashboard", icon: Home },
    { href: "/super-admin/add-admin", label: "Add Admin", icon: Users },
  ]

  return (
    <div className="min-h-screen w-64 bg-slate-800 text-white flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
            <span className="font-bold">{user.username.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h2 className="font-bold">Super Admin BAS</h2>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors",
                isActive ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:bg-slate-700 hover:text-white"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}
