"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Upload, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const cameroonCities = [
  "Yaoundé",
  "Douala",
  "Bamenda",
  "Bafoussam",
  "Garoua",
  "Maroua",
  "Ngaoundéré",
  "Bertoua",
  "Ebolowa",
  "Kribi",
]

export default function RegisterServicePage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    company_name: "",
    email: "",
    password: "",
    phone_number: "",
    city: "",
    branch_name: "",
    address: "",
    website: "",
    description: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Logo must be less than 5MB",
          variant: "destructive",
        })
        return
      }
      setLogoFile(file)
    }
  }

  const uploadLogo = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `rental-service-logos/${fileName}`

      const { error: uploadError } = await supabase.storage.from("rental-service-assets").upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("rental-service-assets").getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error("Error uploading logo:", error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Upload logo if provided
      let logoUrl = null
      if (logoFile) {
        logoUrl = await uploadLogo(logoFile)
        if (!logoUrl) {
          throw new Error("Failed to upload logo")
        }
      }

      // Create rental service entry
      const { data: rentalService, error: serviceError } = await supabase
        .from("rental_services")
        .insert({
          company_name: formData.company_name,
          email: formData.email,
          phone_number: formData.phone_number,
          city: formData.city,
          branch_name: formData.branch_name,
          address: formData.address,
          website: formData.website || null,
          description: formData.description,
          logo_url: logoUrl,
          status: "pending",
        })
        .select()
        .single()

      if (serviceError) throw serviceError

      // Sign up the user
      await signUp(formData.email, formData.password, {
        full_name: formData.company_name,
        phone_number: formData.phone_number,
        location: formData.city,
        role: "admin",
        rental_service_id: rentalService.id,
      })

      toast({
        title: "Registration Successful!",
        description: "Your rental service has been submitted for review.",
      })

      router.push("/admin-pending")
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="bg-cameroon-green rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Register Your Rental Service</CardTitle>
            <CardDescription>Join MobiRent Cameroon and start managing your car rental business online</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_name">Company Name *</Label>
                    <Input
                      id="company_name"
                      type="text"
                      placeholder="Your Company Name"
                      value={formData.company_name}
                      onChange={(e) => handleInputChange("company_name", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="company@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a secure password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone_number">Phone Number *</Label>
                    <Input
                      id="phone_number"
                      type="tel"
                      placeholder="+237 6XX XXX XXX"
                      value={formData.phone_number}
                      onChange={(e) => handleInputChange("phone_number", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Company Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us about your car rental service..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    required
                  />
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Location Information</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Select value={formData.city} onValueChange={(value) => handleInputChange("city", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cameroonCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="branch_name">Branch Name *</Label>
                    <Input
                      id="branch_name"
                      type="text"
                      placeholder="Main Branch, Downtown, etc."
                      value={formData.branch_name}
                      onChange={(e) => handleInputChange("branch_name", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Full Address *</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Street address, building number, etc."
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Logo Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Company Logo</h3>
                <div>
                  <Label htmlFor="logo">Upload Logo (Optional)</Label>
                  <div className="mt-2">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          {logoFile ? logoFile.name : "Click to upload logo"}
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                      </div>
                      <input id="logo" type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                    </label>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full btn-cameroon" disabled={loading}>
                {loading ? "Registering..." : "Register Rental Service"}
              </Button>

              <div className="text-sm text-gray-600 text-center">
                <p>By registering, you agree to our terms of service and privacy policy.</p>
                <p className="mt-2">Your service will be reviewed and verified within 24 hours.</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
