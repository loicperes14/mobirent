"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import type { Car } from "@/lib/supabase"
import Link from "next/link"

interface DynamicCarDisplayProps {
  cars: Car[]
  loading: boolean
}

export default function DynamicCarDisplay({ cars, loading }: DynamicCarDisplayProps) {
  const [currentCarouselSlide, setCurrentCarouselSlide] = useState(0)

  
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

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Loading skeletons for different layouts */}
        <div className="grid lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md animate-pulse h-64">
              <div className="flex h-full">
                <div className="w-1/2 bg-gray-300 rounded-l-lg"></div>
                <div className="w-1/2 p-4 flex flex-col justify-between">
                  <div>
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                  </div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (cars.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">No cars found matching your criteria.</p>
      </div>
    )
  }

  // Split cars into different sections for variety
  const carsPerSection = Math.ceil(cars.length / 4)
  const listCars = cars.slice(0, carsPerSection * 2)
  const gridCars = cars.slice(carsPerSection * 2, carsPerSection * 3)
  const carouselCars = cars.slice(carsPerSection * 3)

  return (
    <div className="space-y-16">
      {/* Two-column list layout for large screens */}
      <div className="space-y-4">
        <div className="grid lg:grid-cols-2 gap-4">
          {listCars.map((car) => (
            <Card key={car.id} className="overflow-hidden   hover:shadow-lg transition-shadow h-66 lg:h-72">
              <CardContent className="p-0 h-full">
                <div className="flex h-full">
                  <div className="w-1/2 relative">
                    <img
                      src={
                        car.image_url ||
                        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" ||
                        "/placeholder.svg"
                      }
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover"
                    />
                    <Badge className={`absolute top-2 right-2 ${getStatusColor(car.status)} text-xs`}>
                      {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="w-1/2 p-3 lg:p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                        {car.brand} {car.model}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <MapPin className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                        <span className="truncate">{car.location?.city || "Location not specified"}</span>
                      </div>
                      <div className="grid-cols-1 gap-1 text-xs text-gray-600 mb-3">
                        <div>• 5 passengers</div>
                        <div>• Automatic</div>
                        <div>• Air conditioning</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="text-xl lg:text-2xl font-bold text-cameroon-green">
                        {formatPrice(car.price_per_day)}
                        <span className="text-xs lg:text-sm font-normal text-gray-600">/day</span>
                      </div>
                      {/* Mobile: buttons below price with flex layout */}
                      <div className="flex flex-col justify-center space-y-1 lg:hidden">
                        <Link href={`/cars/${car.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            Details
                          </Button>
                        </Link>
                        {car.status === "available" && (
                          <Link href={`/book/${car.id}`} className="flex-1">
                            <Button size="sm" className="btn-cameroon w-full text-xs">
                              Book
                            </Button>
                          </Link>
                        )}
                      </div>
                      {/* Desktop: buttons side by side */}
                      <div className="hidden lg:flex space-x-2">
                        <Link href={`/cars/${car.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                        {car.status === "available" && (
                          <Link href={`/book/${car.id}`} className="flex-1">
                            <Button size="sm" className="btn-cameroon w-full">
                              <Calendar className="h-4 w-4 mr-2" />
                              Book Now
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Grid layout section */}
      {gridCars.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900">Featured Vehicles</h3>
            <p className="text-gray-600">Handpicked cars for your journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {gridCars.map((car) => (
              <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={
                      car.image_url ||
                      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" ||
                      "/placeholder.svg"
                    }
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                  <Badge className={`absolute top-2 right-2 ${getStatusColor(car.status)} text-xs`}>
                    {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                  </Badge>
                </div>
                <CardContent className="p-3 lg:p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {car.brand} {car.model}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {car.location?.city || "Location not specified"}
                  </div>
                  <div className="space-y-3">
                    <div className="text-xl lg:text-2xl font-bold text-cameroon-green">
                      {formatPrice(car.price_per_day)}
                      <span className="text-sm font-normal text-gray-600">/day</span>
                    </div>
                    {/* Mobile: buttons below price with flex layout */}
                    <div className="flex space-x-2 lg:hidden">
                      <Link href={`/cars/${car.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          Details
                        </Button>
                      </Link>
                      {car.status === "available" && (
                        <Link href={`/book/${car.id}`} className="flex-1">
                          <Button size="sm" className="btn-cameroon w-full text-xs">
                            Book
                          </Button>
                        </Link>
                      )}
                    </div>
                    {/* Desktop: buttons side by side */}
                    <div className="hidden lg:flex space-x-2">
                      <Link href={`/cars/${car.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      {car.status === "available" && (
                        <Link href={`/book/${car.id}`} className="flex-1">
                          <Button size="sm" className="btn-cameroon w-full">
                            <Calendar className="h-4 w-4 mr-2" />
                            Book Now
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Carousel section */}
      {carouselCars.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900">Premium Collection</h3>
            <p className="text-gray-600">Luxury vehicles for special occasions</p>
          </div>
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentCarouselSlide * 100}%)` }}
              >
                {Array.from({ length: Math.ceil(carouselCars.length / 3) }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                      {carouselCars.slice(slideIndex * 3, (slideIndex + 1) * 3).map((car) => (
                        <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="aspect-video relative">
                            <img
                              src={
                                car.image_url ||
                                "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" ||
                                "/placeholder.svg"
                              }
                              alt={`${car.brand} ${car.model}`}
                              className="w-full h-full object-cover"
                            />
                            <Badge className={`absolute top-2 right-2 ${getStatusColor(car.status)} text-xs`}>
                              {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                            </Badge>
                          </div>
                          <CardContent className="p-3 lg:p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {car.brand} {car.model}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600 mb-4">
                              <MapPin className="h-4 w-4 mr-1" />
                              {car.location?.city || "Location not specified"}
                            </div>
                            <div className="space-y-3">
                              <div className="text-xl lg:text-2xl font-bold text-cameroon-green">
                                {formatPrice(car.price_per_day)}
                                <span className="text-sm font-normal text-gray-600">/day</span>
                              </div>
                              {/* Mobile: buttons below price with flex layout */}
                              <div className="flex space-x-2 lg:hidden">
                                <Link href={`/cars/${car.id}`} className="flex-1">
                                  <Button variant="outline" size="sm" className="w-full text-xs">
                                    Details
                                  </Button>
                                </Link>
                                {car.status === "available" && (
                                  <Link href={`/book/${car.id}`} className="flex-1">
                                    <Button size="sm" className="btn-cameroon w-full text-xs">
                                      Book
                                    </Button>
                                  </Link>
                                )}
                              </div>
                              {/* Desktop: buttons side by side */}
                              <div className="hidden lg:flex space-x-2">
                                <Link href={`/cars/${car.id}`} className="flex-1">
                                  <Button variant="outline" size="sm" className="w-full">
                                    View Details
                                  </Button>
                                </Link>
                                {car.status === "available" && (
                                  <Link href={`/book/${car.id}`} className="flex-1">
                                    <Button size="sm" className="btn-cameroon w-full">
                                      <Calendar className="h-4 w-4 mr-2" />
                                      Book Now
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            {Math.ceil(carouselCars.length / 3) > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentCarouselSlide(
                      (prev) => (prev - 1 + Math.ceil(carouselCars.length / 3)) % Math.ceil(carouselCars.length / 3),
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentCarouselSlide((prev) => (prev + 1) % Math.ceil(carouselCars.length / 3))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Dots indicator */}
            {Math.ceil(carouselCars.length / 3) > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: Math.ceil(carouselCars.length / 3) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentCarouselSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentCarouselSlide ? "bg-cameroon-green w-6" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
