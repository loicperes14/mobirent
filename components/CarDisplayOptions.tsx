"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Grid3X3, List, LayoutGrid, ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react"
import type { Car } from "@/lib/supabase"
import CarCard from "./CarCard"
import Link from "next/link"

interface CarDisplayOptionsProps {
  cars: Car[]
  loading: boolean
}

export default function CarDisplayOptions({ cars, loading }: CarDisplayOptionsProps) {
  const [displayMode, setDisplayMode] = useState<"grid" | "list" | "carousel">("grid")
  const [currentSlide, setCurrentSlide] = useState(0)

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(cars.length / 3))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(cars.length / 3)) % Math.ceil(cars.length / 3))
  }

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
            <div className="aspect-video bg-gray-300"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        ))}
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

  return (
    <div className="space-y-6">
      {/* Display mode selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant={displayMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setDisplayMode("grid")}
            className={displayMode === "grid" ? "btn-cameroon" : ""}
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={displayMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setDisplayMode("list")}
            className={displayMode === "list" ? "btn-cameroon" : ""}
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
          <Button
            variant={displayMode === "carousel" ? "default" : "outline"}
            size="sm"
            onClick={() => setDisplayMode("carousel")}
            className={displayMode === "carousel" ? "btn-cameroon" : ""}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Carousel
          </Button>
        </div>
        <div className="text-sm text-gray-600">
          {cars.length} car{cars.length !== 1 ? "s" : ""} available
        </div>
      </div>

      {/* Grid view */}
      {displayMode === "grid" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}

      {/* List view */}
      {displayMode === "list" && (
        <div className="space-y-4">
          {cars.map((car) => (
            <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 relative">
                    <img
                      src={
                        car.image_url ||
                        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      }
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-48 md:h-full object-cover"
                    />
                    <Badge className={`absolute top-2 right-2 ${getStatusColor(car.status)}`}>
                      {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="md:w-2/3 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {car.brand} {car.model}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        {car.location?.city || "Location not specified"}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                        <div>• 5 passengers</div>
                        <div>• Automatic</div>
                        <div>• Air conditioning</div>
                        <div>• Full insurance</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-cameroon-green">
                        {formatPrice(car.price_per_day)}
                        <span className="text-sm font-normal text-gray-600">/day</span>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/cars/${car.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                        {car.status === "available" && (
                          <Link href={`/book/${car.id}`}>
                            <Button size="sm" className="btn-cameroon">
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
      )}

      {/* Carousel view */}
      {displayMode === "carousel" && (
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: Math.ceil(cars.length / 3) }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cars.slice(slideIndex * 3, (slideIndex + 1) * 3).map((car) => (
                      <CarCard key={car.id} car={car} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          {Math.ceil(cars.length / 3) > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Dots indicator */}
          {Math.ceil(cars.length / 3) > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: Math.ceil(cars.length / 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide ? "bg-cameroon-green w-6" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
