"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  BarChart3,
  Users,
  Settings,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

// Define base navigation items
const baseNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/dashboard/projects", icon: FolderOpen },
  { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
]

// Admin-only navigation
const adminNavigation = [
  { name: "Users", href: "/dashboard/users", icon: Users },
]

export function Sidebar() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  // Remove Analytics from navigation if user role is "user"
  const filteredNavigation =
    user?.role === "admin"
      ? [...baseNavigation, ...adminNavigation]
      : baseNavigation.filter((item) => item.name !== "Analytics")

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      <div className="flex items-center justify-center h-16 px-4 bg-primary">
        <h1 className="text-xl font-bold text-white">PM Tracker</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <Button onClick={signOut} variant="outline" size="sm" className="w-full">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
