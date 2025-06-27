"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gift, Clock, Users, Star, Calendar, Percent, Trophy, Heart, ChevronLeft, ChevronRight } from "lucide-react"

export default function PromotionalSections() {
  const [currentPromoSlide, setCurrentPromoSlide] = useState(0)
  const [currentDealSlide, setCurrentDealSlide] = useState(0)

  const promotions = [
    {
      id: 1,
      title: "Weekend Special",
      description: "Get 20% off on weekend bookings",
      discount: "20% OFF",
      validUntil: "2024-12-31",
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "First Time Rental",
      description: "New customers get 15% discount",
      discount: "15% OFF",
      validUntil: "2024-12-31",
      icon: Gift,
      color: "bg-green-500",
    },
    {
      id: 3,
      title: "Long Term Rental",
      description: "Book for 7+ days and save 25%",
      discount: "25% OFF",
      validUntil: "2024-12-31",
      icon: Clock,
      color: "bg-purple-500",
    },
    {
      id: 4,
      title: "Group Booking",
      description: "Book 3+ cars and get special rates",
      discount: "30% OFF",
      validUntil: "2024-12-31",
      icon: Users,
      color: "bg-orange-500",
    },
    {
      id: 5,
      title: "Student Discount",
      description: "Students get special pricing",
      discount: "18% OFF",
      validUntil: "2024-12-31",
      icon: Star,
      color: "bg-indigo-500",
    },
    {
      id: 6,
      title: "Corporate Rates",
      description: "Business customers save more",
      discount: "22% OFF",
      validUntil: "2024-12-31",
      icon: Users,
      color: "bg-teal-500",
    },
  ]

  const loyaltyProgram = {
    title: "MobiRent Loyalty Program",
    description: "Earn points with every rental and unlock exclusive benefits",
    benefits: [
      "Earn 1 point per 1000 XAF spent",
      "Free rental after 10 bookings",
      "Priority customer support",
      "Exclusive member-only cars",
      "Birthday month 50% discount",
    ],
  }

  const featuredDeals = [
    {
      id: 1,
      title: "Toyota Camry - Flash Sale",
      originalPrice: 25000,
      salePrice: 18000,
      image:
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      timeLeft: "2 days left",
      location: "Yaoundé",
    },
    {
      id: 2,
      title: "Honda CR-V - Limited Offer",
      originalPrice: 35000,
      salePrice: 28000,
      image:
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      timeLeft: "5 days left",
      location: "Douala",
    },
    {
      id: 3,
      title: "BMW X3 - Premium Deal",
      originalPrice: 45000,
      salePrice: 35000,
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      timeLeft: "1 day left",
      location: "Yaoundé",
    },
    {
      id: 4,
      title: "Mercedes C-Class - Luxury Sale",
      originalPrice: 50000,
      salePrice: 38000,
      image:
        "https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      timeLeft: "3 days left",
      location: "Douala",
    },
  ]

  // Auto-scroll for promotions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoSlide((prev) => (prev + 1) % Math.ceil(promotions.length / 4))
    }, 5000)
    return () => clearInterval(interval)
  }, [promotions.length])

  // Auto-scroll for deals
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDealSlide((prev) => (prev + 1) % Math.ceil(featuredDeals.length / 2))
    }, 4000)
    return () => clearInterval(interval)
  }, [featuredDeals.length])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-CM", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const nextPromoSlide = () => {
    setCurrentPromoSlide((prev) => (prev + 1) % Math.ceil(promotions.length / 4))
  }

  const prevPromoSlide = () => {
    setCurrentPromoSlide((prev) => (prev - 1 + Math.ceil(promotions.length / 4)) % Math.ceil(promotions.length / 4))
  }

  const nextDealSlide = () => {
    setCurrentDealSlide((prev) => (prev + 1) % Math.ceil(featuredDeals.length / 2))
  }

  const prevDealSlide = () => {
    setCurrentDealSlide(
      (prev) => (prev - 1 + Math.ceil(featuredDeals.length / 2)) % Math.ceil(featuredDeals.length / 2),
    )
  }

  return (
    <div className="space-y-16">
      {/* Current Promotions - Auto-scrolling Carousel */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Special Offers</h2>
          <p className="text-lg text-gray-600">Don't miss out on these amazing deals</p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentPromoSlide * 100}%)` }}
            >
              {Array.from({ length: Math.ceil(promotions.length / 4) }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {promotions.slice(slideIndex * 4, (slideIndex + 1) * 4).map((promo) => {
                      const IconComponent = promo.icon
                      return (
                        <Card key={promo.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                          <div
                            className={`absolute top-0 right-0 ${promo.color} text-white px-3 py-1 text-sm font-bold`}
                          >
                            {promo.discount}
                          </div>
                          <CardHeader className="pb-3">
                            <div
                              className={`${promo.color} rounded-full w-12 h-12 flex items-center justify-center mb-3`}
                            >
                              <IconComponent className="h-6 w-6 text-white" />
                            </div>
                            <CardTitle className="text-lg">{promo.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p className="text-sm text-gray-600">{promo.description}</p>
                            <div className="text-xs text-gray-500">
                              Valid until: {new Date(promo.validUntil).toLocaleDateString()}
                            </div>
                            <Button size="sm" className="w-full btn-cameroon">
                              Learn More
                            </Button>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          {Math.ceil(promotions.length / 4) > 1 && (
            <>
              <button
                onClick={prevPromoSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextPromoSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Dots indicator */}
          {Math.ceil(promotions.length / 4) > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: Math.ceil(promotions.length / 4) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPromoSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentPromoSlide ? "bg-cameroon-green w-6" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Flash Deals - Auto-scrolling Carousel */}
      <section className="bg-gradient-to-r from-cameroon-red to-red-600 text-white py-12 rounded-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">⚡ Flash Deals</h2>
          <p className="text-xl opacity-90">Limited time offers on premium cars</p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentDealSlide * 100}%)` }}
            >
              {Array.from({ length: Math.ceil(featuredDeals.length / 2) }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid md:grid-cols-2 gap-6 px-4">
                    {featuredDeals.slice(slideIndex * 2, (slideIndex + 1) * 2).map((deal) => (
                      <Card key={deal.id} className="overflow-hidden">
                        <div className="relative">
                          <img
                            src={deal.image || "/placeholder.svg"}
                            alt={deal.title}
                            className="w-full h-48 object-cover"
                          />
                          <Badge className="absolute top-2 right-2 bg-red-500 text-white">{deal.timeLeft}</Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-gray-900 mb-2">{deal.title}</h3>
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="text-sm text-gray-500 line-through">
                                {formatPrice(deal.originalPrice)}
                              </div>
                              <div className="text-xl font-bold text-cameroon-green">{formatPrice(deal.salePrice)}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">{deal.location}</div>
                              <div className="text-lg font-bold text-red-500">
                                {Math.round(((deal.originalPrice - deal.salePrice) / deal.originalPrice) * 100)}% OFF
                              </div>
                            </div>
                          </div>
                          <Button className="w-full btn-cameroon">Book Now</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          {Math.ceil(featuredDeals.length / 2) > 1 && (
            <>
              <button
                onClick={prevDealSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={nextDealSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all"
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
            </>
          )}

          {/* Dots indicator */}
          {Math.ceil(featuredDeals.length / 2) > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: Math.ceil(featuredDeals.length / 2) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentDealSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentDealSlide ? "bg-white w-6" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Loyalty Program */}
      <section>
        <Card className="bg-gradient-to-r from-cameroon-yellow to-yellow-500 text-gray-900">
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <Trophy className="h-8 w-8 mr-3" />
                  <h2 className="text-3xl font-bold">{loyaltyProgram.title}</h2>
                </div>
                <p className="text-lg mb-6 opacity-90">{loyaltyProgram.description}</p>

                <div className="space-y-3 mb-6">
                  {loyaltyProgram.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <Star className="h-5 w-5 mr-3 text-gray-700" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800">
                  Join Loyalty Program
                </Button>
              </div>

              <div className="text-center">
                <div className="bg-white/20 rounded-full w-48 h-48 mx-auto flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Heart className="h-16 w-16 mx-auto mb-2" />
                    <div className="text-2xl font-bold">VIP</div>
                    <div className="text-sm">Member</div>
                  </div>
                </div>
                <div className="text-sm opacity-75">Join over 5,000+ satisfied members</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Seasonal Campaign */}
      <section className="bg-gradient-to-r from-green-600 to-cameroon-green text-white py-12 rounded-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">🎄 Holiday Season Special</h2>
          <p className="text-xl mb-6 opacity-90">Celebrate the holidays with our exclusive car rental packages</p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white/10 p-6 rounded-lg">
              <Percent className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Family Package</h3>
              <p className="text-sm opacity-90">SUVs and minivans at 30% off for family trips</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <Gift className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Gift Vouchers</h3>
              <p className="text-sm opacity-90">Perfect gifts for your loved ones</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <Clock className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Extended Rentals</h3>
              <p className="text-sm opacity-90">Book for the entire holiday season</p>
            </div>
          </div>

          <Button size="lg" className="bg-cameroon-yellow text-gray-900 hover:bg-yellow-500">
            Explore Holiday Deals
          </Button>
        </div>
      </section>
    </div>
  )
}
