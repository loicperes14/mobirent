"use client"

import type { Car } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Calendar, Building2 } from "lucide-react"
import Link from "next/link"

interface CarCardProps {
  car: Car
  showBookButton?: boolean
}

export default function CarCard({ car, showBookButton = true }: CarCardProps) {
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
        return "text-green-600 bg-green-100"
      case "booked":
        return "text-yellow-600 bg-yellow-100"
      case "maintenance":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Fallback to a nice car image if no image is provided
  const carImage =
    car.image_url ||
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative">
        <img
          src={carImage || "/placeholder.svg"}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback image if the original fails to load
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          }}
        />
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(car.status)}`}
        >
          {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {car.brand} {car.model}
        </h3>

        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          {car.location?.city || "Location not specified"}
        </div>

        {/* Rental Service Info */}
        {car.rental_service && (
          <div className="flex items-center text-sm text-gray-600 mb-3 p-2 bg-gray-50 rounded-lg">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage
                src={car.rental_service.logo_url || "/placeholder.svg"}
                alt={car.rental_service.company_name}
              />
              <AvatarFallback className="text-xs bg-cameroon-green text-white">
                {getInitials(car.rental_service.company_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center">
              <Building2 className="h-3 w-3 mr-1" />
              <span className="truncate">{car.rental_service.company_name}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="text-2xl font-bold text-cameroon-green">
            {formatPrice(car.price_per_day)}
            <span className="text-sm font-normal text-gray-600">/day</span>
          </div>
        </div>
      </CardContent>

      {showBookButton && (
        <CardFooter className="p-4 pt-0">
          <div className="flex space-x-2 w-full">
            <Link href={`/cars/${car.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
            {car.status === "available" && (
              <Link href={`/book/${car.id}`} className="flex-1">
                <Button className="btn-cameroon w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Now
                </Button>
              </Link>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
