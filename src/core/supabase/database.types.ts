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
                    full_name: string | null
                    first_name: string | null
                    avatar_url: string | null
                    base_currency: string
                    updated_at: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    first_name?: string | null
                    avatar_url?: string | null
                    base_currency?: string
                    updated_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    first_name?: string | null
                    avatar_url?: string | null
                    base_currency?: string
                    updated_at?: string | null
                    created_at?: string
                }
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
