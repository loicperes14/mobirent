"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { supabase, type RentalService } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Building2, Mail, Phone, MapPin, Globe, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AdminPendingPage() {
  const { user, userProfile } = useAuth()
  const router = useRouter()
  const [rentalService, setRentalService] = useState<RentalService | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !userProfile) {
      router.push("/auth")
      return
    }

    if (userProfile.role !== "admin") {
      router.push("/dashboard")
      return
    }

    fetchRentalService()
  }, [user, userProfile, router])

  const fetchRentalService = async () => {
    if (!userProfile?.rental_service_id) {
      router.push("/dashboard")
      return
    }

    try {
      const { data, error } = await supabase
        .from("rental_services")
        .select("*")
        .eq("id", userProfile.rental_service_id)
        .single()

      if (error) throw error

      if (data.status === "approved") {
        router.push("/admin")
        return
      }

      setRentalService(data)
    } catch (error) {
      console.error("Error fetching rental service:", error)
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cameroon-green"></div>
      </div>
    )
  }

  if (!rentalService) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">Service Not Found</h1>
            <p className="text-gray-600 mb-4">Unable to find your rental service information.</p>
            <Link href="/dashboard">
              <Button className="btn-cameroon">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Clock className="h-10 w-10 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Under Review</h1>
          <p className="text-lg text-gray-600">
            Your rental service is being verified and will be approved within 24 hours.
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-8 border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-yellow-800">Status: Pending Review</span>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-yellow-700">
                Our team is reviewing your application. You'll receive an email notification once approved.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Service Information */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Company Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {rentalService.logo_url && (
                <div className="text-center">
                  <img
                    src={rentalService.logo_url || "/placeholder.svg"}
                    alt={`${rentalService.company_name} logo`}
                    className="w-24 h-24 object-contain mx-auto rounded-lg border"
                  />
                </div>
              )}

              <div>
                <h3 className="font-semibold text-lg">{rentalService.company_name}</h3>
                <p className="text-gray-600">{rentalService.description}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-3 text-gray-400" />
                  <span>{rentalService.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-3 text-gray-400" />
                  <span>{rentalService.phone_number}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                  <span>
                    {rentalService.address}, {rentalService.city}
                  </span>
                </div>
                {rentalService.website && (
                  <div className="flex items-center text-sm">
                    <Globe className="h-4 w-4 mr-3 text-gray-400" />
                    <a
                      href={rentalService.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {rentalService.website}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card>
            <CardHeader>
              <CardTitle>What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Document Verification</h4>
                    <p className="text-sm text-gray-600">
                      Our team reviews your company information and documentation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Approval Notification</h4>
                    <p className="text-sm text-gray-600">
                      You'll receive an email confirmation once your service is approved.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Start Managing</h4>
                    <p className="text-sm text-gray-600">
                      Access your admin dashboard to list cars and manage bookings.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mt-6">
                <h4 className="font-medium mb-2">Once Approved, You Can:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• List and manage your car fleet</li>
                  <li>• View and manage customer bookings</li>
                  <li>• Track payments and revenue</li>
                  <li>• Set up payment methods</li>
                  <li>• Update your business profile</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">Need help or have questions about your application?</p>
          <div className="space-x-4">
            <Button variant="outline">Contact Support</Button>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
