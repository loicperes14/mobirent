"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase, type Car, type Review } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Calendar,
  Star,
  Users,
  Fuel,
  Gauge,
  CarIcon,
  Shield,
  ArrowLeft,
  Heart,
  Share2,
  Phone,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function CarDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [car, setCar] = useState<Car | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchCarDetails(params.id as string)
      fetchReviews(params.id as string)
    }
  }, [params.id])

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

  const fetchReviews = async (carId: string) => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          user:users(full_name)
        `)
        .eq("car_id", carId)
        .order("created_at", { ascending: false })
        .limit(5)

      if (error) throw error
      setReviews(data || [])
    } catch (error) {
      console.error("Error fetching reviews:", error)
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
      case "available":
        return "bg-green-100 text-green-800"
      case "booked":
        return "bg-yellow-100 text-yellow-800"
      case "maintenance":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${car?.brand} ${car?.model} - MobiRent Cameroon`,
          text: `Check out this ${car?.brand} ${car?.model} available for rent!`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Car details link copied to clipboard",
      })
    }
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

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Car not found</h1>
            <Link href="/">
              <Button className="btn-cameroon">Back to Cars</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 lg:mb-6 hover:bg-gray-100 text-sm lg:text-base"
        >
          <ArrowLeft className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {/* Car image and basic info */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={
                    car.image_url ||
                    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" ||
                    "/placeholder.svg"
                  }
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-48 md:h-64 lg:h-96 object-cover"
                />
                <div className="absolute top-2 lg:top-4 right-2 lg:right-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="bg-white/90 hover:bg-white p-2 lg:p-3"
                  >
                    <Heart className={`h-3 w-3 lg:h-4 lg:w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleShare}
                    className="bg-white/90 hover:bg-white p-2 lg:p-3"
                  >
                    <Share2 className="h-3 w-3 lg:h-4 lg:w-4" />
                  </Button>
                </div>
                <Badge className={`absolute top-2 lg:top-4 left-2 lg:left-4 ${getStatusColor(car.status)} text-xs`}>
                  {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                </Badge>
              </div>

              <CardContent className="p-3 lg:p-6">
                <div className="flex items-start justify-between mb-3 lg:mb-4">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {car.brand} {car.model}
                    </h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                      <span className="text-sm lg:text-base">
                        {car.location?.city}, {car.location?.branch_name}
                      </span>
                    </div>
                    {reviews.length > 0 && (
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 lg:h-4 lg:w-4 ${
                                i < Math.floor(averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-xs lg:text-sm text-gray-600">
                          {averageRating.toFixed(1)} ({reviews.length} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl lg:text-3xl font-bold text-cameroon-green">
                      {formatPrice(car.price_per_day)}
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600">per day</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader className="pb-3 lg:pb-4">
                <CardTitle className="text-lg lg:text-xl">Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <div className="space-y-3 lg:space-y-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-sm lg:text-base">Passengers</div>
                        <div className="text-xs lg:text-sm text-gray-600">5 people</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Fuel className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-sm lg:text-base">Fuel Type</div>
                        <div className="text-xs lg:text-sm text-gray-600">Gasoline</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Gauge className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-sm lg:text-base">Transmission</div>
                        <div className="text-xs lg:text-sm text-gray-600">Automatic</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 lg:space-y-4">
                    <div className="flex items-center">
                      <CarIcon className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-sm lg:text-base">Year</div>
                        <div className="text-xs lg:text-sm text-gray-600">2023</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-sm lg:text-base">Insurance</div>
                        <div className="text-xs lg:text-sm text-gray-600">Full Coverage</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-sm lg:text-base">Mileage</div>
                        <div className="text-xs lg:text-sm text-gray-600">Unlimited</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader className="pb-3 lg:pb-4">
                <CardTitle className="text-lg lg:text-xl">Features & Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
                  {[
                    "Air Conditioning",
                    "Bluetooth",
                    "GPS Navigation",
                    "USB Charging",
                    "Backup Camera",
                    "Cruise Control",
                    "Power Windows",
                    "Central Locking",
                    "ABS Brakes",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center">
                      <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-cameroon-green rounded-full mr-2 lg:mr-3"></div>
                      <span className="text-xs lg:text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            {reviews.length > 0 && (
              <Card>
                <CardHeader className="pb-3 lg:pb-4">
                  <CardTitle className="text-lg lg:text-xl">Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 lg:space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-3 lg:pb-4 last:border-b-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium text-sm lg:text-base">{review.user?.full_name}</div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 lg:h-4 lg:w-4 ${
                                    i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="text-xs lg:text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm lg:text-base">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            {/* Booking card */}
            <Card className="sticky top-4">
              <CardHeader className="pb-3 lg:pb-4">
                <CardTitle className="text-lg lg:text-xl">Book This Car</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 lg:space-y-4">
                <div className="text-center p-3 lg:p-4 bg-gray-50 rounded-lg">
                  <div className="text-xl lg:text-2xl font-bold text-cameroon-green mb-1">
                    {formatPrice(car.price_per_day)}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600">per day</div>
                </div>

                {car.status === "available" ? (
                  <Link href={`/book/${car.id}`}>
                    <Button className="w-full btn-cameroon text-sm lg:text-base">
                      <Calendar className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                      Book Now
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="w-full text-sm lg:text-base">
                    Currently Unavailable
                  </Button>
                )}

                <Separator />

                <div className="space-y-2 lg:space-y-3">
                  <Button variant="outline" className="w-full text-sm lg:text-base">
                    <Phone className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                    Call Us
                  </Button>
                  <Button variant="outline" className="w-full text-sm lg:text-base">
                    <MessageCircle className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                    Chat Support
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Location info */}
            <Card>
              <CardHeader className="pb-3 lg:pb-4">
                <CardTitle className="text-lg lg:text-xl">Pickup Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-medium text-sm lg:text-base">{car.location?.branch_name}</div>
                  <div className="text-xs lg:text-sm text-gray-600">{car.location?.address}</div>
                  <div className="text-xs lg:text-sm text-gray-600">{car.location?.city}</div>
                </div>
              </CardContent>
            </Card>

            {/* Policies */}
            <Card>
              <CardHeader className="pb-3 lg:pb-4">
                <CardTitle className="text-lg lg:text-xl">Rental Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 lg:space-y-3 text-xs lg:text-sm">
                <div>
                  <div className="font-medium">Minimum Age</div>
                  <div className="text-gray-600">21 years old</div>
                </div>
                <div>
                  <div className="font-medium">Required Documents</div>
                  <div className="text-gray-600">Valid driver's license, ID card</div>
                </div>
                <div>
                  <div className="font-medium">Fuel Policy</div>
                  <div className="text-gray-600">Return with same fuel level</div>
                </div>
                <div>
                  <div className="font-medium">Cancellation</div>
                  <div className="text-gray-600">Free cancellation up to 24h before</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
