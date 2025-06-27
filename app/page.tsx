"use client"

import { useEffect, useState } from "react"
import { supabase, type Car, type Location } from "@/lib/supabase"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Star, Shield, Users, Award, Clock } from "lucide-react"
import Link from "next/link"
import CarCarousel from "@/components/CarCarousel"
import MobileFilters from "@/components/MobileFilters"
import PromotionalSections from "@/components/PromotionalSections"
import DynamicCarDisplay from "@/components/DynamicCarDisplay"
import RentalServiceSection from "@/components/RentalServiceSection"
import { cachedFetch } from "@/lib/cache"

export default function LandingPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [selectedBrand, setSelectedBrand] = useState<string>("")

  useEffect(() => {
    fetchCars()
    fetchLocations()
  }, [])

  const fetchCars = async () => {
    try {
      const data = await cachedFetch(
        "homepage_cars",
        async () => {
          const { data, error } = await supabase
            .from("cars")
            .select(`
              *,
              location:locations(*),
              rental_service:rental_services(*)
            `)
            .eq("status", "available")
            .order("created_at", { ascending: false })

          if (error) throw error
          return data || []
        },
        2 * 60 * 1000, // 2 minutes cache
      )

      setCars(data)
    } catch (error) {
      console.error("Error fetching cars:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLocations = async () => {
    try {
      const data = await cachedFetch(
        "locations",
        async () => {
          const { data, error } = await supabase.from("locations").select("*").order("city")
          if (error) throw error
          return data || []
        },
        10 * 60 * 1000, // 10 minutes cache
      )

      setLocations(data)
    } catch (error) {
      console.error("Error fetching locations:", error)
    }
  }

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      searchTerm === "" ||
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLocation = selectedLocation === "" || car.location?.city === selectedLocation

    const matchesBrand = selectedBrand === "" || car.brand === selectedBrand

    return matchesSearch && matchesLocation && matchesBrand
  })

  const uniqueBrands = [...new Set(cars.map((car) => car.brand))].sort()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section with radial blur background */}
      <section className="relative bg-gradient-to-r from-cameroon-green to-green-700 text-white py-12 md:py-20 overflow-hidden">
        {/* Radial blur background */}
        <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent"></div>
        <div className="absolute top-10 right-10 w-96 h-96 bg-cameroon-yellow/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-cameroon-red/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Rent Premium Cars in <span className="text-cameroon-yellow">Cameroon</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl">
                Discover the freedom of the road with our premium car rental service. From Yaoundé to Douala, we've got
                you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/auth">
                  <Button size="lg" className="bg-cameroon-yellow text-gray-900 hover:bg-yellow-500 text-lg px-8 py-3">
                    Start Your Journey
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-black hover:bg-white hover:text-cameroon-green text-lg px-8 py-3"
                  onClick={() => {
                    document.getElementById("cars-section")?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  Browse Cars
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-cameroon-yellow">500+</div>
                  <div className="text-sm opacity-80">Premium Cars</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-cameroon-yellow">50+</div>
                  <div className="text-sm opacity-80">Cities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-cameroon-yellow">24/7</div>
                  <div className="text-sm opacity-80">Support</div>
                </div>
              </div>
            </div>

            {/* Right side - Car carousel */}
            <div className="order-first lg:order-last">
              <CarCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with radial blur background */}
      <section className="relative py-16 bg-white overflow-hidden">
        {/* Radial blur background */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-200/30 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose MobiRent?</h2>
            <p className="text-lg text-gray-600">Experience the best car rental service in Cameroon</p>
          </div>

          {/* Mobile: Horizontal scroll */}
          <div className="md:hidden">
            <div className="flex space-x-6 overflow-x-auto pb-4 px-4 -mx-4 scrollbar-hide">
              {[
                { icon: Star, title: "Premium Quality", desc: "Well-maintained vehicles", color: "bg-cameroon-green" },
                {
                  icon: MapPin,
                  title: "Multiple Locations",
                  desc: "Available across Cameroon",
                  color: "bg-cameroon-red",
                },
                { icon: Shield, title: "Secure & Reliable", desc: "Safe payment methods", color: "bg-cameroon-yellow" },
                { icon: Users, title: "Expert Support", desc: "24/7 customer service", color: "bg-blue-600" },
                { icon: Award, title: "Best Prices", desc: "Competitive rates", color: "bg-purple-600" },
                { icon: Clock, title: "Quick Booking", desc: "Fast booking process", color: "bg-orange-600" },
              ].map((feature, index) => (
                <div key={index} className="text-center group flex-shrink-0 w-48">
                  <div
                    className={`${feature.color} rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-cameroon-green rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Well-maintained vehicles with regular servicing and quality assurance</p>
            </div>

            <div className="text-center group">
              <div className="bg-cameroon-red rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiple Locations</h3>
              <p className="text-gray-600">Available in major cities across Cameroon for your convenience</p>
            </div>

            <div className="text-center group">
              <div className="bg-cameroon-yellow rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-gray-900" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">Safe payment methods and comprehensive insurance coverage</p>
            </div>

            <div className="text-center group">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-600">Dedicated customer service team available 24/7 to assist you</p>
            </div>

            <div className="text-center group">
              <div className="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive rates with no hidden fees and transparent pricing</p>
            </div>

            <div className="text-center group">
              <div className="bg-orange-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Booking</h3>
              <p className="text-gray-600">Fast and easy booking process with instant confirmation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section with radial blur background */}
      <section className="relative py-8 bg-gray-100 overflow-hidden">
        {/* Radial blur background */}
        <div className="absolute top-0 left-1/2 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl transform -translate-x-1/2"></div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Cars</h2>
          <p className="text-lg text-gray-600">Choose from our premium fleet</p>
          <div className="text-sm text-gray-500 mt-2">
            {filteredCars.length} car{filteredCars.length !== 1 ? "s" : ""} available
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop filters */}
          <div className="hidden md:block">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search cars..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.city}>
                        {location.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All brands</SelectItem>
                    {uniqueBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedLocation("")
                    setSelectedBrand("")
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile filters */}
          <div className="md:hidden">
            <MobileFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              locations={locations}
              brands={uniqueBrands}
              onClearFilters={() => {
                setSearchTerm("")
                setSelectedLocation("")
                setSelectedBrand("")
              }}
            />
          </div>
        </div>
      </section>

      {/* Cars Section with radial blur background */}
      <section id="cars-section" className="relative py-16 bg-white overflow-hidden">
        {/* Radial blur background */}
        <div className="absolute top-10 right-10 w-80 h-80 bg-green-200/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-yellow-200/30 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DynamicCarDisplay cars={filteredCars} loading={loading} />

          {filteredCars.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No cars found matching your criteria.</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedLocation("")
                  setSelectedBrand("")
                }}
                className="mt-4 btn-cameroon"
              >
                View All Cars
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Rental Service Section */}
      <RentalServiceSection />

      {/* Promotional Sections with radial blur background */}
      <section className="relative py-16 bg-gray-50 overflow-hidden">
        {/* Radial blur background */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-red-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PromotionalSections />
        </div>
      </section>

      {/* CTA Section with radial blur background */}
      <section className="relative bg-cameroon-green text-white py-16 overflow-hidden">
        {/* Radial blur background */}
        <div className="absolute top-0 left-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Hit the Road?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers across Cameroon</p>
          <Link href="/auth">
            <Button size="lg" className="bg-cameroon-yellow text-gray-900 hover:bg-yellow-500 text-lg px-8 py-3">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">MobiRent Cameroon</h3>
              <p className="text-gray-400">Premium car rental service across Cameroon</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/auth" className="hover:text-white">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register-service" className="hover:text-white">
                    List Your Cars
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@mobirent.cm</li>
                <li>Phone: +237 6XX XXX XXX</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <p className="text-gray-400">Stay connected for updates and offers</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MobiRent Cameroon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
