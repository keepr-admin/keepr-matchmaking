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
          google_maps_link: string | null
          location_id: string
          name: string
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          google_maps_link?: string | null
          location_id?: string
          name: string
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
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
          created_at: string
          date_time: string
          location_id: string
          reserved: boolean
          timeslot_id: string
          updated_at: string
        }
        Insert: {
          available?: boolean
          created_at?: string
          date_time: string
          location_id: string
          reserved?: boolean
          timeslot_id?: string
          updated_at?: string
        }
        Update: {
          available?: boolean
          created_at?: string
          date_time?: string
          location_id?: string
          reserved?: boolean
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
      [_ in never]: never
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
