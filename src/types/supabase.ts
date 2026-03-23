export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cafes: {
        Row: {
          id: string
          name: string
          lat: number
          lng: number
          kakao_place_url: string | null
          address: string | null
          has_parking: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          lat: number
          lng: number
          kakao_place_url?: string | null
          address?: string | null
          has_parking?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          lat?: number
          lng?: number
          kakao_place_url?: string | null
          address?: string | null
          has_parking?: boolean | null
          created_at?: string | null
        }
        Relationships: []
      }
      work_environments: {
        Row: {
          id: string
          cafe_id: string | null
          plug_score: number | null
          wifi_score: number | null
          noise_level: number | null
          time_limit: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          cafe_id?: string | null
          plug_score?: number | null
          wifi_score?: number | null
          noise_level?: number | null
          time_limit?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          cafe_id?: string | null
          plug_score?: number | null
          wifi_score?: number | null
          noise_level?: number | null
          time_limit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_environments_cafe_id_fkey"
            columns: ["cafe_id"]
            isOneToOne: false
            referencedRelation: "cafes"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          id: string
          cafe_id: string | null
          user_id: string | null
          content: string
          features: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          cafe_id?: string | null
          user_id?: string | null
          content: string
          features?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          cafe_id?: string | null
          user_id?: string | null
          content?: string
          features?: Json | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_cafe_id_fkey"
            columns: ["cafe_id"]
            isOneToOne: false
            referencedRelation: "cafes"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_messages: {
        Row: {
          id: string
          cafe_id: string | null
          user_id: string | null
          sender_name: string
          message: string
          created_at: string | null
        }
        Insert: {
          id?: string
          cafe_id?: string | null
          user_id?: string | null
          sender_name: string
          message: string
          created_at?: string | null
        }
        Update: {
          id?: string
          cafe_id?: string | null
          user_id?: string | null
          sender_name?: string
          message?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_cafe_id_fkey"
            columns: ["cafe_id"]
            isOneToOne: false
            referencedRelation: "cafes"
            referencedColumns: ["id"]
          }
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
