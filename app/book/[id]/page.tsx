"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase, type Car } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, ArrowLeft, CreditCard, Smartphone, CheckCircle, Clock, Users, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const { user, userProfile } = useAuth()
  const { toast } = useToast()
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: "",
    paymentMethod: "",
    totalDays: 0,
    totalPrice: 0,
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }

    if (params.id) {
      fetchCarDetails(params.id as string)
    }
  }, [params.id, user, router])

  const fetchCarDetails = async (carId: string) => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select(`
          *,
          location:locations(*)
        `)
        .eq("id", carId)
        .single()

      if (error) throw error
      setCar(data)
    } catch (error) {
      console.error("Error fetching car details:", error)
      toast({
        title: "Error",
        description: "Failed to load car details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = (startDate: string, endDate: string) => {
    if (!startDate || !endDate || !car) return { days: 0, total: 0 }

    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const total = diffDays * car.price_per_day

    return { days: diffDays, total }
  }

  const handleDateChange = (field: string, value: string) => {
    const newBookingData = { ...bookingData, [field]: value }

    if (newBookingData.startDate && newBookingData.endDate) {
      const { days, total } = calculateTotal(newBookingData.startDate, newBookingData.endDate)
      newBookingData.totalDays = days
      newBookingData.totalPrice = total
    }

    setBookingData(newBookingData)
  }

  const handleBooking = async () => {
    if (!user || !car) return

    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          car_id: car.id,
          start_date: bookingData.startDate,
          end_date: bookingData.endDate,
          total_price: bookingData.totalPrice,
          payment_status: "pending",
          booking_status: "confirmed",
        })
        .select()
        .single()

      if (error) throw error

      // Update car status to booked
      await supabase.from("cars").update({ status: "booked" }).eq("id", car.id)

      // Create notification
      await supabase.from("notifications").insert({
        user_id: user.id,
        message: `Your booking for ${car.brand} ${car.model} has been confirmed. Booking ID: ${data.id.slice(0, 8)}`,
      })

      router.push(`/payment/${data.id}`)
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking",
        variant: "destructive",
      })
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-CM", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const today = new Date().toISOString().split("T")[0]

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

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Car not found</h1>
            <Button onClick={() => router.back()} className="btn-cameroon">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 lg:mb-6 hover:bg-gray-100 text-sm lg:text-base"
        >
          <ArrowLeft className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
          Back
        </Button>

        {/* Progress indicator */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center justify-center space-x-2 lg:space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-medium ${
                    step >= stepNumber ? "bg-cameroon-green text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-8 lg:w-16 h-1 mx-1 lg:mx-2 ${step > stepNumber ? "bg-cameroon-green" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <div className="text-xs lg:text-sm text-gray-600">
              {step === 1 && "Select Dates"}
              {step === 2 && "Payment Method"}
              {step === 3 && "Confirmation"}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <Card>
                <CardHeader className="pb-3 lg:pb-4">
                  <CardTitle className="flex items-center text-lg lg:text-xl">
                    <Calendar className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                    Select Rental Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 lg:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                    <div>
                      <Label htmlFor="startDate" className="text-sm lg:text-base">
                        Pickup Date
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        min={today}
                        value={bookingData.startDate}
                        onChange={(e) => handleDateChange("startDate", e.target.value)}
                        className="text-sm lg:text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate" className="text-sm lg:text-base">
                        Return Date
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        min={bookingData.startDate || today}
                        value={bookingData.endDate}
                        onChange={(e) => handleDateChange("endDate", e.target.value)}
                        className="text-sm lg:text-base"
                      />
                    </div>
                  </div>

                  {bookingData.totalDays > 0 && (
                    <div className="bg-green-50 p-3 lg:p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm lg:text-base">Rental Duration</div>
                          <div className="text-xs lg:text-sm text-gray-600">{bookingData.totalDays} days</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-sm lg:text-base">Total Cost</div>
                          <div className="text-lg lg:text-xl font-bold text-cameroon-green">
                            {formatPrice(bookingData.totalPrice)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => setStep(2)}
                    disabled={!bookingData.startDate || !bookingData.endDate}
                    className="w-full btn-cameroon text-sm lg:text-base"
                  >
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader className="pb-3 lg:pb-4">
                  <CardTitle className="flex items-center text-lg lg:text-xl">
                    <CreditCard className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                    Select Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 lg:space-y-6">
                  <div className="space-y-3 lg:space-y-4">
                    <div
                      className={`p-3 lg:p-4 border rounded-lg cursor-pointer transition-colors ${
                        bookingData.paymentMethod === "mtn_momo"
                          ? "border-cameroon-green bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setBookingData({ ...bookingData, paymentMethod: "mtn_momo" })}
                    >
                      <div className="flex items-center">
                        <Smartphone className="h-5 w-5 lg:h-6 lg:w-6 text-orange-500 mr-3" />
                        <div>
                          <div className="font-medium text-sm lg:text-base">MTN Mobile Money</div>
                          <div className="text-xs lg:text-sm text-gray-600">Pay with your MTN MoMo account</div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-3 lg:p-4 border rounded-lg cursor-pointer transition-colors ${
                        bookingData.paymentMethod === "orange_money"
                          ? "border-cameroon-green bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setBookingData({ ...bookingData, paymentMethod: "orange_money" })}
                    >
                      <div className="flex items-center">
                        <Smartphone className="h-5 w-5 lg:h-6 lg:w-6 text-orange-600 mr-3" />
                        <div>
                          <div className="font-medium text-sm lg:text-base">Orange Money</div>
                          <div className="text-xs lg:text-sm text-gray-600">Pay with your Orange Money account</div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-3 lg:p-4 border rounded-lg cursor-pointer transition-colors ${
                        bookingData.paymentMethod === "card"
                          ? "border-cameroon-green bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setBookingData({ ...bookingData, paymentMethod: "card" })}
                    >
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 lg:h-6 lg:w-6 text-blue-500 mr-3" />
                        <div>
                          <div className="font-medium text-sm lg:text-base">Credit/Debit Card</div>
                          <div className="text-xs lg:text-sm text-gray-600">Pay with Visa or Mastercard</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 lg:space-x-4">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1 text-sm lg:text-base">
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={!bookingData.paymentMethod}
                      className="flex-1 btn-cameroon text-sm lg:text-base"
                    >
                      Review Booking
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader className="pb-3 lg:pb-4">
                  <CardTitle className="flex items-center text-lg lg:text-xl">
                    <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                    Confirm Your Booking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 lg:space-y-6">
                  <div className="bg-gray-50 p-3 lg:p-4 rounded-lg">
                    <h3 className="font-medium mb-3 text-sm lg:text-base">Booking Summary</h3>
                    <div className="space-y-2 text-xs lg:text-sm">
                      <div className="flex justify-between">
                        <span>Pickup Date:</span>
                        <span>{new Date(bookingData.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Return Date:</span>
                        <span>{new Date(bookingData.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{bookingData.totalDays} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Daily Rate:</span>
                        <span>{formatPrice(car.price_per_day)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Total Amount:</span>
                        <span className="text-cameroon-green">{formatPrice(bookingData.totalPrice)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 lg:p-4 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center text-sm lg:text-base">
                      <Shield className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                      Important Information
                    </h3>
                    <ul className="text-xs lg:text-sm text-gray-700 space-y-1">
                      <li>• Valid driver's license required</li>
                      <li>• Minimum age: 21 years</li>
                      <li>• Full insurance coverage included</li>
                      <li>• Free cancellation up to 24 hours before pickup</li>
                    </ul>
                  </div>

                  <div className="flex space-x-3 lg:space-x-4">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1 text-sm lg:text-base">
                      Back
                    </Button>
                    <Button onClick={handleBooking} className="flex-1 btn-cameroon text-sm lg:text-base">
                      Confirm & Pay
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <Card className="sticky top-4">
              <CardHeader className="pb-3 lg:pb-4">
                <CardTitle className="text-lg lg:text-xl">Your Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 lg:space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      car.image_url ||
                      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" ||
                      "/placeholder.svg"
                    }
                    alt={`${car.brand} ${car.model}`}
                    className="w-12 h-9 lg:w-16 lg:h-12 object-cover rounded"
                  />
                  <div>
                    <div className="font-medium text-sm lg:text-base">
                      {car.brand} {car.model}
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600 flex items-center">
                      <MapPin className="h-2 w-2 lg:h-3 lg:w-3 mr-1" />
                      {car.location?.city}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-xs lg:text-sm">
                  <div className="flex items-center">
                    <Users className="h-3 w-3 lg:h-4 lg:w-4 mr-2 text-gray-400" />
                    <span>5 passengers</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-3 w-3 lg:h-4 lg:w-4 mr-2 text-gray-400" />
                    <span>Full insurance</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 lg:h-4 lg:w-4 mr-2 text-gray-400" />
                    <span>24/7 support</span>
                  </div>
                </div>

                <Separator />

                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-cameroon-green">
                    {formatPrice(car.price_per_day)}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600">per day</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
