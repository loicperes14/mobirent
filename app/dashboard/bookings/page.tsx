"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase, type Booking } from "@/lib/supabase"
import CustomerLayout from "@/components/CustomerLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Search, Eye, MapPin, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function CustomerBookingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          car:cars(*,location:locations(*))
        `)
        .eq("user_id", user?.id)
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

  const cancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return

    try {
      const { error } = await supabase.from("bookings").update({ booking_status: "cancelled" }).eq("id", bookingId)

      if (error) throw error

      setBookings(
        bookings.map((booking) =>
          booking.id === bookingId ? { ...booking, booking_status: "cancelled" as any } : booking,
        ),
      )

      toast({
        title: "Success",
        description: "Booking cancelled successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel booking",
        variant: "destructive",
      })
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      searchTerm === "" ||
      booking.car?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.car?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.car?.location?.city?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.booking_status === statusFilter

    return matchesSearch && matchesStatus
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
      <CustomerLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cameroon-green"></div>
        </div>
      </CustomerLayout>
    )
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600">View and manage your car rental bookings</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
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
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
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
                    {/* Car Info */}
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
                            <MapPin className="h-4 w-4 mr-1" />
                            {booking.car?.location?.city}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">{booking.car?.location?.address}</div>
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

                      <div className="space-y-2">
                        <Link href={`/cars/${booking.car?.id}`} className="block">
                          <Button size="sm" variant="outline" className="w-full">
                            <Eye className="h-4 w-4 mr-2" />
                            View Car
                          </Button>
                        </Link>

                        {booking.booking_status === "confirmed" && booking.payment_status === "pending" && (
                          <Link href={`/payment/${booking.id}`} className="block">
                            <Button size="sm" className="w-full btn-cameroon">
                              Complete Payment
                            </Button>
                          </Link>
                        )}

                        {booking.booking_status === "confirmed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-red-600"
                            onClick={() => cancelBooking(booking.id)}
                          >
                            Cancel Booking
                          </Button>
                        )}

                        <Button size="sm" variant="outline" className="w-full">
                          <Phone className="h-4 w-4 mr-2" />
                          Contact Support
                        </Button>
                      </div>
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
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "No bookings match your current filters."
                  : "You haven't made any bookings yet."}
              </p>
              <Link href="/">
                <Button className="btn-cameroon">Browse Cars</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </CustomerLayout>
  )
}
