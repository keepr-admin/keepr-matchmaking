export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      docs: {
        Row: {
          brand: string | null
          created_at: string
          doc_id: string
          model: string | null
          serial_number: string | null
          type: Database["public"]["Enums"]["product_type"]
          updated_at: string
        }
        Insert: {
          brand?: string | null
          created_at?: string
          doc_id?: string
          model?: string | null
          serial_number?: string | null
          type: Database["public"]["Enums"]["product_type"]
          updated_at?: string
        }
        Update: {
          brand?: string | null
          created_at?: string
          doc_id?: string
          model?: string | null
          serial_number?: string | null
          type?: Database["public"]["Enums"]["product_type"]
          updated_at?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string
          created_at: string
          description: string | null
          google_maps_link: string | null
          location_id: string
          name: string
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          description?: string | null
          google_maps_link?: string | null
          location_id?: string
          name: string
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          description?: string | null
          google_maps_link?: string | null
          location_id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          is_public: boolean
          message_id: string
          recipient_id: string | null
          repair_id: string | null
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          is_public?: boolean
          message_id?: string
          recipient_id?: string | null
          repair_id?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          is_public?: boolean
          message_id?: string
          recipient_id?: string | null
          repair_id?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_repair_id_fkey"
            columns: ["repair_id"]
            isOneToOne: false
            referencedRelation: "repair_requests"
            referencedColumns: ["repair_id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          created_at: string
          doc_id: string | null
          model: string | null
          product_id: string
          serial_number: string | null
          status: Database["public"]["Enums"]["product_status"]
          type: Database["public"]["Enums"]["product_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          brand?: string | null
          created_at?: string
          doc_id?: string | null
          model?: string | null
          product_id?: string
          serial_number?: string | null
          status?: Database["public"]["Enums"]["product_status"]
          type: Database["public"]["Enums"]["product_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          brand?: string | null
          created_at?: string
          doc_id?: string | null
          model?: string | null
          product_id?: string
          serial_number?: string | null
          status?: Database["public"]["Enums"]["product_status"]
          type?: Database["public"]["Enums"]["product_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_doc_id_fkey"
            columns: ["doc_id"]
            isOneToOne: false
            referencedRelation: "docs"
            referencedColumns: ["doc_id"]
          },
        ]
      }
      profiles: {
        Row: {
          city: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          number: number | null
          phone_number: string | null
          postal_code: string | null
          receive_requests: boolean | null
          street: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          number?: number | null
          phone_number?: string | null
          postal_code?: string | null
          receive_requests?: boolean | null
          street?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          number?: number | null
          phone_number?: string | null
          postal_code?: string | null
          receive_requests?: boolean | null
          street?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      repair_requests: {
        Row: {
          created_at: string
          description: string
          product_id: string
          repair_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          product_id: string
          repair_id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          product_id?: string
          repair_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "repair_requests_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      repair_timeslots: {
        Row: {
          created_at: string
          id: string
          is_confirmed: boolean
          repair_id: string
          timeslot_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_confirmed?: boolean
          repair_id: string
          timeslot_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_confirmed?: boolean
          repair_id?: string
          timeslot_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "repair_timeslots_repair_id_fkey"
            columns: ["repair_id"]
            isOneToOne: false
            referencedRelation: "repair_requests"
            referencedColumns: ["repair_id"]
          },
          {
            foreignKeyName: "repair_timeslots_timeslot_id_fkey"
            columns: ["timeslot_id"]
            isOneToOne: false
            referencedRelation: "timeslots"
            referencedColumns: ["timeslot_id"]
          },
        ]
      }
      timeslots: {
        Row: {
          available: boolean
          capacity: number
          created_at: string
          date_time: string
          location_id: string
          no_spots: number | null
          reserved: boolean
          resulting_spots: number | null
          spots_reserved: number | null
          spots_taken: number
          timeslot_id: string
          updated_at: string
        }
        Insert: {
          available?: boolean
          capacity?: number
          created_at?: string
          date_time: string
          location_id: string
          no_spots?: number | null
          reserved?: boolean
          resulting_spots?: number | null
          spots_reserved?: number | null
          spots_taken?: number
          timeslot_id?: string
          updated_at?: string
        }
        Update: {
          available?: boolean
          capacity?: number
          created_at?: string
          date_time?: string
          location_id?: string
          no_spots?: number | null
          reserved?: boolean
          resulting_spots?: number | null
          spots_reserved?: number | null
          spots_taken?: number
          timeslot_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeslots_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["location_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_available_repair_timeslots: {
        Args: { repair_id: string }
        Returns: {
          timeslot_id: string
          date_time: string
          location_id: string
          location_name: string
          is_available: boolean
          capacity: number
          spots_taken: number
          spots_available: number
        }[]
      }
    }
    Enums: {
      product_status: "live" | "broken" | "inactive" | "transferable"
      product_type:
        | "Vacuum cleaner"
        | "Coffee machine"
        | "TV"
        | "Radio"
        | "Lighting"
        | "Fume hood"
        | "Laptop"
        | "Smartphone"
        | "Other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      product_status: ["live", "broken", "inactive", "transferable"],
      product_type: [
        "Vacuum cleaner",
        "Coffee machine",
        "TV",
        "Radio",
        "Lighting",
        "Fume hood",
        "Laptop",
        "Smartphone",
        "Other",
      ],
    },
  },
} as const
