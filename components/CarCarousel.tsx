"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const featuredCars = [
  {
    id: 1,
    brand: "Toyota",
    model: "Camry",
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    price: 25000,
    description: "Comfortable sedan perfect for city drives",
  },
  {
    id: 2,
    brand: "Honda",
    model: "CR-V",
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    price: 35000,
    description: "Spacious SUV ideal for family trips",
  },
  {
    id: 3,
    brand: "Nissan",
    model: "Altima",
    image:
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
    price: 28000,
    description: "Reliable and fuel-efficient vehicle",
  },
  {
    id: 4,
    brand: "Hyundai",
    model: "Tucson",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    price: 32000,
    description: "Modern SUV with advanced features",
  },
  {
    id: 5,
    brand: "Kia",
    model: "Sportage",
    image:
      "https://i.pinimg.com/736x/c5/62/ed/c562edf6fd66266890084749f259582b.jpg",
    price: 30000,
    description: "Stylish crossover for urban adventures",
  },
]

export default function CarCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-play effect - always on
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredCars.length)
    }, 4000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

 

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-CM", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main carousel container */}
      <div className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl shadow-2xl">
        {featuredCars.map((car, index) => (
          <div
            key={car.id}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentIndex ? "translate-x-0" : index < currentIndex ? "-translate-x-full" : "translate-x-full"
            }`}
          >
            <div className="relative h-full bg-gradient-to-r from-black/50 to-transparent">
              <img
                src={car.image || "/placeholder.svg"}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover"
              />

              {/* Car info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                <div className="text-white">
                  <h3 className="text-3xl md:text-4xl font-bold mb-2">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-lg md:text-xl mb-4 opacity-90">{car.description}</p>
                  <div className="flex items-center flex-col md:flex-row space-y-1 md:justify-between">
                    <div className="text-2xl md:text-3xl font-bold text-cameroon-yellow">
                      {formatPrice(car.price)}
                      <span className="text-base font-normal text-white/80">/day</span>
                    </div>
                    <Button className="bg-cameroon-green hover:bg-green-700 text-white px-6 py-2">Book Now</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

     

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {featuredCars.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex ? "bg-cameroon-yellow scale-125" : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
