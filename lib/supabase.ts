import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://ixrnkliyxefrkgnccopv.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cm5rbGl5eGVmcmtnbmNjb3B2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNDg2NzUsImV4cCI6MjA2NTgyNDY3NX0.g9poVjepozhLDGrM4qVsT1czfQS7j7tLy2HxvL34F_Y"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface User {
  id: string
  full_name: string
  phone_number: string
  email: string
  location: string
  role: "customer" | "admin"
  rental_service_id?: string
  language: "en" | "fr"
  created_at: string
}

export interface RentalService {
  id: string
  company_name: string
  email: string
  phone_number: string
  city: string
  branch_name: string
  address: string
  website?: string
  description: string
  logo_url?: string
  status: "pending" | "approved" | "rejected"
  created_at: string
}

export interface RentalServicePayment {
  id: string
  rental_service_id: string
  payment_method: "mtn_momo" | "orange_money"
  phone_number: string
  is_active: boolean
  created_at: string
}

export interface Location {
  id: string
  city: string
  branch_name: string
  address: string
}

export interface Car {
  id: string
  brand: string
  model: string
  image_url: string
  price_per_day: number
  location_id: string
  rental_service_id?: string
  status: "available" | "booked" | "maintenance"
  created_at: string
  location?: Location
  rental_service?: RentalService
}

export interface Booking {
  id: string
  user_id: string
  car_id: string
  start_date: string
  end_date: string
  total_price: number
  payment_status: "pending" | "paid" | "failed"
  booking_status: "confirmed" | "cancelled" | "completed"
  created_at: string
  car?: Car
  user?: User
}

export interface Payment {
  id: string
  booking_id: string
  method: string
  amount: number
  transaction_reference: string
  status: "initiated" | "success" | "failed"
  paid_at: string
  created_at: string
}

export interface Review {
  id: string
  user_id: string
  car_id: string
  rating: number
  comment: string
  created_at: string
  user?: User
}

export interface Notification {
  id: string
  user_id: string
  message: string
  is_read: boolean
  created_at: string
}
