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
                Relationships: []
            },
            monthly_records: {
                Row: {
                    id: string
                    user_id: string
                    type: string
                    description: string
                    origin: string | null
                    category: string | null
                    amount: number
                    status: string
                    occurred_at: string
                    reference_month: string
                    observations: string | null
                    created_at: string
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    type: string
                    description: string
                    origin?: string | null
                    category?: string | null
                    amount?: number
                    status?: string
                    occurred_at: string
                    reference_month: string
                    observations?: string | null
                    created_at?: string
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    type?: string
                    description?: string
                    origin?: string | null
                    category?: string | null
                    amount?: number
                    status?: string
                    occurred_at?: string
                    reference_month?: string
                    observations?: string | null
                    created_at?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "monthly_records_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            },
            debt_plans: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    total_amount: number
                    remaining_amount: number
                    monthly_payment: number
                    interest_rate: number
                    priority: string
                    start_date: string
                    end_date: string | null
                    total_installments: number
                    paid_installments: number
                    created_at: string
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    total_amount: number
                    remaining_amount: number
                    monthly_payment: number
                    interest_rate?: number
                    priority?: string
                    start_date: string
                    end_date?: string | null
                    total_installments: number
                    paid_installments?: number
                    created_at?: string
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    total_amount?: number
                    remaining_amount?: number
                    monthly_payment?: number
                    interest_rate?: number
                    priority?: string
                    start_date?: string
                    end_date?: string | null
                    total_installments?: number
                    paid_installments?: number
                    created_at?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "debt_plans_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            },
            investments: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    type: string;
                    target_amount: number;
                    initial_amount: number;
                    institution: string | null;
                    status: string;
                    start_date: string;
                    icon: string;
                    color: string;
                    created_at: string;
                    updated_at: string | null;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    type: string;
                    target_amount?: number;
                    initial_amount?: number;
                    institution?: string | null;
                    status?: string;
                    start_date?: string;
                    icon?: string;
                    color?: string;
                    created_at?: string;
                    updated_at?: string | null;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    name?: string;
                    type?: string;
                    target_amount?: number;
                    initial_amount?: number;
                    institution?: string | null;
                    status?: string;
                    start_date?: string;
                    icon?: string;
                    color?: string;
                    created_at?: string;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'investments_user_id_fkey';
                        columns: ['user_id'];
                        isOneToOne: false;
                        referencedRelation: 'profiles';
                        referencedColumns: ['id'];
                    }
                ];
            };
            investment_contributions: {
                Row: {
                    id: string;
                    investment_id: string;
                    amount: number;
                    occurred_at: string;
                    notes: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    investment_id: string;
                    amount: number;
                    occurred_at?: string;
                    notes?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    investment_id?: string;
                    amount?: number;
                    occurred_at?: string;
                    notes?: string | null;
                    created_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'investment_contributions_investment_id_fkey';
                        columns: ['investment_id'];
                        isOneToOne: false;
                        referencedRelation: 'investments';
                        referencedColumns: ['id'];
                    }
                ];
            };
        };
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
