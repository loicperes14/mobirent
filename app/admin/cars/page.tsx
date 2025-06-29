"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase, type Car } from "@/lib/supabase"
import AdminLayout from "@/components/AdminLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CarIcon, Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function AdminCarsPage() {
  const { userProfile } = useAuth()
  const { toast } = useToast()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select(`
          *,
          location:locations(*)
        `)
        .eq("rental_service_id", userProfile?.rental_service_id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setCars(data || [])
    } catch (error) {
      console.error("Error fetching cars:", error)
      toast({
        title: "Error",
        description: "Failed to load cars",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteCar = async (carId: string) => {
    if (!confirm("Are you sure you want to delete this car?")) return

    try {
      const { error } = await supabase.from("cars").delete().eq("id", carId)

      if (error) throw error

      setCars(cars.filter((car) => car.id !== carId))
      toast({
        title: "Success",
        description: "Car deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete car",
        variant: "destructive",
      })
    }
  }

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      searchTerm === "" ||
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || car.status === statusFilter

    return matchesSearch && matchesStatus
  })

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
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cameroon-green"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cars Management</h1>
            <p className="text-gray-600">Manage your car fleet</p>
          </div>
          <Link href="/admin/cars/add">
            <Button className="btn-cameroon">
              <Plus className="h-4 w-4 mr-2" />
              Add New Car
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search cars..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cars Grid */}
        {filteredCars.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <Card key={car.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={car.image_url || "/placeholder.svg?height=200&width=300"}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                  <Badge className={`absolute top-2 right-2 ${getStatusColor(car.status)}`}>
                    {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{car.location?.city}</p>
                  <div className="text-xl font-bold text-cameroon-green mb-4">{formatPrice(car.price_per_day)}/day</div>
                  <div className="flex space-x-2">
                    <Link href={`/cars/${car.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/admin/cars/edit/${car.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteCar(car.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <CarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No cars found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "No cars match your current filters."
                  : "You haven't added any cars yet."}
              </p>
              <Link href="/admin/cars/add">
                <Button className="btn-cameroon">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Car
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
