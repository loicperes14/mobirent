"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { Car, Calendar, DollarSign, User, LogOut, Menu, X, Building2, CreditCard } from "lucide-react"
import Link from "next/link"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, userProfile, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAccess()
  }, [user, userProfile])

  const checkAccess = async () => {
    if (!user || !userProfile) {
      router.push("/auth")
      return
    }

    if (userProfile.role !== "admin" || !userProfile.rental_service_id) {
      router.push("/dashboard")
      return
    }

    // Check if rental service is approved
    try {
      const { data: service, error } = await supabase
        .from("rental_services")
        .select("status")
        .eq("id", userProfile.rental_service_id)
        .single()

      if (error) throw error

      if (service.status !== "approved") {
        router.push("/admin-pending")
        return
      }

      setLoading(false)
    } catch (error) {
      console.error("Error checking service status:", error)
      router.push("/admin-pending")
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: Building2 },
    { name: "Cars", href: "/admin/cars", icon: Car },
    { name: "Bookings", href: "/admin/bookings", icon: Calendar },
    { name: "Payments", href: "/admin/payments", icon: DollarSign },
    { name: "Profile", href: "/admin/profile", icon: User },
    { name: "Payment Setup", href: "/admin/payment-setup", icon: CreditCard },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cameroon-green"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75" 
            onClick={() => setSidebarOpen(false)} 
            aria-hidden="true"
          />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:block w-64 bg-white shadow-lg h-screen
          transition-transform duration-300 ease-in-out z-30
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col border-r border-gray-200`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link href="/admin" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-cameroon-green" />
            <span className="text-xl font-bold text-gray-900">Admin Panel</span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden text-gray-500 hover:text-gray-700"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive 
                      ? "bg-cameroon-green text-white" 
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? "text-white" : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
            </div>
            <button
              onClick={handleSignOut}
              className="group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Sign Out
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-screen md:ml-64 transition-spacing duration-300">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="lg:hidden text-gray-500 hover:text-gray-700"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 truncate max-w-[200px]">
                Welcome, {userProfile?.full_name}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
