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
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          firebase_user_id: string | null
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          firebase_user_id?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          firebase_user_id?: string | null
          updated_at?: string
        }
      }
      groceries: {
        Row: {
          id: string
          user_id: string
          name: string
          expiry_date: string
          scale_number: number
          weight: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          expiry_date: string
          scale_number: number
          weight?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          expiry_date?: string
          scale_number?: number
          weight?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}