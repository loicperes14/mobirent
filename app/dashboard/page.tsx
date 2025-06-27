"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase, type Car, type Booking, type Notification } from "@/lib/supabase"
import CustomerLayout from "@/components/CustomerLayout"
import CarCard from "@/components/CarCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, CarIcon, Bell, MapPin } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function UserDashboard() {
  const { user, userProfile, loading: authLoading } = useAuth()
  const [cars, setCars] = useState<Car[]>([])
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
      return
    }

    if (user && userProfile) {
      if (userProfile.role === "admin") {
        router.push("/admin")
        return
      }
      fetchDashboardData()
    }
  }, [user, userProfile, authLoading, router])

  const fetchDashboardData = async () => {
    if (!userProfile) return

    try {
      // Fetch cars from user's location
      const { data: carsData } = await supabase
        .from("cars")
        .select(`
          *,
          location:locations(*)
        `)
        .eq("status", "available")
        .eq("locations.city", userProfile.location)
        .limit(6)

      // Fetch recent bookings
      const { data: bookingsData } = await supabase
        .from("bookings")
        .select(`
          *,
          car:cars(brand, model, image_url)
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(3)

      // Fetch unread notifications
      const { data: notificationsData } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user?.id)
        .eq("is_read", false)
        .order("created_at", { ascending: false })
        .limit(5)

      setCars(carsData || [])
      setRecentBookings(bookingsData || [])
      setNotifications(notificationsData || [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-CM", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (authLoading || loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cameroon-green"></div>
        </div>
      </CustomerLayout>
    )
  }

  return (
    <CustomerLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {userProfile?.full_name}!</h1>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{userProfile?.location}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Cars</CardTitle>
              <CarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cameroon-green">{cars.length}</div>
              <p className="text-xs text-muted-foreground">In {userProfile?.location}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cameroon-green">
                {recentBookings.filter((b) => b.booking_status === "confirmed").length}
              </div>
              <p className="text-xs text-muted-foreground">Current rentals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cameroon-red">{notifications.length}</div>
              <p className="text-xs text-muted-foreground">Unread messages</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 ">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Available Cars */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Available Cars in {userProfile?.location}</h2>
                <Link href="/">
                  <Button variant="outline">View All</Button>
                </Link>
              </div>

              {cars.length > 0 ? (
                <div className="grid grid-row-1 md:grid-col-2 gap-6 overflow-x-scroll">
                  {cars.slice(0, 2).map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <CarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No cars available in your location right now.</p>
                    <Link href="/">
                      <Button className="mt-4 btn-cameroon">Browse All Cars</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Recent Bookings */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
                <Link href="/dashboard/bookings">
                  <Button variant="outline">View All</Button>
                </Link>
              </div>

              {recentBookings.length > 0 ? (
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img
                              src={booking.car?.image_url || "/placeholder.svg?height=60&width=80"}
                              alt={`${booking.car?.brand} ${booking.car?.model}`}
                              className="w-20 h-15 object-cover rounded"
                            />
                            <div>
                              <h3 className="font-semibold">
                                {booking.car?.brand} {booking.car?.model}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {new Date(booking.start_date).toLocaleDateString()} -{" "}
                                {new Date(booking.end_date).toLocaleDateString()}
                              </p>
                              <p className="text-lg font-bold text-cameroon-green">
                                {formatPrice(booking.total_price)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <Badge className={getStatusColor(booking.booking_status)}>{booking.booking_status}</Badge>
                            <br />
                            <Badge className={getPaymentStatusColor(booking.payment_status)}>
                              {booking.payment_status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No bookings yet.</p>
                    <Link href="/">
                      <Button className="mt-4 btn-cameroon">Book Your First Car</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                    <Link href="/dashboard/notifications">
                      <Button variant="outline" size="sm" className="w-full">
                        View All Notifications
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-4">No new notifications</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/">
                  <Button className="w-full btn-cameroon">Browse Cars</Button>
                </Link>
                <Link href="/dashboard/bookings">
                  <Button variant="outline" className="w-full">
                    My Bookings
                  </Button>
                </Link>
                <Link href="/dashboard/notifications">
                  <Button variant="outline" className="w-full">
                    Notifications
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
}
