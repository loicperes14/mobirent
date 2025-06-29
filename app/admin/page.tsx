"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { supabase, type RentalService } from "@/lib/supabase"
import AdminLayout from "@/components/AdminLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Calendar, DollarSign, Users, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalCars: number
  totalBookings: number
  totalRevenue: number
  pendingBookings: number
  activeBookings: number
  completedBookings: number
}

export default function AdminDashboard() {
  const { user, userProfile } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
  })
  const [rentalService, setRentalService] = useState<RentalService | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !userProfile) {
      router.push("/auth")
      return
    }

    if (userProfile.role !== "admin" || !userProfile.rental_service_id) {
      router.push("/dashboard")
      return
    }

    checkApprovalStatus()
  }, [user, userProfile, router])

  const checkApprovalStatus = async () => {
    try {
      const { data: service, error } = await supabase
        .from("rental_services")
        .select("*")
        .eq("id", userProfile!.rental_service_id)
        .single()

      if (error) throw error

      if (service.status !== "approved") {
        router.push("/admin-pending")
        return
      }

      setRentalService(service)
      await fetchDashboardStats()
    } catch (error) {
      console.error("Error checking approval status:", error)
      router.push("/admin-pending")
    } finally {
      setLoading(false)
    }
  }

  const fetchDashboardStats = async () => {
    try {
      // Fetch cars count
      const { count: carsCount } = await supabase
        .from("cars")
        .select("*", { count: "exact", head: true })
        .eq("rental_service_id", userProfile!.rental_service_id)

      // Fetch bookings data
      const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select(`
          *,
          car:cars!inner(rental_service_id)
        `)
        .eq("car.rental_service_id", userProfile!.rental_service_id)

      if (bookingsError) throw bookingsError

      // Calculate stats
      const totalRevenue = bookings?.filter((b) => b.payment_status ==="paid").reduce((sum, booking) => sum + booking.total_price, 0) || 0
      const pendingBookings =
        bookings?.filter((b) => b.booking_status === "confirmed" && b.payment_status === "pending").length || 0
      const activeBookings =
        bookings?.filter((b) => b.booking_status === "confirmed" && b.payment_status === "paid").length || 0
      const completedBookings = bookings?.filter((b) => b.booking_status === "completed").length || 0

      setStats({
        totalCars: carsCount || 0,
        totalBookings: bookings?.length || 0,
        totalRevenue,
        pendingBookings,
        activeBookings,
        completedBookings,
      })
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-CM", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cameroon-green"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {rentalService?.company_name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cameroon-green">{stats.totalCars}</div>
              <p className="text-xs text-muted-foreground">In your fleet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-md md:text-2xl font-bold text-green-600">{formatPrice(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">All time earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.activeBookings}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-yellow-600" />
                Pending Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.pendingBookings}</div>
              <p className="text-sm text-gray-600">Awaiting payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Active Rentals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.activeBookings}</div>
              <p className="text-sm text-gray-600">Currently rented out</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-green-600" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.completedBookings}</div>
              <p className="text-sm text-gray-600">Successfully completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/admin/cars/add"
                className="flex flex-col items-center p-4 bg-cameroon-green text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Car className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">Add New Car</span>
              </Link>
              <Link
                href="/admin/bookings"
                className="flex flex-col items-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Calendar className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">View Bookings</span>
              </Link>
              <Link
                href="/admin/payments"
                className="flex flex-col items-center p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <DollarSign className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">View Payments</span>
              </Link>
              <Link
                href="/admin/profile"
                className="flex flex-col items-center p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Users className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">Update Profile</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
