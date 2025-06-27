"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase, type RentalServicePayment } from "@/lib/supabase"
import AdminLayout from "@/components/AdminLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Smartphone, Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PaymentSetupPage() {
  const { userProfile } = useAuth()
  const { toast } = useToast()
  const [paymentMethods, setPaymentMethods] = useState<RentalServicePayment[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingMethod, setEditingMethod] = useState<RentalServicePayment | null>(null)
  const [formData, setFormData] = useState({
    payment_method: "",
    phone_number: "",
  })

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from("rental_service_payments")
        .select("*")
        .eq("rental_service_id", userProfile?.rental_service_id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setPaymentMethods(data || [])
    } catch (error) {
      console.error("Error fetching payment methods:", error)
      toast({
        title: "Error",
        description: "Failed to load payment methods",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingMethod) {
        // Update existing method
        const { error } = await supabase
          .from("rental_service_payments")
          .update({
            payment_method: formData.payment_method as "mtn_momo" | "orange_money",
            phone_number: formData.phone_number,
          })
          .eq("id", editingMethod.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Payment method updated successfully",
        })
      } else {
        // Add new method
        const { error } = await supabase.from("rental_service_payments").insert({
          rental_service_id: userProfile?.rental_service_id,
          payment_method: formData.payment_method as "mtn_momo" | "orange_money",
          phone_number: formData.phone_number,
          is_active: true,
        })

        if (error) throw error

        toast({
          title: "Success",
          description: "Payment method added successfully",
        })
      }

      // Reset form and refresh data
      setFormData({ payment_method: "", phone_number: "" })
      setShowAddForm(false)
      setEditingMethod(null)
      fetchPaymentMethods()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save payment method",
        variant: "destructive",
      })
    }
  }

  const deletePaymentMethod = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment method?")) return

    try {
      const { error } = await supabase.from("rental_service_payments").delete().eq("id", id)

      if (error) throw error

      setPaymentMethods(paymentMethods.filter((method) => method.id !== id))
      toast({
        title: "Success",
        description: "Payment method deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete payment method",
        variant: "destructive",
      })
    }
  }

  const toggleMethodStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase.from("rental_service_payments").update({ is_active: !isActive }).eq("id", id)

      if (error) throw error

      setPaymentMethods(
        paymentMethods.map((method) => (method.id === id ? { ...method, is_active: !isActive } : method)),
      )

      toast({
        title: "Success",
        description: `Payment method ${!isActive ? "activated" : "deactivated"}`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update payment method",
        variant: "destructive",
      })
    }
  }

  const startEdit = (method: RentalServicePayment) => {
    setEditingMethod(method)
    setFormData({
      payment_method: method.payment_method,
      phone_number: method.phone_number,
    })
    setShowAddForm(true)
  }

  const cancelEdit = () => {
    setEditingMethod(null)
    setFormData({ payment_method: "", phone_number: "" })
    setShowAddForm(false)
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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Setup</h1>
            <p className="text-gray-600">Configure your payment methods to receive payments</p>
          </div>
          {!showAddForm && (
            <Button onClick={() => setShowAddForm(true)} className="btn-cameroon">
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingMethod ? "Edit Payment Method" : "Add Payment Method"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="payment_method">Payment Method *</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.payment_method === "mtn_momo"
                          ? "border-cameroon-green bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setFormData({ ...formData, payment_method: "mtn_momo" })}
                    >
                      <div className="flex items-center">
                        <Smartphone className="h-6 w-6 text-orange-500 mr-3" />
                        <div>
                          <div className="font-medium">MTN Mobile Money</div>
                          <div className="text-sm text-gray-600">MTN MoMo payments</div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.payment_method === "orange_money"
                          ? "border-cameroon-green bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setFormData({ ...formData, payment_method: "orange_money" })}
                    >
                      <div className="flex items-center">
                        <Smartphone className="h-6 w-6 text-orange-600 mr-3" />
                        <div>
                          <div className="font-medium">Orange Money</div>
                          <div className="text-sm text-gray-600">Orange Money payments</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone_number">Phone Number *</Label>
                  <Input
                    id="phone_number"
                    type="tel"
                    placeholder="+237 6XX XXX XXX"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <Button type="button" variant="outline" onClick={cancelEdit} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 btn-cameroon">
                    {editingMethod ? "Update Method" : "Add Method"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Payment Methods List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Configured Payment Methods</h2>

          {paymentMethods.length > 0 ? (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <Card key={method.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gray-100 rounded-full p-3">
                          <Smartphone className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {method.payment_method === "mtn_momo" ? "MTN Mobile Money" : "Orange Money"}
                          </div>
                          <div className="text-sm text-gray-600">{method.phone_number}</div>
                          <div className="text-xs text-gray-500">
                            Added {new Date(method.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Badge
                          className={method.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                        >
                          {method.is_active ? "Active" : "Inactive"}
                        </Badge>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => startEdit(method)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleMethodStatus(method.id, method.is_active)}
                          >
                            {method.is_active ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deletePaymentMethod(method.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No payment methods configured</h3>
                <p className="text-gray-600 mb-4">Add payment methods to start receiving payments from customers.</p>
                <Button onClick={() => setShowAddForm(true)} className="btn-cameroon">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Payment Method
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Information Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2 text-blue-900">Important Information</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Payment methods must be verified before customers can make payments</li>
              <li>• You can have multiple payment methods active at the same time</li>
              <li>• Customers will see all active payment methods during checkout</li>
              <li>• Ensure your phone numbers are correct and accessible</li>
              <li>• You'll receive payment notifications on the configured numbers</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
