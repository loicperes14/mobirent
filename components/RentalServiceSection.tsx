"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Users, TrendingUp, Shield, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function RentalServiceSection() {
  return (
    <section className="relative py-16 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden max-w-screen">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Partner with <span className="text-cameroon-green">MobiRent Cameroon</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Are you a car rental service? List your fleet and manage bookings easily on MobiRent Cameroon! Get started
            and get verified within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Benefits */}
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Reach More Customers</h3>
                  <p className="text-sm text-gray-600">Access thousands of potential customers across Cameroon</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Increase Revenue</h3>
                  <p className="text-sm text-gray-600">Maximize your fleet utilization and bookings</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Secure Payments</h3>
                  <p className="text-sm text-gray-600">Safe and reliable payment processing</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Easy Management</h3>
                  <p className="text-sm text-gray-600">Simple dashboard to manage your fleet</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                What You Get:
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Professional listing for your car rental business
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Real-time booking management system
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Integrated payment processing (MTN MoMo, Orange Money)
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Customer reviews and ratings system
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  24/7 customer support
                </li>
              </ul>
            </div>
          </div>

          {/* Right side - CTA */}
          <div className="text-center lg:text-left">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
              <Building2 className="h-16 w-16 text-cameroon-green mx-auto lg:mx-0 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Grow Your Business?</h3>
              <p className="text-gray-600 mb-6">
                Join the leading car rental platform in Cameroon and start reaching more customers today.
              </p>

              <div className="space-y-4">
                <Link href="/register-service">
                  <Button size="lg" className="w-full btn-cameroon text-lg py-6">
                    <Building2 className="h-5 w-5 mr-2" />
                    List Your Cars Now
                  </Button>
                </Link>

                <div className="text-sm text-gray-500">
                  <p>✓ Free to get started</p>
                  <p>✓ Verification within 24 hours</p>
                  <p>✓ No setup fees</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
