"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase, type Booking } from "@/lib/supabase"
import AdminLayout from "@/components/AdminLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Search, User, Car } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminBookingsPage() {
  const { userProfile } = useAuth()
  const { toast } = useToast()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          car:cars!inner(*,location:locations(*)),
          user:users(*)
        `)
        .eq("car.rental_service_id", userProfile?.rental_service_id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase.from("bookings").update({ booking_status: status }).eq("id", bookingId)

      if (error) throw error

      setBookings(
        bookings.map((booking) => (booking.id === bookingId ? { ...booking, booking_status: status as any } : booking)),
      )

      toast({
        title: "Success",
        description: "Booking status updated",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update booking",
        variant: "destructive",
      })
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      searchTerm === "" ||
      booking.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.car?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.car?.model?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.booking_status === statusFilter
    const matchesPayment = paymentFilter === "all" || booking.payment_status === paymentFilter

    return matchesSearch && matchesStatus && matchesPayment
  })

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
          <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-600">Manage customer bookings for your cars</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Booking Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setPaymentFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="grid lg:grid-cols-4 gap-6">
                    {/* Customer & Car Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-start space-x-4">
                        <img
                          src={booking.car?.image_url || "/placeholder.svg?height=80&width=120"}
                          alt={`${booking.car?.brand} ${booking.car?.model}`}
                          className="w-20 h-15 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {booking.car?.brand} {booking.car?.model}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <User className="h-4 w-4 mr-1" />
                            {booking.user?.full_name}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <Car className="h-4 w-4 mr-1" />
                            {booking.car?.location?.city}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-600">Dates:</span>
                          <div className="font-medium">
                            {new Date(booking.start_date).toLocaleDateString()} -{" "}
                            {new Date(booking.end_date).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Total:</span>
                          <div className="font-bold text-cameroon-green">{formatPrice(booking.total_price)}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Booking ID:</span>
                          <div className="font-mono text-sm">{booking.id.slice(0, 8)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Badge className={getStatusColor(booking.booking_status)}>{booking.booking_status}</Badge>
                        <Badge className={getPaymentStatusColor(booking.payment_status)}>
                          {booking.payment_status}
                        </Badge>
                      </div>

                      {booking.booking_status === "confirmed" && (
                        <div className="space-y-2">
                          <Button
                            size="sm"
                            className="w-full btn-cameroon"
                            onClick={() => updateBookingStatus(booking.id, "completed")}
                          >
                            Mark Completed
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-red-600"
                            onClick={() => updateBookingStatus(booking.id, "cancelled")}
                          >
                            Cancel Booking
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all" || paymentFilter !== "all"
                  ? "No bookings match your current filters."
                  : "You don't have any bookings yet."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
