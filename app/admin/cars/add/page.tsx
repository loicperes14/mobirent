"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import AdminLayout from "@/components/AdminLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const carBrands = [
  "Toyota",
  "Honda",
  "Nissan",
  "Hyundai",
  "Kia",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volkswagen",
  "Ford",
  "Chevrolet",
  "Peugeot",
  "Renault",
]

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

export default function AddCarPage() {
  const router = useRouter()
  const { userProfile } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    price_per_day: "",
    city: "",
    branch_name: "",
    address: "",
    status: "available",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        })
        return
      }
      setImageFile(file)
    }
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `car-images/${fileName}`

      const { error: uploadError } = await supabase.storage.from("car-images").upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("car-images").getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Upload image if provided
      let imageUrl = null
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
        if (!imageUrl) {
          throw new Error("Failed to upload image")
        }
      }

      // Create or find location
      let locationId = null
      const { data: existingLocation } = await supabase
        .from("locations")
        .select("id")
        .eq("city", formData.city)
        .eq("branch_name", formData.branch_name)
        .single()

      if (existingLocation) {
        locationId = existingLocation.id
      } else {
        const { data: newLocation, error: locationError } = await supabase
          .from("locations")
          .insert({
            city: formData.city,
            branch_name: formData.branch_name,
            address: formData.address,
          })
          .select()
          .single()

        if (locationError) throw locationError
        locationId = newLocation.id
      }

      // Create car
      const { error: carError } = await supabase.from("cars").insert({
        brand: formData.brand,
        model: formData.model,
        image_url: imageUrl,
        price_per_day: Number.parseFloat(formData.price_per_day),
        location_id: locationId,
        rental_service_id: userProfile?.rental_service_id,
        status: formData.status,
      })

      if (carError) throw carError

      toast({
        title: "Success",
        description: "Car added successfully",
      })

      router.push("/admin/cars")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add car",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/admin/cars">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cars
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Car</h1>
            <p className="text-gray-600">Add a new car to your fleet</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Car Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Car Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Brand *</Label>
                  <Select value={formData.brand} onValueChange={(value) => handleInputChange("brand", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {carBrands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    type="text"
                    placeholder="e.g., Camry, Accord"
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="price_per_day">Price per Day (XAF) *</Label>
                <Input
                  id="price_per_day"
                  type="number"
                  placeholder="25000"
                  value={formData.price_per_day}
                  onChange={(e) => handleInputChange("price_per_day", e.target.value)}
                  required
                />
              </div>

              {/* Location Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Select value={formData.city} onValueChange={(value) => handleInputChange("city", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
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
                      placeholder="Main Branch, Downtown"
                      value={formData.branch_name}
                      onChange={(e) => handleInputChange("branch_name", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Full address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Image Upload */}
              <div>
                <Label htmlFor="image">Car Image</Label>
                <div className="mt-2">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        {imageFile ? imageFile.name : "Click to upload image"}
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    </div>
                    <input id="image" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              <div className="flex space-x-4">
                <Link href="/admin/cars" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="flex-1 btn-cameroon" disabled={loading}>
                  {loading ? "Adding..." : "Add Car"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
