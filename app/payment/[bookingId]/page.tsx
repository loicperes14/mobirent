"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase, type Booking } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, CreditCard, Smartphone, Loader2, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }

    if (params.bookingId) {
      fetchBookingDetails(params.bookingId as string)
    }
  }, [params.bookingId, user, router])

  const fetchBookingDetails = async (bookingId: string) => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          car:cars(*,location:locations(*)),
          user:users(*)
        `)
        .eq("id", bookingId)
        .single()

      if (error) throw error
      setBooking(data)
    } catch (error) {
      console.error("Error fetching booking details:", error)
      toast({
        title: "Error",
        description: "Failed to load booking details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const processPayment = async () => {
    if (!booking) return

    setProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Create payment record
      const { error: paymentError } = await supabase.from("payments").insert({
        booking_id: booking.id,
        method: getPaymentMethodName(),
        amount: booking.total_price,
        transaction_reference: `TXN-${Date.now()}`,
        status: "success",
        paid_at: new Date().toISOString(),
      })

      if (paymentError) throw paymentError

      // Update booking payment status
      const { error: bookingError } = await supabase
        .from("bookings")
        .update({ payment_status: "paid" })
        .eq("id", booking.id)

      if (bookingError) throw bookingError

      // Create success notification
      await supabase.from("notifications").insert({
        user_id: user?.id,
        message: `Payment successful! Your booking for ${booking.car?.brand} ${booking.car?.model} is confirmed.`,
      })

      setPaymentSuccess(true)

      toast({
        title: "Payment Successful!",
        description: "Your booking has been confirmed.",
      })
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Payment processing failed",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const getPaymentMethodName = () => {
    // This would be determined by the booking's payment method
    return "MTN Mobile Money" // Default for demo
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cameroon-green"></div>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking not found</h1>
            <Button onClick={() => router.push("/dashboard")} className="btn-cameroon">
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-8">
          <Card className="text-center">
            <CardContent className="p-6 lg:p-8">
              <CheckCircle className="h-12 w-12 lg:h-16 lg:w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
              <p className="text-gray-600 mb-6 text-sm lg:text-base">
                Your booking has been confirmed. You will receive a confirmation email shortly.
              </p>

              <div className="bg-gray-50 p-3 lg:p-4 rounded-lg mb-6">
                <div className="text-xs lg:text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Booking ID:</span>
                    <span className="font-mono">{booking.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Car:</span>
                    <span>
                      {booking.car?.brand} {booking.car?.model}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Paid:</span>
                    <span className="font-bold text-cameroon-green">{formatPrice(booking.total_price)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Button onClick={() => router.push("/dashboard")} className="flex-1 btn-cameroon text-sm lg:text-base">
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard/bookings")}
                  className="flex-1 text-sm lg:text-base"
                >
                  View Bookings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 lg:mb-6 hover:bg-gray-100 text-sm lg:text-base"
        >
          <ArrowLeft className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader className="pb-3 lg:pb-4">
            <CardTitle className="flex items-center text-lg lg:text-xl">
              <CreditCard className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
              Complete Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 lg:space-y-6">
            {/* Booking summary */}
            <div className="bg-gray-50 p-3 lg:p-4 rounded-lg">
              <h3 className="font-medium mb-3 text-sm lg:text-base">Booking Summary</h3>
              <div className="space-y-2 text-xs lg:text-sm">
                <div className="flex justify-between">
                  <span>Car:</span>
                  <span>
                    {booking.car?.brand} {booking.car?.model}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Pickup Date:</span>
                  <span>{new Date(booking.start_date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Return Date:</span>
                  <span>{new Date(booking.end_date).toLocaleDateString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total Amount:</span>
                  <span className="text-cameroon-green">{formatPrice(booking.total_price)}</span>
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-center p-3 lg:p-4 border rounded-lg bg-orange-50 border-orange-200">
                <Smartphone className="h-5 w-5 lg:h-6 lg:w-6 text-orange-500 mr-3" />
                <div>
                  <div className="font-medium text-sm lg:text-base">MTN Mobile Money</div>
                  <div className="text-xs lg:text-sm text-gray-600">Secure payment via MTN MoMo</div>
                </div>
              </div>

              <div>
                <Label htmlFor="phoneNumber" className="text-sm lg:text-base">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+237 6XX XXX XXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="text-sm lg:text-base"
                />
              </div>
            </div>

            {/* Payment button */}
            <Button
              onClick={processPayment}
              disabled={processing || !phoneNumber}
              className="w-full btn-cameroon text-sm lg:text-base"
            >
              {processing ? (
                <>
                  <Loader2 className="h-3 w-3 lg:h-4 lg:w-4 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                `Pay ${formatPrice(booking.total_price)}`
              )}
            </Button>

            {/* Security notice */}
            <div className="text-xs text-gray-500 text-center">
              <p>🔒 Your payment is secured with 256-bit SSL encryption</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
