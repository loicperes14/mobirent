"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase, type Payment } from "@/lib/supabase"
import CustomerLayout from "@/components/CustomerLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Search, Download, Calendar, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PaymentWithBooking extends Payment {
  booking?: {
    id: string
    start_date: string
    end_date: string
    car?: { brand: string; model: string; image_url: string }
  }
}

export default function CustomerPaymentsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [payments, setPayments] = useState<PaymentWithBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          booking:bookings(
            id,
            start_date,
            end_date,
            car:cars(brand, model, image_url)
          )
        `)
        .eq("booking.user_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setPayments(data || [])
    } catch (error) {
      console.error("Error fetching payments:", error)
      toast({
        title: "Error",
        description: "Failed to load payments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadReceipt = async (payment: PaymentWithBooking) => {
    try {
      // Generate PDF receipt (simplified version)
      const receiptData = {
        paymentId: payment.id,
        transactionRef: payment.transaction_reference,
        amount: payment.amount,
        method: payment.method,
        date: payment.paid_at,
        car: payment.booking?.car,
        bookingDates: {
          start: payment.booking?.start_date,
          end: payment.booking?.end_date,
        },
      }

      // Create a simple receipt content
      const receiptContent = `
        MOBIRENT CAMEROON - PAYMENT RECEIPT
        ===================================
        
        Payment ID: ${receiptData.paymentId}
        Transaction Ref: ${receiptData.transactionRef}
        Amount: ${formatPrice(receiptData.amount)}
        Payment Method: ${receiptData.method}
        Date: ${new Date(receiptData.date).toLocaleDateString()}
        
        Car: ${receiptData.car?.brand} ${receiptData.car?.model}
        Rental Period: ${new Date(receiptData.bookingDates.start!).toLocaleDateString()} - ${new Date(receiptData.bookingDates.end!).toLocaleDateString()}
        
        Thank you for choosing MobiRent Cameroon!
      `

      // Create and download as text file (in a real app, you'd use a PDF library)
      const blob = new Blob([receiptContent], { type: "text/plain" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `receipt-${payment.transaction_reference}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Success",
        description: "Receipt downloaded successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download receipt",
        variant: "destructive",
      })
    }
  }

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      searchTerm === "" ||
      payment.booking?.car?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.booking?.car?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transaction_reference?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter

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
      case "success":
        return "bg-green-100 text-green-800"
      case "initiated":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalPaid = filteredPayments
    .filter((p) => p.status === "success")
    .reduce((sum, payment) => sum + payment.amount, 0)

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cameroon-green"></div>
        </div>
      </CustomerLayout>
    )
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-600">View your rental payment transactions and download receipts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatPrice(totalPaid)}</div>
              <p className="text-xs text-muted-foreground">All successful payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{filteredPayments.length}</div>
              <p className="text-xs text-muted-foreground">Payment records</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful Payments</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cameroon-green">
                {filteredPayments.filter((p) => p.status === "success").length}
              </div>
              <p className="text-xs text-muted-foreground">Completed transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="initiated">Initiated</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
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

        {/* Payments List */}
        {filteredPayments.length > 0 ? (
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={payment.booking?.car?.image_url || "/placeholder.svg?height=60&width=80"}
                        alt={`${payment.booking?.car?.brand} ${payment.booking?.car?.model}`}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-semibold">
                          {payment.booking?.car?.brand} {payment.booking?.car?.model}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {payment.booking?.start_date && payment.booking?.end_date
                            ? `${new Date(payment.booking.start_date).toLocaleDateString()} - ${new Date(payment.booking.end_date).toLocaleDateString()}`
                            : "Rental period"}
                        </p>
                        <p className="text-xs text-gray-500">Ref: {payment.transaction_reference}</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="font-bold text-lg">{formatPrice(payment.amount)}</div>
                      <div className="text-sm text-gray-600">{payment.method}</div>
                      <Badge className={`mt-1 ${getStatusColor(payment.status)}`}>{payment.status}</Badge>
                    </div>

                    <div className="text-right space-y-2">
                      <div className="text-sm text-gray-600">
                        {payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : "Pending"}
                      </div>
                      {payment.status === "success" && (
                        <Button size="sm" variant="outline" onClick={() => downloadReceipt(payment)} className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Receipt
                        </Button>
                      )}
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
              <h3 className="text-lg font-semibold mb-2">No payments found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all"
                  ? "No payments match your current filters."
                  : "You don't have any payment records yet."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </CustomerLayout>
  )
}
