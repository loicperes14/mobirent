[?25l
    Select a project:                                                                                   
                                                                                                        
  >  1. uerwzvietierdggpsufu [name: loicperes14's Project, org: peres sarl, region: eu-west-1]
                                                                                                        
                                                                                                        
    Ôåæ/k up ÔÇó Ôåô/j down ÔÇó / filter ÔÇó q quit ÔÇó ? more                                                      
                                                                                                        [0D[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[0D[2K [0D[2K[?25h[?1002l[?1003l[?1006lexport type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_status: string | null
          car_id: string | null
          created_at: string | null
          end_date: string
          id: string
          payment_status: string | null
          start_date: string
          total_price: number
          user_id: string | null
        }
        Insert: {
          booking_status?: string | null
          car_id?: string | null
          created_at?: string | null
          end_date: string
          id?: string
          payment_status?: string | null
          start_date: string
          total_price: number
          user_id?: string | null
        }
        Update: {
          booking_status?: string | null
          car_id?: string | null
          created_at?: string | null
          end_date?: string
          id?: string
          payment_status?: string | null
          start_date?: string
          total_price?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cars: {
        Row: {
          brand: string
          created_at: string | null
          id: string
          image_url: string | null
          location_id: string | null
          model: string
          price_per_day: number
          rental_service_id: string | null
          status: string | null
        }
        Insert: {
          brand: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          location_id?: string | null
          model: string
          price_per_day: number
          rental_service_id?: string | null
          status?: string | null
        }
        Update: {
          brand?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          location_id?: string | null
          model?: string
          price_per_day?: number
          rental_service_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cars_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cars_rental_service_id_fkey"
            columns: ["rental_service_id"]
            isOneToOne: false
            referencedRelation: "rental_services"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string
          branch_name: string
          city: string
          created_at: string | null
          id: string
        }
        Insert: {
          address: string
          branch_name: string
          city: string
          created_at?: string | null
          id?: string
        }
        Update: {
          address?: string
          branch_name?: string
          city?: string
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string | null
          id: string
          method: string
          paid_at: string | null
          status: string | null
          transaction_reference: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string | null
          id?: string
          method: string
          paid_at?: string | null
          status?: string | null
          transaction_reference?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string | null
          id?: string
          method?: string
          paid_at?: string | null
          status?: string | null
          transaction_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_service_payments: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          payment_method: string
          phone_number: string
          rental_service_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          payment_method: string
          phone_number: string
          rental_service_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          payment_method?: string
          phone_number?: string
          rental_service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rental_service_payments_rental_service_id_fkey"
            columns: ["rental_service_id"]
            isOneToOne: false
            referencedRelation: "rental_services"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_services: {
        Row: {
          address: string
          branch_name: string
          city: string
          company_name: string
          created_at: string | null
          description: string | null
          email: string
          id: string
          logo_url: string | null
          phone_number: string
          status: string | null
          website: string | null
        }
        Insert: {
          address: string
          branch_name: string
          city: string
          company_name: string
          created_at?: string | null
          description?: string | null
          email: string
          id?: string
          logo_url?: string | null
          phone_number: string
          status?: string | null
          website?: string | null
        }
        Update: {
          address?: string
          branch_name?: string
          city?: string
          company_name?: string
          created_at?: string | null
          description?: string | null
          email?: string
          id?: string
          logo_url?: string | null
          phone_number?: string
          status?: string | null
          website?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          car_id: string | null
          comment: string | null
          created_at: string | null
          id: string
          rating: number
          user_id: string | null
        }
        Insert: {
          car_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          rating: number
          user_id?: string | null
        }
        Update: {
          car_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          language: string | null
          location: string | null
          phone_number: string | null
          rental_service_id: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          language?: string | null
          location?: string | null
          phone_number?: string | null
          rental_service_id?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          language?: string | null
          location?: string | null
          phone_number?: string | null
          rental_service_id?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_rental_service_id_fkey"
            columns: ["rental_service_id"]
            isOneToOne: false
            referencedRelation: "rental_services"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
